/* lib/metrics/types.ts
   -------------------------------------------------------------- */

/** Re-usable option shape for dropdowns / checkbox lists */
export type SelectOption = { value: string; label: string };

/* ──────────────────────────────────────────────────────────────
   MetricFieldDef
   ────────────────────────────────────────────────────────────
   Common props  +  widget-specific discriminated union
────────────────────────────────────────────────────────────── */
type Shared = {
  /** dot-path, e.g. "shoulder.dropped" */
  name:    string;
  label:   string;
  step?:   number | string;
  section?: string;                 // accordion header (optional)
};

export type MetricFieldDef =
  /* numeric (default) ---------------------------------------- */
  | (Shared & { widget?: 'number'; step?: number | string })

  /* <select> dropdown ---------------------------------------- */
  | (Shared & { widget: 'select'; options: SelectOption[] })

  /* checkbox list (optionally with Optimal toggle) ----------- */
  | (Shared & {
      widget: 'checkbox-group';
      options: SelectOption[];
      toggle?: boolean;
    })

  /* legacy side-pain widget (two segmented pickers) ---------- */
  | (Shared & { widget: 'side-pain'; painLabel?: string })

  /* NEW – L / R checkbox pair ------------------------------- */
  | (Shared & { widget: 'checkbox-LR' })

  /* NEW – single checkbox (spine rows) ---------------------- */
  | (Shared & { widget: 'checkbox-single' });

/* ──────────────────────────────────────────────────────────────
   MetricSchema
   ──────────────────────────────────────────────────────────── */
export type MetricSchema = {
  slug : string;                // e.g. "exbodyArticular"
  title: string;                // human-readable section title
  fields: MetricFieldDef[];

  /** optional transform for complex widgets */
  toPayload?: (raw: Record<string, any>) => unknown;
};