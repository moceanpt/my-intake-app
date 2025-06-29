/* components/DeviceForm.tsx
   -------------------------------------------------------------- */
   import React, { useMemo } from 'react';
   import {
     FormProvider,
     useForm,
     Controller,
     SubmitHandler,
   } from 'react-hook-form';
   
   import type { MetricSchema } from '@/lib/metrics/types';
   import MetricField    from '@/components/ui/MetricField';
   import CheckboxLR     from '@/components/ui/CheckboxLR';
   import SingleCheckbox from '@/components/ui/SingleCheckbox';
   import RegionHeader   from '@/components/ui/RegionHeader';
   
   /* optional colour list for dropdown widgets ------------------ */
   export const COLOUR_OPTIONS = [
     { value: 'blackish_red', label: 'Blackish Red (90)' },
     { value: 'red',          label: 'Red / Bright Red (80)' },
     { value: 'dark_orange',  label: 'Dark Orange (75)' },
     { value: 'orange',       label: 'Orange (70)' },
     { value: 'orangish_yellow', label: 'Orangish Yellow (65)' },
     { value: 'yellow',       label: 'Yellow (60)' },
     { value: 'yellowish_green', label: 'Yellowish Green (55)' },
     { value: 'green',        label: 'Green (50)' },
     { value: 'greenish_blue',label: 'Greenish Blue (45)' },
     { value: 'blue',         label: 'Blue (40)' },
     { value: 'bluish_violet',label: 'Bluish Violet (35)' },
     { value: 'indigo',       label: 'Indigo / Violet (30)' },
     { value: 'violet_purple',label: 'Violet-Purple (25)' },
     { value: 'purple',       label: 'Purple (20)' },
     { value: 'white',        label: 'White (10)' },
   ] as const;
   
   /* ──────────────────────────────────────────────────────────────
      helpers — flatten fields & group by section
      ──────────────────────────────────────────────────────────── */
   function flattenFields(s: MetricSchema | any): MetricSchema['fields'] {
     if (Array.isArray(s.fields)) return s.fields;             // flat schema
     if (s.ui) return flattenFields(s.ui);                     // wrapper
     if (Array.isArray(s.groups))                              // grouped schema
       return s.groups.flatMap((g: any) =>
         g.fields.map((f: any) => ({ ...f, section: g.section }))
       );
     return [];
   }
   
   function groupBySection(fields: MetricSchema['fields']) {
     return fields.reduce<Record<string, typeof fields>>((acc, f) => {
       const key = (f as any).section ?? 'root';
       (acc[key] ??= []).push(f);
       return acc;
     }, {});
   }
   
   /* ──────────────────────────────────────────────────────────────
      main component
      ──────────────────────────────────────────────────────────── */
   interface Props {
     schema: MetricSchema;
     submissionId: string;
     onDone?: () => void;
   }
   
   export default function DeviceForm({
     schema,
     submissionId,
     onDone = () => {},
   }: Props) {
     const methods  = useForm<Record<string, any>>();
     const grouped  = useMemo(() => groupBySection(flattenFields(schema)), [schema]);
   
     /* submit ---------------------------------------------------- */
     const save: SubmitHandler<Record<string, any>> = async (values) => {
       await fetch('/api/metrics', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body  : JSON.stringify({ submissionId, device: schema.slug, values }),
       });
       onDone();
     };
   
     /* render ---------------------------------------------------- */
     return (
       <FormProvider {...methods}>
         <form onSubmit={methods.handleSubmit(save)} className="space-y-6">
           {Object.entries(grouped).map(([section, fields]) => (
             <RegionHeader
               key={section}
               name={section}
               title={
                 schema.groups?.find((g: any) => g.section === section)?.title ?? section
               }
             >
               {fields.map((f) => {
                 /* ---------- L/R checkbox pair ------------------- */
                 if (f.widget === 'checkbox-LR') {
                    const path = f.name as const;
                    return (
                      <div
                        key={f.name}
                        data-widget="checkbox-LR"                       /* ← flag for RegionHeader */
                        className="grid grid-cols-[minmax(12rem,1fr)_auto_auto] gap-x-4 items-center"
                      >
                        <label>{f.label}</label>
                        <Controller
                          control={methods.control}
                          name={path}
                          defaultValue={{ L: false, R: false }}
                          render={({ field }) => (
                            <CheckboxLR value={field.value as any} onChange={field.onChange} />
                          )}
                        />
                      </div>
                    );
                  }
   
                 /* ---------- single checkbox (spine rows) -------- */
                 if (f.widget === 'checkbox-single') {
                    const path = f.name as const;
                    return (
                      <div
                        key={f.name}
                        data-widget="checkbox-single"
                        className="grid grid-cols-[minmax(12rem,1fr)_auto] gap-x-4 items-center"
                      >
                        <label>{f.label}</label>
                        <Controller
                          control={methods.control}
                          name={path}
                          defaultValue={false}
                          render={({ field }) => (
                            <SingleCheckbox value={field.value as boolean} onChange={field.onChange} />
                          )}
                        />
                      </div>
                    );
                  }
                 /* ---------- dropdown (select) ------------------- */
                 if (f.widget === 'select') {
                   return (
                     <div key={f.name}>
                       <label className="block font-medium mb-1">{f.label}</label>
                       <select
                         className="select select-bordered w-full"
                         defaultValue=""
                         {...methods.register(f.name, { required: true })}
                       >
                         <option value="" disabled>
                           — choose —
                         </option>
                         {(f.options ?? COLOUR_OPTIONS).map((opt) => (
                           <option key={opt.value} value={opt.value}>
                             {opt.label}
                           </option>
                         ))}
                       </select>
                     </div>
                   );
                 }
   
                 /* ---------- numeric / fallback ------------------ */
                 return (
                   <MetricField
                     key={f.name}
                     {...f}
                     register={methods.register}
                   />
                 );
               })}
             </RegionHeader>
           ))}
   
           <div className="pt-4">
             <button type="submit" className="btn btn-primary">
               Save&nbsp;{schema.title}
             </button>
           </div>
         </form>
       </FormProvider>
     );
   }