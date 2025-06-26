# ocr-service/ocr_service.py  – run with:  uvicorn ocr_service:app --host 0.0.0.0 --port 8000
from typing import Dict, Any, List

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from textract_helper import (
    extract_bodycomp_metrics,
    extract_bodycomp_text,   # helper for image/Textract text fallback
)  # ← close the parenthesis here!

import fitz, pdfplumber, io, re, unicodedata, string   # pytesseract/PIL no longer used

# If Tesseract isn’t on PATH:
# pytesseract.pytesseract.tesseract_cmd = "/usr/local/bin/tesseract"

app = FastAPI(title="MOCEAN OCR service")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_credentials=True,
    allow_methods=["*"],  allow_headers=["*"],
)

# ─────────────── normaliser  ─────────────── #
_RE_SPLIT_DEC  = re.compile(r"(\d)\s+(\d)")                # 2 3 . 9 → 23 .9
_RE_INSIDE     = re.compile(r"(?<=\d)[A-Za-z\s]+(?=\d)")   # 7S 00 → 700
_SWAP = str.maketrans({"O":"0","o":"0",
                       "S":"5","s":"5",
                       "I":"1","l":"1",
                       "B":"8"})

def normalise(txt: str) -> str:
    "Squash junk that appears *inside* numbers before regex parsing."
    txt = unicodedata.normalize("NFKD", txt)
    txt = "".join(ch for ch in txt if ch in string.printable)
    txt = _RE_SPLIT_DEC.sub(r"\1\2", txt)       # 23 .9
    txt = _RE_INSIDE.sub("", txt.translate(_SWAP))
    return txt




# ─────────────── PATTERNS ─────────────── #
PATTERNS: Dict[str, Dict[str, str]] = {
    # InBody ──────────────────────────────────────────────
      "inbody": {
        # up to 40 chars (incl. \n) between label and value
        "weight"      : r"\bWeight\b.{0,120}?(\d{2,3}[.,]\d)",
        "bmi"         : r"\bBMI\b.{0,120}?(\d{1,2}[.,]\d)",
        "pbf"         : r"\bPBF\b.{0,120}?(\d{1,2}[.,]\d)",
        "smm"         : r"\bSMM\b.{0,120}?(\d{1,3}[.,]\d)",
        "tbw"         : r"Total\s+Body\s+Water.{0,40}?(\d{1,3}[.,]\d)",
        "tbw_percent" : r"TBW\s*%.{0,120}?(\d{1,2}[.,]\d)",
        "ecw_tbw"     : r"ECW\/TBW.{0,120}?(\d[.,]\d{2,3})",
        "vfa"         : r"Visceral\s+Fat\s+(?:Area|Level).{0,40}?(\d{2,3})",
        "phase_angle" : r"Phase\s+Angle.{0,120}?(\d[.,]\d)",
        "bmr"         : r"\bBMR\b.{0,120}?(\d{3,4})",
    },
    # HRV ────────────────────────────────────────────────
    "hrv": {
        "rmssd"     : r"\bRMSSD\b.*?(\d{1,3}\.\d+)",
        "sdnn"      : r"\bSDNN\b.*?(\d{1,3}\.\d+)",
        "coherence" : r"\bCoherence\b.*?(\d{1,3})%",
        "hrv_index" : r"HRV[-_ ]?Index.*?(\d{1,2}\.\d+)",
    },
    # Omni-Fit ───────────────────────────────────────────
    "omnifit": {
        "tp"        : r"\bTP\s*Value.*?(\d+\.\d+)",
        "sns_ratio" : r"SNS\s*Activity.*?(\d+\.\d+)",
        "pns_ratio" : r"PNS\s*Activity.*?(\d+\.\d+)",
        "vitality"  : r"Physical\s+Vitality.*?(Vitality|Lethargic|Normal|Tension|Energetic)",
    },
    # Auracom ────────────────────────────────────────────
    "auracom": {
        "ava_score"        : r"Ava\s+Score.*?(\d{2,4})",
        "stability"        : r"\bStability\b.*?(\d{1,3})",
        "vigor"            : r"\bVigor\b.*?(\d{1,3})",
        "activity_percent" : r"Activity[- ]?Relaxation.*?(\d{1,3})%",
        "wood"   : r"\nA\s+(\d{2,3})\b",
        "fire"   : r"\nB\s+(\d{2,3})\b",
        "earth"  : r"\nC\s+(\d{2,3})\b",
        "metal"  : r"\nD\s+(\d{2,3})\b",
        "water"  : r"\nE\s+(\d{2,3})\b",
    },
    # Exbody ─────────────────────────────────────────────
    "exbody": {
        "msk_index"          : r"Musculoskeletal\s+Index.*?(\d{2,3})",
        "misalignment_index" : r"Misalignment\s+Index.*?(\d{2,3})",
        "imbalance_index"    : r"Imbalance\s+Index.*?(\d{2,3})",
        "fhp_angle"          : r"\bFHP\b.*?(-?\d{1,2})°",
        "pcmt"               : r"\bPCMT\b.*?(\d{1,2}\.\d{1,2})",
        "pelvic_tilt"        : r"Pelvic\s+Tilt.*?(-?\d{1,2})°",
        "shoulder_tilt"      : r"Shoulder\s+Tilt.*?(-?\d{1,2})°",
        "weight_left"        : r"Left\s+Weight.*?(\d{1,2})%",
        "weight_right"       : r"Right\s+Weight.*?(\d{1,2})%",
        "knee_angle_l"       : r"Left\s+Knee.*?(\d{1,3})°",
        "knee_angle_r"       : r"Right\s+Knee.*?(\d{1,3})°",
        "body_deviation"     : r"Body\s+imbalance\s+score.*?(\d{1,2})",
    },
}

# ─────────────── helpers ─────────────── #
def parse_metrics(text: str) -> Dict[str, Any]:
    """Run regex groups and an InBody fallback; return flat + detail dicts."""
    detail: Dict[str, Dict[str, Any]] = {grp: {} for grp in PATTERNS}
    flat: Dict[str, Any] = {}

    # ① primary label-based patterns
    for group, fields in PATTERNS.items():
        for key, pat in fields.items():
            m = re.search(pat, text, flags=re.I | re.S)
            if m:
                raw = ".".join(m.groups()) if len(m.groups()) == 2 else m.group(1)
                raw = raw.replace(",", ".")
                try:
                    val = float(raw)
                except ValueError:
                    val = raw
                detail[group][key] = val
                flat[key] = val

    # ② fallback for InBody when PBF still missing
    if ("[InBody" in text or "Weight (tb)" in text) and "pbf" not in flat:
        w_match = re.search(r"Weight", text, re.I)
        if w_match:
            # slice: from Weight line to Body Mass Index label (or 1200-char fallback)
            start = w_match.end()
            end_match = re.search(r"Body\s+Fat\s+Mass", text[start:start + 4000], re.I)
            end = start + (end_match.start() if end_match else 3500)
            snippet = text[start:end]

            # after: snippet = text[start:end]
            print("— SLICE START —")
            print(snippet[:400].replace("\n", "⏎"))
            print("— SLICE END —")
            print(snippet[-400:].replace("\n", "⏎"))

            # decimal extractor (no digit before/after, allows '23  .9')
            dec_pat = re.compile(
                r"(?<!\d)"                 # no digit before
                r"\d{1,3}\s{0,2}[.,]\s?\d{1,2}"  # the decimal
                r"(?![\dA-Za-z])"          # no digit *or letter* after
            )
            decimals = [
                float(d.replace(" ", "").replace(",", "."))
                for d in dec_pat.findall(snippet)
                if 5 <= float(d.replace(" ", "").replace(",", ".")) <= 120
            ]

            print("⮕ DEC :", decimals)

            # bucket the four metrics (weight already captured)
            for num in decimals:
                if 5 <= num <= 50 and "pbf" not in flat:
                    flat["pbf"] = num
                elif 20 <= num <= 120 and "smm" not in flat:
                    flat["smm"] = num
                elif 10 <= num <= 60 and "bmi" not in flat:
                    flat["bmi"] = num
                elif 3 <= num <= 9 and "phase_angle" not in flat:
                    flat["phase_angle"] = num

            # VFA inside same slice
            m_vfa = re.search(r"Visceral[^0-9]{0,200}?(\d{2,3})", snippet, re.I | re.S)
            if m_vfa:
                flat["vfa"] = int(m_vfa.group(1))

            # sync detail
            detail.setdefault("inbody", {}).update({
                k: v for k, v in flat.items()
                if k in {"weight", "pbf", "smm", "bmi", "phase_angle", "vfa"}
            })

    # ③ done
    return {"metrics": flat, "detail": detail}

# ─────────────── ROUTE ─────────────── #
@app.post("/extract")
async def extract(files: List[UploadFile] = File(...)) -> Dict[str, Any]:
    if not files:
        raise HTTPException(status_code=400, detail="No PDF(s) provided")

    all_flat, all_detail, skipped, errors = {}, {}, [], []

    for f in files:
        # 1 ▸ load PDF ----------------------------------------------------
        try:
            pdf_bytes = await f.read()
            doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        except Exception as err:
            errors.append(f"{f.filename}: {err}")
            continue

# ─────────────── Textract path for InBody PDFs ───────────────
        if f.filename.lower().endswith("inbody.pdf"):
            try:
                metrics = extract_bodycomp_metrics(pdf_bytes)
                all_flat.update(metrics)
                detail = all_detail.setdefault(f.filename, {})
                detail.setdefault("inbody", {}).update(metrics)
                print("[DBG] Textract metrics:", metrics)
                continue          # skip to next file; no OCR needed
            except Exception as err:
                print(f"[WARN] {f.filename} Textract failed: {err}")
                # fall back to legacy OCR below
            

        # 2 ▸ text layer --------------------------------------------------
        raw_text = ""
        try:
            with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf_p:
                for p in pdf_p.pages:
                    raw_text += "\n" + (p.extract_text(x_tolerance=1.5) or "")
        except Exception as e:
            print(f"[WARN] pdfplumber failed on {f.filename}: {e}")

        

        # DEBUG banner (only for InBody PDFs) -----------------------------
        if f.filename.lower().endswith("inbody.pdf"):
            print("▼ OCR dump (first 600 chars) ------------------------------")
            print(raw_text[:600])
            print("▲-----------------------------------------------------------")
        print(f"[DBG] {f.filename}  OCR chars: {len(raw_text)}")

        # 4 ▸ parse & merge ----------------------------------------------
        clean_text = normalise(raw_text)

        # --- DEBUG: first 400 chars of cleaned text  (remove when done)
        print("CLEAN ⟶", clean_text[:400].replace("\n", "⏎"))

        parsed = parse_metrics(clean_text)
        if not parsed["metrics"]:
            skipped.append(f.filename)
            continue

        all_flat.update(parsed["metrics"])
        all_detail[f.filename] = parsed["detail"]

    # 5 ▸ response -------------------------------------------------------
    return {
        "metrics": all_flat,
        "detail":  all_detail,
        "skipped": skipped,
        "errors":  errors,
    }