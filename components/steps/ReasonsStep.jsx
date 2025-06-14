/* components/steps/ReasonsStep.jsx
   --------------------------------------------------------- */
   import Reasons        from '../Reasons';
   import DiscomfortStep from './DiscomfortStep';
   
   const merge = (o, p) => Object.assign({}, o, p);
   
   export default function ReasonsStep({ data, set, setVal }) {
     const choices = data.reasons;
     const other   = data.reasonsOther ?? '';
   
     /* ----- helpers ----- */
     const updateChoices = (u) =>
       set((prev) => merge(prev, { reasons: typeof u === 'function' ? u(prev.reasons) : u }));
     const setOther = (txt) => set((prev) => merge(prev, { reasonsOther: txt }));
   
     /* ----- UI ----- */
     return (
       <>
         <h2 className="text-lg font-medium mb-2">
           What brings you to&nbsp;MOCEAN?{' '}
           <span className="text-sm text-gray-500">(select all that apply)</span>
         </h2>
   
         {/* reason chips */}
         <Reasons choices={choices} setChoices={updateChoices} />
   
         {/* free-text when “Something else” */}
         {choices.includes('Something else') && (
           <input
             type="text"
             value={other}
             onChange={(e) => setOther(e.target.value)}
             placeholder="Tell us what you have in mind…"
             className="border rounded w-full p-2 text-sm mt-3"
           />
         )}
   
         {/* ── show Discomfort step only if “Lasting pain relief” picked ── */}
         {choices.includes('Pain relief / injury care') && (
           <div className="mt-8">
             {/* removed duplicate heading */}
             <DiscomfortStep data={data} setVal={setVal} />
           </div>
         )}
       </>
     );
   }