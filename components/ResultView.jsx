/* components/ResultView.jsx
   ------------------------------------------------------------ */
   import SymptomResultSheet   from '@/components/ui/SymptomResultSheet';
   import LifestyleResultSheet from '@/components/ui/LifestyleResultSheet';
   import React from 'react';
   import ObjectiveResultSheet from './ObjectiveResultSheet';
   
   // Sample mock data for InBody
   const mockInBodyData = {
     hydration: 55.6,
     smm_pct: 43.2,
     body_fat_pct: 23.9,
     ecw_tbw: 0.371,
     vfa: 81.9,
     phase_angle: 6.7,
     weight: 185.1,
     body_fat_mass: 44.2,
     smm_mass: 80.0,
     tbw: 103.0,
   };
   
   const mockInBodyHistory = [
     { date: '2024-01-01', weight: 176.0, body_fat_mass: 35.5, smm_mass: 80.0, tbw: 99.0 },
     { date: '2024-02-01', weight: 181.1, body_fat_mass: 38.0, smm_mass: 78.3, tbw: 100.5 },
     { date: '2024-03-01', weight: 180.5, body_fat_mass: 37.0, smm_mass: 78.7, tbw: 101.2 },
     { date: '2024-04-01', weight: 186.3, body_fat_mass: 40.0, smm_mass: 80.5, tbw: 102.0 },
     { date: '2024-05-01', weight: 191.2, body_fat_mass: 44.0, smm_mass: 82.2, tbw: 104.0 },
     { date: '2024-06-01', weight: 184.0, body_fat_mass: 41.0, smm_mass: 79.4, tbw: 101.5 },
     { date: '2024-07-01', weight: 185.7, body_fat_mass: 42.5, smm_mass: 78.3, tbw: 102.8 },
     { date: '2024-08-01', weight: 185.1, body_fat_mass: 44.2, smm_mass: 80.0, tbw: 103.0 },
   ];
   
   const ResultView = () => {
     return (
       <div style={{ maxWidth: 900, margin: '0 auto', padding: 32 }}>
         <h1>Results Demo</h1>
         <ObjectiveResultSheet
           inbodyData={mockInBodyData}
           inbodyHistory={mockInBodyHistory}
           sex="M"
           age={35}
         />
       </div>
     );
   };
   
   export default ResultView;