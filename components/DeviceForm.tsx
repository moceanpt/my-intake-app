/* components/DeviceForm.tsx - Redesigned with Design System
   -------------------------------------------------------------- */
   import React, { useMemo, useState, useEffect } from 'react';
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
   import Card           from '@/components/ui/Card';
   import AIDocumentUpload from '@/components/ui/AIDocumentUpload';
   import ROMTable from '@/components/ui/ROMTable';
   
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
     const [showAIUpload, setShowAIUpload] = useState(false);
     const [aiError, setAiError] = useState(null);
     const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
     const [fileLoading, setFileLoading] = useState(true);
   
     // Fetch uploaded file on mount
     useEffect(() => {
       let ignore = false;
       async function fetchFile() {
         setFileLoading(true);
         try {
           const res = await fetch(`/api/uploaded-files?submissionId=${submissionId}&device=${schema.slug}`);
           if (!res.ok) throw new Error('No file found');
           const data = await res.json();
           if (!ignore && data.fileUrl) {
             setUploadedFileUrl(data.fileUrl);
             if (data.extractedData) {
               Object.entries(data.extractedData).forEach(([key, value]) => {
                 if (value !== null && value !== undefined) {
                   methods.setValue(key, value);
                 }
               });
             }
           }
         } catch (err) {
           if (!ignore) setUploadedFileUrl(null);
         } finally {
           if (!ignore) setFileLoading(false);
         }
       }
       fetchFile();
       return () => { ignore = true; };
     }, [submissionId, schema.slug]);
   
     /* submit ---------------------------------------------------- */
     const save: SubmitHandler<Record<string, any>> = async (values) => {
       await fetch('/api/metrics', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body  : JSON.stringify({ submissionId, device: schema.slug, values }),
       });
       onDone();
     };
   
     // AI data extraction handlers
     const handleDataExtracted = (data, fileUrl) => {
       Object.entries(data).forEach(([key, value]) => {
         if (value !== null && value !== undefined) {
           methods.setValue(key, value);
         }
       });
       
       // Store file URL if provided
       if (fileUrl) {
         methods.setValue('_uploadedFileUrl', fileUrl);
         setUploadedFileUrl(fileUrl);
       }
       
       setShowAIUpload(false);
       setAiError(null);
     };
     const handleAIError = (error) => {
       setAiError(error);
     };
   
     /* render ---------------------------------------------------- */
     return (
       <div className="min-h-screen bg-secondary-50">
         <div className="container py-8">
           {/* Header */}
           <div className="mb-8">
             <h1 className="text-3xl font-bold text-secondary-900 mb-2">
               {schema.title} Assessment
             </h1>
             <p className="text-secondary-600">
               Enter metrics for client assessment
             </p>
             {/* AI Upload Toggle */}
             <div className="mt-4">
               <button
                 type="button"
                 onClick={() => setShowAIUpload(!showAIUpload)}
                 className="btn btn-outline btn-primary"
               >
                 {showAIUpload ? 'Hide' : 'Show'} AI Document Upload
               </button>
             </div>
           </div>
           {/* AI Document Upload Section */}
           {showAIUpload && (
             <div className="mb-6">
               <AIDocumentUpload
                 deviceType={schema.slug as 'inbody' | 'auracom' | 'heartmath' | 'exbody' | 'omnifit'}
                 submissionId={submissionId}
                 onDataExtracted={handleDataExtracted}
                 onError={handleAIError}
               />
             </div>
           )}
           {/* AI Error Display */}
           {aiError && (
             <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
               <div className="flex items-center space-x-2">
                 <div className="text-red-500">⚠️</div>
                 <div className="text-red-700">
                   <p className="font-medium">AI Extraction Error:</p>
                   <p className="text-sm">{aiError}</p>
                 </div>
               </div>
             </div>
           )}
           
           {/* Uploaded File Preview */}
           {uploadedFileUrl && (
             <div className="mb-6">
               <div className="font-semibold mb-2">Uploaded File Preview</div>
               {uploadedFileUrl.match(/\.(png|jpe?g|webp|gif)$/i) ? (
                 <img
                   src={uploadedFileUrl}
                   alt="Uploaded file preview"
                   className="max-w-full max-h-80 border rounded shadow"
                 />
               ) : uploadedFileUrl.match(/\.pdf$/i) ? (
                 <iframe
                   src={uploadedFileUrl}
                   title="Uploaded PDF preview"
                   className="w-full h-96 border rounded shadow"
                 />
               ) : (
                 <div className="text-gray-500">Cannot preview this file type.</div>
               )}
             </div>
           )}
           <FormProvider {...methods}>
             <form onSubmit={methods.handleSubmit(save)} className="space-y-6">
               {Object.entries(grouped).map(([section, fields]) => (
                 <Card key={section}>
                   <Card.Header>
                     <h2 className="text-xl font-semibold text-secondary-900">
                       {(schema as any).groups?.find((g: any) => g.section === section)?.title ?? section}
                     </h2>
                   </Card.Header>
                   <Card.Body>
                     <div className="space-y-6">
                       {fields.map((f) => {
                         /* ---------- L/R checkbox pair ------------------- */
                         if (f.widget === 'checkbox-LR') {
                            const path = f.name;
                            return (
                              <div
                                key={f.name}
                                data-widget="checkbox-LR"
                                className="grid grid-cols-[minmax(12rem,1fr)_auto_auto] gap-x-4 items-center"
                              >
                                <label className="form-label">{f.label}</label>
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
                            const path = f.name;
                            return (
                              <div
                                key={f.name}
                                data-widget="checkbox-single"
                                className="grid grid-cols-[minmax(12rem,1fr)_auto] gap-x-4 items-center"
                              >
                                <label className="form-label">{f.label}</label>
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
                         /* ---------- ROM table widget ------------------- */
                         if (f.widget === 'rom-table') {
                           return (
                             <ROMTable
                               key={f.name}
                               name={f.name}
                               label={f.label}
                               romType={f.romType}
                             />
                           );
                         }

                         /* ---------- dropdown (select) ------------------- */
                         if (f.widget === 'select') {
                           return (
                             <div key={f.name} className="form-field">
                               <label className="form-label">{f.label}</label>
                               <select
                                 className="form-input"
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
                             name={f.name}
                             label={f.label}
                             step={f.step}
                             register={methods.register}
                           />
                         );
                       })}
                     </div>
                   </Card.Body>
                 </Card>
               ))}
   
               <div className="flex justify-end gap-4">
                 <button 
                   type="button" 
                   className="btn btn-secondary"
                   onClick={onDone}
                 >
                   Cancel
                 </button>
                 <button 
                   type="submit" 
                   className="btn btn-primary"
                 >
                   Save {schema.title}
                 </button>
               </div>
             </form>
           </FormProvider>
         </div>
       </div>
     );
   }