import { useState } from 'react';
import { OBJECTIVE_FORMS } from '@/lib/objective';   // <- re-exported registry

/* helper to post {submissionId, metrics} to /api/metrics */
async function saveMetrics(submissionId, payload){
  const res = await fetch('/api/metrics', {
    method :'POST',
    headers:{'Content-Type':'application/json'},
    body   :JSON.stringify({ submissionId, metrics: payload })
  });
  if(!res.ok) throw new Error(await res.text());
}

export default function AssessmentEntryStep({ submissionId, onSuccess }){
  const [stage, setStage]   = useState('pick');   // 'pick' | deviceId
  const [values, setValues] = useState({});       // flat key → value
  const [busy,   setBusy]   = useState(false);

  /* ------------------------------------------------------------------ *
   * 1 · DEVICE-PICKER STAGE                                            *
   * ------------------------------------------------------------------ */
  if(stage==='pick'){
    return (
      <section className="space-y-6">
        <h2 className="text-lg font-semibold">Select assessment device</h2>

        <div className="grid sm:grid-cols-2 gap-4">
          {Object.entries(OBJECTIVE_FORMS).map(([id,{label}])=>(
            <button key={id}
                    className="border p-4 rounded hover:bg-gray-50"
                    onClick={()=>setStage(id)}>
              {label}
            </button>
          ))}
        </div>
      </section>
    );
  }

  /* ------------------------------------------------------------------ *
   * 2 · DATA-ENTRY STAGE                                               *
   * ------------------------------------------------------------------ */
  const form  = OBJECTIVE_FORMS[stage].form;   // array from the module
  const goBack= ()=>setStage('pick');

  const set = (k,v)=> setValues(prev=>({...prev,[k]:v}));

  const submit = async()=>{
    try{
      setBusy(true);
      await saveMetrics(submissionId, values);
      onSuccess();              // navigate back to dashboard / plan page
    }catch(err){ alert(err.message||'Error'); }
    finally{ setBusy(false); }
  };

  return (
    <section className="space-y-6">
      <h2 className="text-lg font-semibold">{OBJECTIVE_FORMS[stage].label}</h2>

      {form.map(([key,label,unit,min,max])=>(
        <label key={key} className="block space-y-1">
          <span>{label}{unit && ` (${unit})`}</span>
          <input type="number" step="any" min={min} max={max}
                 value={values[key]??''}
                 onChange={e=>set(key, e.target.value)}
                 className="border rounded w-full p-2"/>
        </label>
      ))}

      <div className="flex gap-4 pt-4">
        <button type="button" className="btn" onClick={goBack}>← Devices</button>
        <button type="button" className="btn btn-primary"
                disabled={busy} onClick={submit}>
          {busy? 'Saving…':'Save & Generate Plan'}
        </button>
      </div>
    </section>
  );
}