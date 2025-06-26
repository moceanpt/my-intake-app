import { band } from './utils';          // tiny helper shared by modules

type InBodyMetrics = {
  ecw_tbw?: number;    // ratio
  phase_angle?: number;
  vfa?: number;        // cm²
  rmssd?: number;      // ms
};

export function scoreInBody(m: InBodyMetrics) {
  /* -------------------------------- radar spokes (0-10) */
  const radar: Record<string, number> = {
    musculoskeletal: 10,
    organ_digest_hormone_detox: 10,
    circulation: 10,
    energy: 10,
    articular_joint: 10,
    nervous_system: 10,
  };

  /* ECW/TBW ➜ circulation */
  if (m.ecw_tbw !== undefined) {
    const r = m.ecw_tbw;
    radar.circulation = Math.max(0,
      r <= 0.38 ? 9 : r <= 0.39 ? 7 : r <= 0.40 ? 5 : r <= 0.419 ? 3 : 1);
  }

  /* Phase-angle ➜ musculoskeletal + energy */
  if (m.phase_angle !== undefined) {
    const pa = m.phase_angle;
    const val = pa >= 6 ? 9 : pa >= 5.5 ? 7 : pa >= 5 ? 5 : pa >= 4.5 ? 3 : 1;
    radar.musculoskeletal = val;
    radar.energy          = val;
  }

  /* VFA ➜ gut  */
  if (m.vfa !== undefined) {
    const v = m.vfa;
    radar.organ_digest_hormone_detox = v < 100 ? 9 : v < 130 ? 6 : v < 150 ? 4 : 2;
  }

  /* RMSSD ➜ nervous & stress bucket */
  if (m.rmssd !== undefined) {
    const h = m.rmssd;
    radar.nervous_system = h >= 60 ? 9 : h >= 45 ? 7 : h >= 30 ? 5 : h >= 20 ? 3 : 1;
  }

  /* -------------------------------- optimisation buckets */
  const bucket = {
    cellular:    0,
    energy:      0,
    gut:         0,
    stress:      0,
    circulation: 0,
    brain:       0,
    physical:    0,
    performance: 0,
  };

  // NB: re-use same band() helper you already have (0/1/2)
  bucket.circulation += band(radar.circulation);
  bucket.cellular    += band(radar.musculoskeletal);
  bucket.energy      += band(radar.energy);
  bucket.gut         += band(radar.organ_digest_hormone_detox);
  bucket.brain       += band(radar.nervous_system);
  bucket.stress      += band(radar.nervous_system);

  return { radar, bucket };
}