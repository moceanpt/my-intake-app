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
  | (Shared & { widget: 'checkbox-single' })

  /* NEW – ROM table with Left/Right columns ----------------- */
  | (Shared & { 
      widget: 'rom-table'; 
      romType: string;  // e.g., 'neck', 'shoulder', 'trunk', 'hip'
    })

  /* NEW – ExBody table with single value columns ------------- */
  | (Shared & { 
      widget: 'exbody-table'; 
      tableType: string;  // e.g., 'deviation', 'alignment'
    })

  /* NEW – InBody table with single value columns ------------- */
  | (Shared & { 
      widget: 'inbody-table'; 
      tableType: string;  // e.g., 'composition', 'cellular'
    })

  /* NEW – OmniFit table with PPG/EEG sections -------------- */
  | (Shared & { 
      widget: 'omnifit-table'; 
      tableType: string;  // e.g., 'ppg', 'eeg'
    })

  /* NEW – AuraCom table with TCM sections ----------------- */
  | (Shared & { 
      widget: 'auracom-table'; 
      tableType: string;  // e.g., 'overall', 'elements'
    })

  /* NEW – HeartMath table with HRV sections ---------------- */
  | (Shared & { 
      widget: 'heartmath-table'; 
      tableType: string;  // e.g., 'basic', 'spectrum'
    });

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