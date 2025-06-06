/* components/steps/ReasonsStep.jsx
   -------------------------------- */
   import Reasons from '../Reasons';
   import Chip from '../ui/Chip';

   /* helper: shallow-merge utility  */
   const merge = (obj, patch) => Object.assign({}, obj, patch);
   
   export default function ReasonsStep({ data, set }) {
     /* ---- state shortcuts ------------------------------------------ */
     const choices     = data.reasons;          // array of selected chips
     const other       = data.reasonsOther ?? ''; // optional text field
   
     /* ---- updaters -------------------------------------------------- */
     const updateChoices = (updater) =>
       set((prev) =>
         merge(prev, {
           reasons: typeof updater === 'function' ? updater(prev.reasons)
                                                  : updater,
         })
       );
   
     const setOther = (txt) =>
       set((prev) => merge(prev, { reasonsOther: txt }));
   
     /* ---- render ---------------------------------------------------- */
     return (
       <>
         <h2 className="text-lg font-medium mb-2">
           What brings you to&nbsp;MOCEAN?{' '}
           <span className="text-sm text-gray-500">(choose&nbsp;up&nbsp;to&nbsp;three)</span>
         </h2>
   
         {/* chip list (max 3) */}
         <Reasons choices={choices} setChoices={updateChoices} />
   
         {/* free-text box appears only if “Something else” is chosen */}
         {choices.includes('Something else') && (
           <input
             type="text"
             value={other}
             onChange={(e) => setOther(e.target.value)}
             placeholder="Tell us what you have in mind…"
             className="border rounded w-full p-2 text-sm mt-3"
           />
         )}
       </>
     );
   }