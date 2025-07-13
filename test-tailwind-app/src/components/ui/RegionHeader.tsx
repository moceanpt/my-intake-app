/* components/ui/RegionHeader.tsx
   -------------------------------------------------------------- */
   import { useController, useFormContext } from 'react-hook-form';
   import type { FC } from 'react';
   
   interface Props {
     name: string;          // section key ("shoulder", "spine", …)
     title: string;         // UI heading
     children: React.ReactNode;
   }
   
   /* quick util – does this region contain any checkbox-LR rows? */
   const hasLR = (children: React.ReactNode) =>
     (Array.isArray(children) ? children : [children]).some(
       (n: any) => n?.props?.['data-widget'] === 'checkbox-LR'
     );
   
   const RegionHeader: FC<Props> = ({ name, title, children }) => {
     const { control, unregister, setValue } = useFormContext();
     const { field } = useController({ name: `${name}.__optimal`, control, defaultValue: true });
   
     const toggle = (state: boolean) => {
       field.onChange(state);
       if (state) {
         unregister(name);
         setValue(`${name}.__optimal`, true);
       }
     };
   
     const showLR = hasLR(children);
   
     return (
       <details open={!field.value} className="border rounded">
         <summary className="flex items-center justify-between px-4 py-2 bg-gray-100 cursor-pointer">
           <span className="font-semibold">{title}</span>
           <label className="inline-flex items-center gap-1">
             <input
               type="checkbox"
               className="checkbox checkbox-sm"
               checked={field.value}
               onChange={(e) => toggle(e.target.checked)}
             />
             Optimal
           </label>
         </summary>
   
         {!field.value && (
           <div className="p-4 space-y-2">
             {/* Header row “L  R” if needed */}
             {showLR && (
               <div className="grid grid-cols-[minmax(12rem,1fr)_auto_auto] gap-x-4 text-xs font-semibold text-gray-500">
                 <span /> <span>L</span> <span>R</span>
               </div>
             )}
   
             {children}
           </div>
         )}
       </details>
     );
   };
   
   export default RegionHeader;