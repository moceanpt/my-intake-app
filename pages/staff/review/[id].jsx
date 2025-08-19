/* ------------------------------------------------------------------
   pages/staff/review/[id].jsx
   ------------------------------------------------------------------ */
   import prisma        from '../../../lib/prisma';       // default export
   import ResultView    from '../../../components/ResultView';
   import Link          from 'next/link';
   import { chipToLabel } from '../../../lib/chipUtils';
   import { HISTORY_SECTIONS, HISTORY_LABEL } from '../../../lib/historySchema';
   import Card from '@/components/ui/Card';
   import Button from '@/components/ui/Button';
   import { 
     calculateWeightedSymptomScore, 
     getSeverityInfo, 
     getSymptomsByArea,
     getAreaConfig 
   } from '@/lib/symptomScoring';
   import { mapChipCodes } from '@/lib/chipMapping';

   /* ---------- 1. SSR: load intake + preview plan ------------------- */
   export async function getServerSideProps({ params }) {
     const sub = await prisma.intakeSubmission.findUnique({
       where  : { id: params.id },
       include: { planResults: { where: { stage: 'preview' } } },
     });
   
     if (!sub) return { notFound: true };
   
     const previewRow = sub.planResults[0]?.resultJson ?? null;
   
     return {
       props: {
         submission: {
           id          : sub.id,
           clientId    : sub.clientId,
           reasons     : sub.rawReasons       ?? [],
           symptomChips: sub.symptomChips     ?? {},
           sliderValues: sub.sliderValues     ?? {},
           discomfort  : sub.rawDiscomfort   ?? {},
           history     : sub.rawHistory      ?? {},
           preview     : previewRow
             ? JSON.parse(JSON.stringify(previewRow))
             : null,
         },
       },
     };
   }
   
   /* ---------- 2. Page component ----------------------------------- */
   export default function ReviewIntake({ submission }) {
     const { id, reasons, symptomChips, sliderValues, preview, discomfort, history } = submission;
   
     /* ---- normalise older preview payloads (single `radar`) -------- */
     const previewData = preview
    ? {
        ...preview,
        radarSubjective : preview.radarSubjective ?? preview.radar ?? {},
        discomfort,
        history,
        }
    : null;

    /* ---- PREVIEW ONLY · hide fields that are "final-plan" items ---- */
    if (previewData) {
    delete previewData.radarObjective;   // no device radar yet
    delete previewData.optimisation;     // no focus buckets yet
    delete previewData.services;         // no service list yet
    }
   
       return (
        <main className="max-w-3xl mx-auto p-6 space-y-6">
          {/* Header with navigation */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-secondary-900">Intake Review</h1>
            <div className="flex gap-3">
              <Link href={`/staff/result/${id}`}>
                <Button variant="primary" size="sm">
                  📊 View MOCEAN Results
                </Button>
              </Link>
              <Link href="/staff/dashboard">
                <Button variant="secondary" size="sm">
                  ← Dashboard
                </Button>
              </Link>
            </div>
          </div>
      
          {/* 1 ─ Reasons & goals */}
          <Card>
            <Card.Header>
              <h2 className="font-semibold text-secondary-900">Reasons&nbsp;&amp;&nbsp;Goals</h2>
            </Card.Header>
            <Card.Body>
              {reasons.length ? (
                <ul className="list-disc pl-6">
                  {reasons.map((r,i)=><li key={i}>{r}</li>)}
                </ul>
              ) : <p className="text-secondary-500">— none selected —</p>}
            </Card.Body>
          </Card>
      
          {/* 2 ─ Current discomfort */}
          {Object.keys(discomfort).length > 0 && (
            <Card>
              <Card.Header>
                <h2 className="font-semibold text-secondary-900">Current&nbsp;Discomfort</h2>
              </Card.Header>
              <Card.Body>
                <ul className="list-disc pl-6 text-sm">
                  {Object.entries(discomfort).map(([k,v]) =>
                    v ? <li key={k}><b>{k}</b>: {String(v)}</li> : null)}
                </ul>
              </Card.Body>
            </Card>
          )}
      
          {/* 3 ─ Health background / history */}
          {HISTORY_SECTIONS.some(sec =>
            sec.items.some(([k]) => history[k])        // show the card only if
            ) && (                                       // at least one flag is true
            <Card>
              <Card.Header>
                <h2 className="font-semibold text-secondary-900">Health&nbsp;Background</h2>
              </Card.Header>
              <Card.Body>
                <div className="space-y-4">
                  {HISTORY_SECTIONS.map(sec => {
                    const hits = sec.items.filter(([k]) => history[k]);
                    if (hits.length === 0) return null;    // skip empty section

                    return (
                      <div key={sec.id}>
                        <p className="font-medium text-secondary-900">{sec.title}</p>
                        <ul className="list-disc pl-5 text-sm">
                          {hits.map(([k]) => (
                            <li key={k}>{HISTORY_LABEL[k]}</li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </Card.Body>
            </Card>
            )}
      
          {/* 4 ─ Health snapshot (subjective only) */}
          {previewData && (
            <Card>
              <Card.Header>
                <h2 className="font-semibold text-secondary-900">Health&nbsp;Snapshot</h2>
              </Card.Header>
              <Card.Body>
                <ResultView data={previewData} readOnly />
              </Card.Body>
            </Card>
          )}
      
          {/* 5 ─ Selected symptoms with weighted scoring */}
          <Card>
            <Card.Header>
              <h2 className="font-semibold mb-2 text-secondary-900">Selected Symptoms & Weighted Severity</h2>
            </Card.Header>
            <Card.Body>
              <div className="space-y-6">
                {[
                  ['musculoskeletal','Musculoskeletal'],
                  ['organ_digest_hormone_detox','Organ/Digestion/Hormone/Detox'], 
                  ['circulation','Circulation'],
                  ['energy','Energy'],
                  ['articular_joint','Articular/Joints'],
                  ['nervous_system','Nervous System']
                ].map(([key, label]) => {
                  const rawChips = symptomChips[key] ?? [];
                  const mappedChips = mapChipCodes(rawChips);
                  const sliderValue = sliderValues[key]?.main || 0;
                  
                  // Use slider value for clinical severity assessment (0-10, where 10 = worst)
                  const clinicalSeverity = sliderValue;
                  const severityInfo = getSeverityInfo(clinicalSeverity);
                  
                  // Calculate symptom analysis for treatment planning (separate from clinical severity)
                  const symptomAnalysis = calculateWeightedSymptomScore(0, mappedChips, key); // No slider influence
                  const areaConfig = getAreaConfig(key);
                  
                  return (
                    <div key={key} className="bg-white border border-secondary-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                      {/* Header Section */}
                      <div className="bg-gradient-to-r from-secondary-50 to-secondary-100 px-6 py-4 border-b border-secondary-200 rounded-t-xl">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl font-semibold text-secondary-900">{label}</h3>
                          <div className="flex items-center gap-3">
                            <span className="text-2xl font-bold text-secondary-700">{clinicalSeverity}/10</span>
                            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${severityInfo.color.replace('text-', 'bg-').replace('600', '100')} ${severityInfo.color} border`}>
                              {severityInfo.label}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          {/* Clinical Severity Section */}
                          <div>
                            <h4 className="text-sm font-semibold text-secondary-800 mb-3 flex items-center">
                              <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
                              Clinical Severity Assessment
                            </h4>
                            
                            <div className="mb-4">
                              <div className="w-full bg-secondary-200 rounded-full h-4 mb-2">
                                <div 
                                  className={`h-4 rounded-full ${severityInfo.color.replace('text-', 'bg-')} transition-all duration-500 shadow-inner`}
                                  style={{ width: `${(clinicalSeverity / 10) * 100}%` }}
                                ></div>
                              </div>
                              <p className="text-sm text-secondary-700 mb-2 leading-relaxed">{severityInfo.description}</p>
                              <p className="text-xs text-secondary-500 italic">
                                Based on patient's self-reported impact on daily activities
                              </p>
                            </div>
                          </div>

                          {/* Treatment Planning Section */}
                          <div>
                            <div className="mb-3">
                              <h4 className="text-sm font-semibold text-secondary-800 mb-2 flex items-center">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                Treatment Targets & Impact Levels
                                {mappedChips.length > 0 && (
                                  <span className="ml-auto text-xs bg-secondary-100 px-2 py-1 rounded-full text-secondary-600">
                                    Complexity: {symptomAnalysis.totalScore.toFixed(1)}/10
                                  </span>
                                )}
                              </h4>
                              

                            </div>
                            
                            {mappedChips.length > 0 ? (
                              <div className="space-y-2">
                                {mappedChips.map(symptomCode => {
                                  const symptom = symptomAnalysis.breakdown.weightedSymptoms.find(s => s.code === symptomCode);
                                  const weight = symptom?.weight || 1.0;
                                  const impactConfig = weight >= 2.0 
                                    ? { label: 'High Impact', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200', dot: 'bg-red-500' }
                                    : weight >= 1.5 
                                    ? { label: 'Medium Impact', color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200', dot: 'bg-orange-500' }
                                    : { label: 'Low Impact', color: 'text-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-200', dot: 'bg-yellow-500' };
                                  
                                  return (
                                    <div key={symptomCode} className={`${impactConfig.bg} ${impactConfig.border} border rounded-lg p-3 transition-all duration-200 hover:shadow-sm`}>
                                      <div className="flex items-center gap-3">
                                        <div className="flex items-center shrink-0">
                                          {weight >= 2.0 ? (
                                            <div className="w-5 h-5 rounded-full" style={{ border: '3px solid #ef4444', backgroundColor: '#ef4444' }}></div>
                                          ) : weight >= 1.5 ? (
                                            <div className="w-5 h-5 rounded-full" style={{ border: '3px solid #f97316', backgroundColor: '#f97316' }}></div>
                                          ) : (
                                            <div className="w-5 h-5 rounded-full" style={{ border: '3px solid #eab308', backgroundColor: '#eab308' }}></div>
                                          )}
                                        </div>
                                        <div className="flex-1">
                                          <span className="text-sm font-medium text-secondary-900 leading-tight">
                                            {symptom?.label || chipToLabel(symptomCode)}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <div className="text-center py-6 text-secondary-400 bg-secondary-50 rounded-lg border-2 border-dashed border-secondary-200">
                                <div className="text-2xl mb-2">—</div>
                                <p className="text-sm font-medium">No specific treatment targets identified</p>
                                <p className="text-xs">Patient reported symptoms but no specific targets selected</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card.Body>
          </Card>
   
         {/* ── Continue to Metrics entry ── */}
         <div className="flex gap-4">
           <Link href={`/staff/enter/${id}`}>
             <Button variant="primary">
               Looks&nbsp;good&nbsp;— Enter&nbsp;Metrics&nbsp;→
             </Button>
           </Link>

           {/* ── Back to Dashboard ── */}
           <Link href="/staff/dashboard">
             <Button variant="secondary">
               ←&nbsp;Back&nbsp;to&nbsp;Dashboard
             </Button>
           </Link>
         </div>
        </main>
        );
     }