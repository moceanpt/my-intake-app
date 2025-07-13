/* components/ui/SideSelector.tsx
   -------------------------------------------------------------- */
   import type { FC } from 'react';
   import clsx from 'clsx';
   
   /** Segmented picker for Side / Pain (NONE, L, R, B) */
   export type Side = 'NONE' | 'L' | 'R' | 'B';
   const options: Side[] = ['NONE', 'L', 'R', 'B'];
   
   /**
    * Tailwind can't create CSS for dynamic strings, so we map a **whitelist**
    * of colours → class names.  Add more keys here + safelist them in
    * tailwind.config.js if you need extra colours.
    */
   const COLOR_CLASS: Record<string, string> = {
     'indigo-600': 'bg-indigo-600',
     'blue-600'  : 'bg-blue-600',
     'emerald-600': 'bg-emerald-600',
     'rose-600'  : 'bg-rose-600',
     'amber-600' : 'bg-amber-600',
   };
   
   interface Props {
     value?: Side;
     onChange: (v: Side) => void;
     /** Tailwind palette key, e.g. "blue-600" (default: "indigo-600") */
     selectedColor?: keyof typeof COLOR_CLASS;
   }
   
   const SideSelector: FC<Props> = ({
     value = 'NONE',
     onChange,
     selectedColor = 'indigo-600',
   }) => {
     const activeBg = COLOR_CLASS[selectedColor] ?? COLOR_CLASS['indigo-600'];
   
     return (
       <div className="inline-flex rounded border shadow-sm overflow-hidden select-none">
         {options.map((opt) => (
           <button
             key={opt}
             type="button"
             onClick={(e) => {
               e.preventDefault(); // keep focus; stop form submit
               onChange(opt);
             }}
             className={clsx(
               'w-10 text-xs border-r last:border-r-0 focus:outline-none transition-colors',
               value === opt
                 ? `${activeBg} text-white`
                 : 'bg-white text-gray-700 hover:bg-gray-100'
             )}
           >
             {opt === 'NONE' ? '–' : opt}
           </button>
         ))}
       </div>
     );
   };
   
   export default SideSelector;