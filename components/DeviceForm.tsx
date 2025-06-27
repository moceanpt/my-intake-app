/* components/DeviceForm.tsx
   -------------------------------------------------------------- */
   import React                     from 'react';
   import { FormProvider, useForm } from 'react-hook-form';
   import MetricField               from '@/components/ui/MetricField';
   import type { MetricSchema }     from '@/lib/metrics/types';
   
   /* ──────────────────────────────────────────────────────────────
      1.  Shared colour reference for AuraCom dropdowns
      ──────────────────────────────────────────────────────────── */
   export const COLOUR_OPTIONS = [
     { value: 'blackish_red',    label: 'Blackish Red (90)'       },
     { value: 'red',             label: 'Red / Bright Red (80)'   },
     { value: 'dark_orange',     label: 'Dark Orange (75)'        },
     { value: 'orange',          label: 'Orange (70)'             },
     { value: 'orangish_yellow', label: 'Orangish Yellow (65)'    },
     { value: 'yellow',          label: 'Yellow (60)'             },
     { value: 'yellowish_green', label: 'Yellowish Green (55)'    },
     { value: 'green',           label: 'Green (50)'              },
     { value: 'greenish_blue',   label: 'Greenish Blue (45)'      },
     { value: 'blue',            label: 'Blue (40)'               },
     { value: 'bluish_violet',   label: 'Bluish Violet (35)'      },
     { value: 'indigo',          label: 'Indigo / Violet (30)'    },
     { value: 'violet_purple',   label: 'Violet-purple (25)'      },
     { value: 'purple',          label: 'Purple (20)'             },
     { value: 'white',           label: 'White (10)'              },
   ] as const;
   
   /* ──────────────────────────────────────────────────────────────
      2.  Component props
      ──────────────────────────────────────────────────────────── */
      interface Props {
        /** UI-schema produced by the device module */
        schema       : MetricSchema | undefined;
        submissionId : string;
        onDone       : () => void;
    }
   
   /* ──────────────────────────────────────────────────────────────
      3.  Helper — group fields by section label
      ──────────────────────────────────────────────────────────── */
      function groupBySection(fields: MetricSchema['fields'] = []) {
          return fields.reduce<Record<string, typeof fields>>((acc, f) => {
       const key = f.section ?? '';            // empty = “no heading”
       (acc[key] ??= []).push(f);
       return acc;
     }, {});
   }
   
   /* ──────────────────────────────────────────────────────────────
      4.  Main component
      ──────────────────────────────────────────────────────────── */
   export default function DeviceForm({ schema, submissionId, onDone }: Props) {
     const methods = useForm();
     const { handleSubmit } = methods;
   
     const save = async (values: Record<string, any>) => {
       await fetch('/api/metrics', {
         method : 'POST',
         headers: { 'Content-Type':'application/json' },
         body   : JSON.stringify({
           submissionId,
           device : schema.slug,
           values : schema.toPayload ? schema.toPayload(values) : values,
         }),
       });
       onDone();
     };
   
     const grouped = groupBySection(schema?.fields);
   
     /* ---------------------------------------------------- render */
     return (
       <FormProvider {...methods}>
         <form onSubmit={handleSubmit(save)} className="space-y-6">
   
           {Object.entries(grouped).map(([section, fields]) => (
             <div key={section || 'root'} className="space-y-4">
   
               {section && (
                 <h3 className="text-lg font-semibold">
                   {section}
                 </h3>
               )}
   
               {fields.map(f =>
                 f.widget === 'select' ? (
                   /* dropdown ----------------------------------- */
                   <div key={f.name}>
                     <label className="block font-medium mb-1">{f.label}</label>
                     <select
                       className="select select-bordered w-full"
                       defaultValue=""
                       {...methods.register(f.name, { required: true })}
                     >
                       <option value="" disabled>— choose —</option>
                       {(f.options ?? COLOUR_OPTIONS).map(opt => (
                         <option key={opt.value} value={opt.value}>
                           {opt.label}
                         </option>
                       ))}
                     </select>
                   </div>
                 ) : (
                   /* numeric input ----------------------------- */
                   <MetricField
                     key={f.name}
                     {...f}
                     register={methods.register}
                   />
                 )
               )}
             </div>
           ))}
   
           {/* action row --------------------------------------- */}
           <div className="flex gap-4 pt-4">
           <button type="submit" className="btn btn-primary">
                      Save&nbsp;{schema?.title ?? 'metrics'}
             </button>
           </div>
         </form>
       </FormProvider>
     );
   }