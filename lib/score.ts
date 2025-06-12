import questionSchema from '@/components/questions/questionSchema';

type PillarScoreMap = R

export function calcSymptomsScore(hc: Record<string, any> = {}): PillarScoreMap {
  const out: PillarScoreMap = {
    muscle: 0,
    organ: 0,
    circulation: 0,
    emotion: 0,
    articular: 0,
    nervous: 0,
  };

  Object.values(questionSchema.health).forEach((section) =>
    section.forEach((q) => {
      if (q.type === 'multi') {
        const val = hc[q.id];
        if (Array.isArray(val)) {
          out[q.pillar] += val.length;
        }
      }
    })
  );

  return out;
}

export function calcLifestyleScore(life = {}) {
  const lifestylePillars = Array.from(new Set(
    Object.values(questionSchema.lifestyle).flat().map(q => q.lifestyle_pillar)
  ));

  const out = Object.fromEntries(lifestylePillars.map(p => [p, 0]));
  const maxPts = Object.fromEntries(lifestylePillars.map(p => [p, 0]));

  Object.values(questionSchema.lifestyle).forEach(section =>
    section.forEach(q => {
      const val = life[q.id];
      if (val == null) return;

      const ptsArr = (q.risk_points || '')
        .split(',')
        .map(x => parseInt(x.trim()))
        .filter(n => !isNaN(n));
      if (ptsArr.length === 0) return;

      const pillar = q.lifestyle_pillar;
      maxPts[pillar] += Math.max(...ptsArr);

      if (q.type === 'single' && typeof val === 'string') {
        const idx = q.options.indexOf(val);
        out[pillar] += ptsArr[idx] || 0;

      } else if (q.type === 'multi' && Array.isArray(val)) {
        if (ptsArr.length === 1) {
          out[pillar] += val.length === q.options.length ? 0 : ptsArr[0];
        } else {
          if (val.length >= 2) out[pillar] += ptsArr[0];
          else if (val.length === 1) out[pillar] += ptsArr[1];
          else out[pillar] += ptsArr[2];
        }
      }
    })
  );

  return Object.fromEntries(lifestylePillars.map(p => {
    const raw = out[p];
    const maxRaw = maxPts[p];
    const pct = maxRaw > 0 ? 100 - Math.round((raw / maxRaw) * 100) : 100;
    return [p, pct];
  }));
}

export function calcSupport(): PillarScoreMap {
  return {
    muscle: 10,
    organ: 10,
    circulation: 10,
    emotion: 10,
    articular: 10,
    nervous: 10,
  };
}

export function normalizeScore(raw: Record<string, number>, max = 10): Record<string, number> {
  const out = {} as Record<string, number>;
  Object.keys(raw).forEach(p => {
    const val = raw?.[p] ?? 0;
    out[p] = Math.min(10, Math.round((val / max) * 10));
  });
  return out;
}