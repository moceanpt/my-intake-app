import questionSchema from '@/components/questions/questionSchema';

/** map coded chip ID → human-readable label */
export function chipToLabel(code: string): string {
  // e.g. "energy_symptoms_4"  →  "energy_symptoms"  +  "4"
  const m = code.match(/(.+)_([0-9]+)$/);
  if (!m) return code;                       // unexpected → show raw code
  const [ , idPrefix, idxStr ] = m;
  const idx = Number(idxStr);

  // search every pillar's questions for a matching idPrefix
  for (const section of Object.values(questionSchema.health)) {
    const q = section.find(q => q.id === idPrefix);
    if (q && 'options' in q && Array.isArray(q.options) && q.options[idx] !== undefined) {
      return q.options[idx];
    }
  }

  // (optional) look in lifestyle schema too
  for (const section of Object.values(questionSchema.lifestyle)) {
    const q = section.find(q => q.id === idPrefix);
    if (q && 'options' in q && Array.isArray(q.options) && q.options[idx] !== undefined) {
      return q.options[idx];
    }
  }

  return code;                                // fallback
}