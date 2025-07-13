import questionSchema from '@/components/questions/questionSchema';

const CHIP_LOOKUP = (() => {
  const map: Record<string,string> = {};
  Object.values(questionSchema.health).flat().forEach(q => {
    if ('options' in q && Array.isArray(q.options)) {
      q.options.forEach((label, idx) => {
        map[`${q.id}_${idx}`] = label;
      });
    }
  });
  return map;
})();

export const chipToLabel = (code: string) => CHIP_LOOKUP[code] ?? code;