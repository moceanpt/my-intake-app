/** convert 0-10 to optimisation band: 0 pts (8-10), 1 pt (6-7), 2 pt (≤5) */
export const band = (v: number) => (v >= 8 ? 0 : v >= 6 ? 1 : 2);