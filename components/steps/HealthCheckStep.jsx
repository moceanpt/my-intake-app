/* components/steps/HealthCheckStep.jsx
   ------------------------------------ */
   import { Fragment } from 'react';
   import Chip from '../ui/Chip';          // ✔ adjust if your path differs
   
   export default function HealthCheckStep({ data, setVal, toggle }) {
     /* ───────────────────── shortcuts ───────────────────── */
     const hc       = data.hc;        // chip arrays, keyed by cat
     const notes    = data.hcNotes;   // per-section note strings
     const openMap  = data.hcOpen;    // YES/NO flags (expand / collapse)
   
     /* pick / toggle helpers */
     const pick    = (cat, chip) => toggle(['hc', cat], chip);
     const setOpen = (cat, v)    => setVal(['hcOpen',  cat], v);
     const setNote = (cat, txt)  => setVal(['hcNotes', cat], txt);
   
     /* ───────────────────── generic section ───────────────────── */
     const Section = ({ heading, cat, question, chips }) => {
       const isOpen = openMap[cat];
       const any    = hc[cat].length > 0;
   
       return (
         <div className="border rounded p-4 space-y-3">
           <h3 className="font-semibold">{heading}</h3>
   
           {/* YES / NO toggle */}
           <label className="flex items-center gap-3">
             <input
               type="checkbox"
               checked={isOpen}
               onChange={(e) => {
                 const v = e.target.checked;
                 setOpen(cat, v);
                 if (!v) {
                   setVal(['hc', cat], []);    // clear chips
                   setNote(cat, '');           // clear note
                 }
               }}
             />
             <span className="font-medium">{question}</span>
           </label>
   
           {isOpen && (
             <Fragment>
               <p className="text-xs text-gray-500 -mt-1">
                 Select all that apply
               </p>
   
               <div className="flex flex-wrap gap-2">
                {chips.map(({ code, label }) => (
                    <Chip
                    key={code}
                    code={code}              // pass the code to Chip (optional)
                    label={label}
                    active={hc[cat].includes(code)}
                    onClick={() => pick(cat, code)}
                    />
                ))}
                </div>
   
               {any && (
                 <textarea
                   rows={2}
                   className="w-full rounded border p-2 text-sm"
                   placeholder="Add note (optional)"
                   value={notes[cat]}
                   onChange={(e) => setNote(cat, e.target.value)}
                 />
               )}
             </Fragment>
           )}
         </div>
       );
     };
   
     /* ---------- (4) Energy & Emotional composite ------------- */
const EnergySection = () => {
    const cat   = 'ene'
    const isOpen = openMap[cat]
    const any    = hc[cat].length > 0
  
    const groups = [
      {
        label: 'Energy',
        chips: [
          { code:'ENE_Fatigue',      label:'Persistent fatigue / energy crashes' },
          { code:'ENE_Overheat',     label:'Overheating easily or night sweats' },
          { code:'ENE_LowDrive',     label:'Low morning drive / low libido' },
          { code:'ENE_CaffeineNeed', label:'Need caffeine to function' },
          { code:'ENE_CFS',          label:'Diagnosed CFS / fibromyalgia / post-infection' },
          { code:'ENE_BodyComp',     label:'Body-composition change (belly fat, muscle loss)' },
        ],
      },
      {
        label: 'Sleep Quality',
        chips: [
          { code:'ENE_SleepTrouble',     label:'Trouble falling asleep / busy mind' },
          { code:'ENE_MidNightWake',     label:'Wake up in the middle of the night' },
          { code:'ENE_InsomniaRestless', label:'Sleep disturbances (insomnia, restless legs)' },
          { code:'ENE_Unrefreshed',      label:'Waking up tired / unrefreshed' },
          { code:'ENE_MorningGroggy',    label:'Difficulty waking up in the morning' },
          { code:'ENE_Apnea',            label:'Snoring / possible sleep-apnea' },
        ],
      },
      {
        label: 'Emotion & Mood',
        chips: [
          { code:'ENE_Anxiety',          label:'Anxiety or panic attacks' },
          { code:'ENE_MoodSwings',       label:'Mood swings / emotional eating' },
          { code:'ENE_LowMotivation',    label:'Low motivation / lack of joy' },
          { code:'ENE_Burnout',          label:'Feeling overwhelmed or burned out' },
          { code:'ENE_StressManage',     label:'Difficulty managing stress' },
          { code:'ENE_Disconnect',       label:'Feeling disconnected from your body' },
          { code:'ENE_EmotionalReactive',label:'Feeling emotionally reactive / easily triggered' },
        ],
      },
    ]
  
    return (
      <div className="border rounded p-4 space-y-3">
        <h3 className="font-semibold">Energy &amp; Emotional System</h3>
  
        {/* YES / NO */}
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={isOpen}
            onChange={e => {
              const v = e.target.checked
              setOpen(cat, v)
              if (!v) {
                setVal(['hc', cat], [])
                setNote(cat, '')
              }
            }}
          />
          <span className="font-medium">Do you struggle with steady energy, sleep, or mood?</span>
        </label>
  
        {isOpen && (
          <>
            <p className="text-xs text-gray-500 -mt-1">Select all that apply</p>
  
            {groups.map(g => (
              <div key={g.label} className="space-y-1 mb-3">
                <h4 className="text-sm font-semibold">{g.label}</h4>
                <div className="flex flex-wrap gap-2">
                  {g.chips.map(c => (
                    <Chip
                      key={c.code}
                      label={c.label}
                      active={hc[cat].includes(c.code)}
                      onClick={() => pick(cat, c.code)}
                    />
                  ))}
                </div>
              </div>
            ))}
  
            {any && (
              <textarea
                rows={2}
                className="w-full rounded border p-2 text-sm"
                placeholder="Add note (optional)"
                value={notes[cat]}
                onChange={e => setNote(cat, e.target.value)}
              />
            )}
          </>
        )}
      </div>
    )
  }
   
     /* ────────────────────────── render ────────────────────────── */
     return (
       <section className="space-y-6">
         <h2 className="text-lg font-medium mb-2">5. MOCEAN Health Check</h2>
   
         {/* 1 — Musculoskeletal */}
         <Section
            heading="Musculoskeletal System"
            cat="msk"
            question="Do your muscles often feel tight, sore, or weak?"
            chips={[
                { code:'MSK_NeckTension',     label:'Persistent neck / shoulder tension' },
                { code:'MSK_LowBackTight',    label:'Low-back tightness or spasms' },
                { code:'MSK_Cramps',          label:'Muscle cramps or restless legs' },
                { code:'MSK_SlowRecovery',    label:'Slow recovery after workouts' },
                { code:'MSK_Weakness',        label:'Muscle weakness / poor exercise tolerance' },
                { code:'MSK_StrengthLoss',    label:'Noticeable strength loss' },
                { code:'MSK_RecurrentStrain', label:'Recurring muscle strains / tears' },
                { code:'MSK_TendonChronic',   label:'Chronic tendon pain (Achilles, elbow, rotator cuff)' }
            ]}
            />
   
         {/* 2 — Organ / Gut / Detox */}
            <Section
            heading="Organ System – Digestion · Hormone · Detox"
            cat="org"
            question="Do you experience digestion, hormone, or detox troubles?"
            chips={[
                { code:'ORG_Bloat',            label:'Bloating / gas' },
                { code:'ORG_Reflux',           label:'Heartburn / reflux' },
                { code:'ORG_ConstDiarr',       label:'Constipation or diarrhea' },
                { code:'ORG_FoodSens',         label:'Food sensitivities / sugar-carb cravings' },
                { code:'ORG_PostMealFatigue',  label:'Fatigue right after meals' },
                { code:'ORG_LiverSkin',        label:'Liver / skin changes (itchy skin, dark urine)' },
                { code:'ORG_ChemSens',         label:'Chemical or alcohol sensitivity' },
                { code:'ORG_Antibiotic',       label:'Frequent antibiotics / chronic sinus-yeast' },
                { code:'ORG_Metabolic',        label:'Metabolic syndrome (high cholesterol, sugar)' },
                { code:'ORG_IBS',              label:'IBS diagnosis' }
            ]}
            />
   
         {/* 3 — Circulatory */}
            <Section
            heading="Circulatory System"
            cat="circ"
            question="Do you notice poor blood or lymph flow?"
            chips={[
                { code:'CIRC_Raynaud',         label:'Cold or numb hands / feet (Raynaud’s)' },
                { code:'CIRC_Varicose',        label:'Varicose veins or leg cramps' },
                { code:'CIRC_Swelling',        label:'Swelling / puffiness / limb heaviness' },
                { code:'CIRC_SkinFlares',      label:'Skin issues / flares (eczema, rashes)' },
                { code:'CIRC_SlowHealing',     label:'Slow healing or easy bruising' },
                { code:'CIRC_AutoInflam',      label:'Inflammatory / auto-immune issue' },
                { code:'CIRC_HighCRP',         label:'Lab-high inflammation (CRP, ESR)' },
                { code:'CIRC_Orthostatic',     label:'Dizzy or light-headed on standing' },
                { code:'CIRC_LowImmunity',     label:'Frequent cold sores / slow immune recovery' },
                { code:'CIRC_HighBP',          label:'High blood pressure' },
                { code:'CIRC_ColdIntolerance', label:'Cold intolerance' }
            ]}
            />
   
         {/* 4 — Energy & Emotional (custom) */}
         <EnergySection />
   
         {/* 5 — Articular Joint */}
         <Section
            heading="Articular Joint System"
            cat="art"
            question="Do joints limit your daily movement or exercise?"
            chips={[
                { code:'ART_StiffKneeHip',   label:'Stiff knees / hips on waking' },
                { code:'ART_ShoulderPinch',  label:'Shoulder pinch or limited reach' },
                { code:'ART_AnklePain',      label:'Ankle / foot pain during gait' },
                { code:'ART_Clicking',       label:'Clicking or grinding joints' },
                { code:'ART_WeatherFlare',   label:'Pain that flares with weather' },
                { code:'ART_RecentSprain',   label:'Recent sprain / overuse injury' },
                { code:'ART_Swelling',       label:'Joint swelling or redness' },
                { code:'ART_LimitsADL',      label:'Joint pain that limits daily activities' },
                { code:'ART_JointSurgery',   label:'History of joint surgery / replacement' }
            ]}
            />
   
         {/* 6 — Nervous System */}
            <Section
            heading="Nervous System"
            cat="nerv"
            question="Do focus, headaches, or nerve issues bother you?"
            chips={[
                { code:'NERV_BrainFog',     label:'Brain-fog / memory lapses' },
                { code:'NERV_Focus',        label:'Trouble focusing / distractibility' },
                { code:'NERV_Headache',     label:'Headaches / migraines' },
                { code:'NERV_Tinnitus',     label:'Tinnitus or ear pressure' },
                { code:'NERV_Concussion',   label:'Concussion or head-injury history' },
                { code:'NERV_PinsNeedles',  label:'Pins-and-needles / numb patches' },
                { code:'NERV_ScreenHigh',   label:'High screen time (6 + hrs)' },
                { code:'NERV_Balance',      label:'Poor coordination or balance' },
                { code:'NERV_NervePain',    label:'Burning or electric nerve pain' },
                { code:'NERV_TempDysreg',   label:'Difficulty regulating body temperature' }
            ]}
            />
       </section>
     );
   }