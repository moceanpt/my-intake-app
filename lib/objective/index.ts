import { scoreInBody } from './inbody';
// import { scoreExBody } from './exbody';  ← add later

/** Merge radars & buckets produced by every scorer that detects a match */
export function scoreObjective(metrics: Record<string, number>) {
  /* ---- call each scorer conditionally ---------------------------- */
  const collectors = [];

  // — InBody available if it has *any* of the keys we care about
  if (['ecw_tbw', 'phase_angle', 'vfa', 'rmssd']
        .some(k => k in metrics))
    collectors.push(scoreInBody(metrics));

  // future:
  // if (exBodyKeys.some(k => k in metrics)) collectors.push(scoreExBody(metrics));

  /* ---- combine results ------------------------------------------- */
  const combinedRadar: Record<string, number> = {};
  const combinedBucket: Record<string, number> = {
    cellular:0, energy:0, gut:0, stress:0,
    circulation:0, brain:0, physical:0, performance:0,
  };

  // start each radar spoke at 10 so “no data” = ideal
  Object.keys(combinedBucket).forEach(k => {});

  collectors.forEach(({ radar, bucket }) => {
    Object.entries(radar).forEach(([k, v]) => {
      combinedRadar[k] = Math.min(v, combinedRadar[k] ?? v);
    });
    Object.entries(bucket).forEach(([k, v]) => {
      combinedBucket[k as keyof typeof combinedBucket] += v;
    });
  });

  // fill still-undefined spokes with 10
  ['musculoskeletal','organ_digest_hormone_detox','circulation',
   'energy','articular_joint','nervous_system'].forEach(k => {
     if (combinedRadar[k] === undefined) combinedRadar[k] = 10;
   });

  return { radar: combinedRadar, bucket: combinedBucket };
}