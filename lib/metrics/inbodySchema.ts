/* lib/metrics/inbodySchema.ts */
import type { MetricSchema } from './types';

export const inBodySchema: MetricSchema = {
  slug : 'inbody',
  title: 'InBody',
  fields: [
    { name: 'vfa',         label: 'Visceral Fat Area (cm²)', step: 1   },
    { name: 'phase_angle', label: 'Phase Angle (°)',         step: 0.1 },
    { name: 'rmssd',       label: 'RMSSD (ms)',              step: 1   },
    { name: 'ecw_tbw',     label: 'ECW / TBW',               step: 0.001 },
    { name: 'smm_pct',     label: 'SMM %',                   step: 0.1 },
  ],
};