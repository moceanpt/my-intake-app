# textract_helper.py
#
# PDF → S3 → Textract TABLES → metric dict  (Weight, PBF, SMM, BMI, Phase Angle)
# ──────────────────────────────────────────────────────────────────────────────
#   • Requires four env-vars:
#       AWS_REGION       e.g.  us-east-2
#       AWS_ACCESS_KEY_ID
#       AWS_SECRET_ACCESS_KEY
#       OCR_S3_BUCKET     an existing bucket the credentials can read/write
#   • IAM policy needs: s3:PutObject/GetObject/DeleteObject + textract:AnalyzeDocument
#   • Nothing else in your FastAPI container changes except the single import
#     and the early-exit block already in ocr_service.py
#
# Test quickly with:
#   python -c "import textract_helper, pathlib, json, sys; \
#              print(json.dumps(textract_helper.extract_bodycomp_metrics( \
#                 pathlib.Path('Inbody.pdf').read_bytes()), indent=2))"
from __future__ import annotations

import os, uuid, boto3, logging
from typing import Dict, Any

# ────────────────────────────── AWS setup ──────────────────────────────
AWS_REGION = os.getenv("AWS_REGION", "us-east-1")
TMP_BUCKET = os.getenv("OCR_S3_BUCKET")           # e.g.  mocean-ocr-tmp
if not TMP_BUCKET:
    raise RuntimeError("env OCR_S3_BUCKET not set – Textract helper disabled")

s3        = boto3.client("s3",        region_name=AWS_REGION)
textract  = boto3.client("textract",  region_name=AWS_REGION)

_log = logging.getLogger("textract_helper")
_log.setLevel(logging.INFO)


# ────────────────────────── helper functions ───────────────────────────
def _table_to_dict(blocks: list[Dict[str, Any]]) -> Dict[int, Dict[int, str]]:
    """
    Return rows[row-idx][col-idx] = cell-text   (indexes start at 1).
    """
    id_lookup = {b["Id"]: b for b in blocks}
    rows: Dict[int, Dict[int, str]] = {}

    for cell in (b for b in blocks if b["BlockType"] == "CELL"):
        r, c = cell["RowIndex"], cell["ColumnIndex"]
        words: list[str] = []
        for rel in cell.get("Relationships", []):
            if rel["Type"] == "CHILD":
                for wid in rel["Ids"]:
                    wblk = id_lookup[wid]
                    if wblk["BlockType"] == "WORD":
                        words.append(wblk["Text"])
        rows.setdefault(r, {})[c] = " ".join(words).strip()

    return rows


def _parse_float(txt: str) -> float | None:
    """
    Robust float-parser for ‘185.1’, ‘23,7’, ‘ 23 .7 ’, or ‘1,234.5’.
    Returns None if parsing fails.
    """
    try:
        t = txt.strip().replace(" ", "")
        # single comma, no dot  → decimal comma
        if t.count(",") == 1 and "." not in t:
            t = t.replace(",", ".")
        # thousands sep
        if t.count(",") > 1:
            t = t.replace(",", "")
        return float(t)
    except Exception:
        return None


# ──────────────────────────── public API ───────────────────────────────
def extract_bodycomp_metrics(pdf_bytes: bytes) -> Dict[str, float]:
    """
    Upload the PDF page, let Textract extract tables, then map
    the five numbers we need.  Returns **only** the metrics that
    could be parsed (empty dict if Textract can’t read the table).
    """
    key = f"tmp/{uuid.uuid4()}.pdf"
    s3.put_object(Bucket=TMP_BUCKET,
                  Key=key,
                  Body=pdf_bytes,
                  ServerSideEncryption="AES256")

    try:
        resp = textract.analyze_document(
            Document={"S3Object": {"Bucket": TMP_BUCKET, "Name": key}},
            FeatureTypes=["TABLES"],
        )
    finally:
        # always clean up
        try:
            s3.delete_object(Bucket=TMP_BUCKET, Key=key)
        except Exception as err:
            _log.warning("could not delete temp object: %s", err)

    blocks = resp["Blocks"]
    if not any(b["BlockType"] == "TABLE" for b in blocks):
        return {}     # nothing recognised

    # choose the *largest* table – on InBody 770 that is the body comp grid
    tables = [b for b in blocks if b["BlockType"] == "TABLE"]
    table_block = max(tables, key=lambda t: t["RowCount"] * t["ColumnCount"])

    # rebuild table text (Textract returns WORDs separately)
    blocks_including_words = blocks  # WORDs are in the same list
    table = _table_to_dict(blocks_including_words)

    # Optional debug – see the structure once and adjust indexes if needed
    # import pprint, json, sys; pprint.pprint(table); sys.exit()

    def _cell(row: int, col: int) -> float | None:
        txt = table.get(row, {}).get(col)
        return _parse_float(txt) if txt else None

    # Index mapping for *typical* InBody-770 PDF
    metrics = {
        "weight"      : _cell( 3, 3),   # Weight (lb / kg) – adjust if needed
        "pbf"         : _cell( 4, 3),   # Percent Body Fat
        "smm"         : _cell( 5, 3),   # Skeletal Muscle Mass
        "bmi"         : _cell( 6, 3),   # BMI
        "phase_angle" : _cell( 7, 3),   # Phase Angle
    }

    # drop items Textract missed
    cleaned = {k: v for k, v in metrics.items() if v is not None}

    if not cleaned:
        _log.warning("Textract ran but no numeric cells parsed")
    else:
        _log.info("Textract metrics extracted: %s", cleaned)

    return cleaned