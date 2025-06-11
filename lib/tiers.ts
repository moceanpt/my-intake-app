// lib/tiers.ts ----------------------------------------------------
export const strainTier = (pct: number) => {
    if (pct >= 50) return { tier: 'High strain',      color: 'bg-red-500'   };
    if (pct >= 25) return { tier: 'Moderate',         color: 'bg-amber-500' };
    if (pct >= 10) return { tier: 'Mild strain',      color: 'bg-yellow-400'};
    return            { tier: 'Optimal',             color: 'bg-green-500' };
  };