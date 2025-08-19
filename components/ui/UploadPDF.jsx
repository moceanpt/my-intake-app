export default function UploadPDF({ data, setResult }) {
    async function handleChoose(e) {
      const files = Array.from(e.target.files ?? []);
      if (!files.length) return;
  
      // ── 1 ▸ loop files → /api/ocr ───────────────────────────────
      const mergedMetrics = {};
  
      for (const file of files) {
        const form = new FormData();
        form.append('file', file);
  
        const ocr = await fetch('/api/ocr', { method:'POST', body:form })
                     .then(r => r.json());
  
        Object.assign(mergedMetrics, ocr.metrics);   // shallow merge
      }
  
      // ── 2 ▸ blended plan  ───────────────────────────────────────
      const plan = await fetch('/api/score', {
        method : 'POST',
        headers: { 'Content-Type':'application/json' },
        body   : JSON.stringify({ hc:data.hc, life:data.life, metrics:mergedMetrics })
      }).then(r => r.json());
  
      setResult(plan);
    }
  
    return (
      <label className="block border-2 border-dashed rounded p-6 text-center cursor-pointer">
        <input
          type="file"
          multiple
          accept="application/pdf"
          className="hidden"
          onChange={handleChoose}
        />
        <span className="text-sm text-gray-600">
          Click or drag-drop <b>one or more</b> PDFs here
        </span>
      </label>
    );
  }