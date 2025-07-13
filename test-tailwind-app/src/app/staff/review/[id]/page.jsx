import prisma from '@/lib/prisma';
import Card from '@/components/ui/Card';
import Link from 'next/link';
import { chipToLabel } from '@/lib/chipLabels';
import { buildSubjectiveRadar } from '@/lib/score';

// Beautiful Hexagonal MOCEAN Radar Component
function MOCEANRadar({ radarData }) {
  const categories = [
    { key: 'musculoskeletal', label: 'Muscle', color: '#10B981', angle: 0 },
    { key: 'organ_digest_hormone_detox', label: 'Organ', color: '#EC4899', angle: 60 },
    { key: 'circulation', label: 'Circulation', color: '#EF4444', angle: 120 },
    { key: 'energy', label: 'Energy', color: '#3B82F6', angle: 180 },
    { key: 'articular_joint', label: 'Articular', color: '#F59E0B', angle: 240 },
    { key: 'nervous_system', label: 'Nervous', color: '#8B5CF6', angle: 300 },
  ];

  const size = 200;
  const center = size / 2;
  const radius = 80;

  // Helper function to convert polar to cartesian coordinates
  const polarToCartesian = (angle, distance) => {
    const radian = (angle - 90) * Math.PI / 180;
    return {
      x: center + distance * Math.cos(radian),
      y: center + distance * Math.sin(radian)
    };
  };

  // Generate hexagon points
  const hexagonPoints = categories.map(cat => {
    const point = polarToCartesian(cat.angle, radius);
    return `${point.x},${point.y}`;
  }).join(' ');

  // Generate radar data points (inverted: 10 = center, 0 = edge)
  const radarPoints = categories.map(cat => {
    const score = radarData[cat.key] || 10;
    const distance = radius * (score / 10); // 10 = center, 0 = edge
    const point = polarToCartesian(cat.angle, distance);
    return `${point.x},${point.y}`;
  }).join(' ');

  return (
    <Card>
      <Card.Header>
        <h2 className="text-xl font-semibold text-secondary-900">
          MOCEAN Health Radar
        </h2>
        <p className="text-secondary-600 mt-1">
          Health balance visualization (10 = optimal, 0 = needs attention)
        </p>
      </Card.Header>
      <Card.Body>
        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* Hexagonal Radar Chart */}
          <div className="relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="transform -rotate-90">
              {/* Background hexagon */}
              <polygon
                points={hexagonPoints}
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="2"
              />
              
              {/* Inner rings */}
              {[0.2, 0.4, 0.6, 0.8].map((scale, i) => (
                <polygon
                  key={i}
                  points={categories.map(cat => {
                    const point = polarToCartesian(cat.angle, radius * scale);
                    return `${point.x},${point.y}`;
                  }).join(' ')}
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="1"
                  strokeDasharray="2,2"
                />
              ))}
              
              {/* Radar fill */}
              <polygon
                points={radarPoints}
                fill="rgba(59, 130, 246, 0.1)"
                stroke="#3B82F6"
                strokeWidth="2"
              />
              
              {/* Center point */}
              <circle
                cx={center}
                cy={center}
                r="3"
                fill="#3B82F6"
              />
              
              {/* Category labels */}
              {categories.map((cat, i) => {
                const labelRadius = radius + 25;
                const point = polarToCartesian(cat.angle, labelRadius);
                const score = radarData[cat.key] || 10;
                
                // Calculate text rotation to make it horizontal
                const textAngle = cat.angle - 90;
                const textRotation = textAngle > 90 && textAngle < 270 ? textAngle + 180 : textAngle;
                
                return (
                  <g key={i}>
                    {/* Line to category */}
                    <line
                      x1={center}
                      y1={center}
                      x2={polarToCartesian(cat.angle, radius).x}
                      y2={polarToCartesian(cat.angle, radius).y}
                      stroke="#E5E7EB"
                      strokeWidth="1"
                    />
                    
                    {/* Category label */}
                    <text
                      x={point.x}
                      y={point.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-xs font-medium fill-current"
                      style={{ color: cat.color }}
                      transform={`rotate(${textRotation} ${point.x} ${point.y})`}
                    >
                      {cat.label}
                    </text>
                    
                    {/* Score label */}
                    <text
                      x={point.x}
                      y={point.y + 15}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-lg font-bold fill-current"
                      style={{ color: cat.color }}
                      transform={`rotate(${textRotation} ${point.x} ${point.y + 15})`}
                    >
                      {score}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Legend and scoring explanation */}
          <div className="flex-1 space-y-4">
            <div>
              <h3 className="font-semibold text-secondary-900 mb-2">Scoring Logic</h3>
              <div className="text-sm text-secondary-600 space-y-1">
                <p>• <strong>10</strong> = Optimal health (no symptoms, low discomfort)</p>
                <p>• <strong>5-7</strong> = Moderate concerns</p>
                <p>• <strong>0-4</strong> = Significant attention needed</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-secondary-900 mb-2">Calculation</h3>
              <div className="text-sm text-secondary-600 space-y-1">
                <p>• <strong>50%</strong> from slider values (client-reported discomfort)</p>
                <p>• <strong>50%</strong> from symptom selection (fewer symptoms = better)</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {categories.map(({ key, label, color }) => {
                const score = radarData[key] || 10;
                const status = score >= 8 ? 'Optimal' : score >= 5 ? 'Moderate' : 'Attention';
                const bgColor = score >= 8 ? 'bg-success-50' : score >= 5 ? 'bg-warning-50' : 'bg-error-50';
                const textColor = score >= 8 ? 'text-success-700' : score >= 5 ? 'text-warning-700' : 'text-error-700';
                
                return (
                  <div key={key} className={`p-3 rounded-lg ${bgColor}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-secondary-700">{label}</span>
                      <span className={`text-sm font-bold ${textColor}`}>{score}</span>
                    </div>
                    <div className={`text-xs ${textColor}`}>{status}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

// Helper function to get readable symptom descriptions
function getSymptomDescriptions(symptomChips) {
  const descriptions = {};
  
  Object.entries(symptomChips).forEach(([category, codes]) => {
    if (Array.isArray(codes) && codes.length > 0) {
      descriptions[category] = codes.map(code => chipToLabel(code)).filter(Boolean);
    }
  });
  
  return descriptions;
}

// Helper function to get readable medical conditions
function getMedicalConditions(medicalHistory) {
  const conditions = [];
  const conditionMap = {
    bp: 'High Blood Pressure',
    ms: 'Multiple Sclerosis',
    pp: 'Postpartum',
    ra: 'Rheumatoid Arthritis',
    ckd: 'Chronic Kidney Disease',
    ibd: 'Inflammatory Bowel Disease',
    psa: 'Psoriatic Arthritis',
    tbi: 'Traumatic Brain Injury',
    hypo: 'Hypothyroidism',
    pcos: 'PCOS',
    preg: 'Pregnancy',
    axspa: 'Axial Spondyloarthritis',
    bleed: 'Bleeding Disorder',
    blood: 'Blood Disorder',
    clots: 'Blood Clots',
    diab1: 'Type 1 Diabetes',
    diab2: 'Type 2 Diabetes',
    heart: 'Heart Disease',
    hyper: 'Hyperthyroidism',
    joint: 'Joint Disease',
    liver: 'Liver Disease',
    lupus: 'Lupus',
    neuro: 'Neurological Condition',
    osteo: 'Osteoporosis',
    pacer: 'Pacemaker',
    asthma: 'Asthma',
    cancer: 'Cancer',
    celiac: 'Celiac Disease',
    immune: 'Immune Disorder',
    kidney: 'Kidney Disease',
    spinal: 'Spinal Condition',
    hormone: 'Hormonal Disorder',
    prediab: 'Prediabetes',
    seizure: 'Seizure Disorder',
    sjogren: 'Sjogren\'s Syndrome',
    steroid: 'Steroid Use',
    surgery: 'Previous Surgery',
    thinner: 'Blood Thinner',
    boneSkin: 'Bone/Skin Condition',
    metabolic: 'Metabolic Disorder',
    photoSkin: 'Photosensitive Skin',
    psoriasis: 'Psoriasis',
    respRenal: 'Respiratory/Renal',
    neuroPathy: 'Neuropathy',
    photoNerve: 'Photosensitive Nerve',
    postpartum: 'Postpartum',
    otherImplant: 'Other Implant'
  };

  Object.entries(medicalHistory).forEach(([key, value]) => {
    if (value === true && conditionMap[key]) {
      conditions.push(conditionMap[key]);
    }
  });

  return conditions;
}

export default async function ReviewIntake({ params }) {
  const { id } = params;
  
  const submission = await prisma.intakeSubmission.findUnique({
    where: { id },
    include: {
      planResults: true,
      surgeries: true,
      implants: true,
      symptoms: true,
    },
  });

  if (!submission) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <Card>
          <Card.Body className="text-center">
            <h1 className="text-2xl font-bold text-secondary-900 mb-4">Submission Not Found</h1>
            <p className="text-secondary-600 mb-6">The requested intake submission could not be found.</p>
            <Link href="/dashboard" className="btn btn-primary">
              Back to Dashboard
            </Link>
          </Card.Body>
        </Card>
      </div>
    );
  }

  // Generate MOCEAN radar data
  const radarData = buildSubjectiveRadar(submission.symptomChips, submission.sliderValues);
  
  // Get readable symptom descriptions
  const symptomDescriptions = getSymptomDescriptions(submission.symptomChips);
  
  // Get readable medical conditions
  const medicalConditions = getMedicalConditions(submission.rawHistory);

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-secondary-900 mb-2">
                Review Intake
              </h1>
              <p className="text-secondary-600">
                Client ID: {submission.clientId || 'Anonymous'}
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/dashboard" className="btn btn-secondary">
                ← Back to Dashboard
              </Link>
              <Link 
                href={`/staff/enter/${id}`}
                className="btn btn-primary"
              >
                Enter Metrics →
              </Link>
            </div>
          </div>
        </div>

        {/* MOCEAN Radar */}
        <div className="mb-6">
          <MOCEANRadar radarData={radarData} />
        </div>

        {/* Submission Info */}
        <Card className="mb-6">
          <Card.Header>
            <h2 className="text-xl font-semibold text-secondary-900">
              Submission Details
            </h2>
          </Card.Header>
          <Card.Body>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-secondary-700">Submission ID</label>
                <p className="text-secondary-900 font-mono">{submission.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-secondary-700">Status</label>
                <p className="text-secondary-900">{submission.status}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-secondary-700">Submitted</label>
                <p className="text-secondary-900">
                  {new Date(submission.submittedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Intake Data Sections */}
        <div className="space-y-6">
          {/* Symptoms & Concerns */}
          {Object.keys(symptomDescriptions).length > 0 && (
            <Card>
              <Card.Header>
                <h2 className="text-xl font-semibold text-secondary-900">
                  Symptoms & Concerns
                </h2>
              </Card.Header>
              <Card.Body>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Row 1 */}
                  <div className="bg-secondary-50 p-4 rounded-lg">
                    <h3 className="text-lg font-bold text-secondary-900 mb-3">
                      Musculoskeletal
                    </h3>
                    {symptomDescriptions.musculoskeletal && symptomDescriptions.musculoskeletal.length > 0 ? (
                      <ul className="space-y-1">
                        {symptomDescriptions.musculoskeletal.map((symptom, index) => (
                          <li key={index} className="text-secondary-700 flex items-start">
                            <span className="text-primary-600 mr-2">•</span>
                            {symptom}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-secondary-500 italic">No symptoms selected</p>
                    )}
                  </div>

                  <div className="bg-secondary-50 p-4 rounded-lg">
                    <h3 className="text-lg font-bold text-secondary-900 mb-3">
                      Organ / Digestive System
                    </h3>
                    {symptomDescriptions.organ_digest_hormone_detox && symptomDescriptions.organ_digest_hormone_detox.length > 0 ? (
                      <ul className="space-y-1">
                        {symptomDescriptions.organ_digest_hormone_detox.map((symptom, index) => (
                          <li key={index} className="text-secondary-700 flex items-start">
                            <span className="text-primary-600 mr-2">•</span>
                            {symptom}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-secondary-500 italic">No symptoms selected</p>
                    )}
                  </div>

                  {/* Row 2 */}
                  <div className="bg-secondary-50 p-4 rounded-lg">
                    <h3 className="text-lg font-bold text-secondary-900 mb-3">
                      Circulation
                    </h3>
                    {symptomDescriptions.circulation && symptomDescriptions.circulation.length > 0 ? (
                      <ul className="space-y-1">
                        {symptomDescriptions.circulation.map((symptom, index) => (
                          <li key={index} className="text-secondary-700 flex items-start">
                            <span className="text-primary-600 mr-2">•</span>
                            {symptom}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-secondary-500 italic">No symptoms selected</p>
                    )}
                  </div>

                  <div className="bg-secondary-50 p-4 rounded-lg">
                    <h3 className="text-lg font-bold text-secondary-900 mb-3">
                      Energy / Emotion
                    </h3>
                    {symptomDescriptions.energy && symptomDescriptions.energy.length > 0 ? (
                      <ul className="space-y-1">
                        {symptomDescriptions.energy.map((symptom, index) => (
                          <li key={index} className="text-secondary-700 flex items-start">
                            <span className="text-primary-600 mr-2">•</span>
                            {symptom}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-secondary-500 italic">No symptoms selected</p>
                    )}
                  </div>

                  {/* Row 3 */}
                  <div className="bg-secondary-50 p-4 rounded-lg">
                    <h3 className="text-lg font-bold text-secondary-900 mb-3">
                      Articular Joint
                    </h3>
                    {symptomDescriptions.articular_joint && symptomDescriptions.articular_joint.length > 0 ? (
                      <ul className="space-y-1">
                        {symptomDescriptions.articular_joint.map((symptom, index) => (
                          <li key={index} className="text-secondary-700 flex items-start">
                            <span className="text-primary-600 mr-2">•</span>
                            {symptom}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-secondary-500 italic">No symptoms selected</p>
                    )}
                  </div>

                  <div className="bg-secondary-50 p-4 rounded-lg">
                    <h3 className="text-lg font-bold text-secondary-900 mb-3">
                      Nervous System
                    </h3>
                    {symptomDescriptions.nervous_system && symptomDescriptions.nervous_system.length > 0 ? (
                      <ul className="space-y-1">
                        {symptomDescriptions.nervous_system.map((symptom, index) => (
                          <li key={index} className="text-secondary-700 flex items-start">
                            <span className="text-primary-600 mr-2">•</span>
                            {symptom}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-secondary-500 italic">No symptoms selected</p>
                    )}
                  </div>
                </div>
              </Card.Body>
            </Card>
          )}

          {/* Pain & Discomfort Levels */}
          {submission.sliderValues && Object.keys(submission.sliderValues).length > 0 && (
            <Card>
              <Card.Header>
                <h2 className="text-xl font-semibold text-secondary-900">
                  Pain & Discomfort Levels
                </h2>
                <p className="text-secondary-600 mt-1">
                  Client-reported discomfort (0-10 scale, higher = more discomfort)
                </p>
              </Card.Header>
              <Card.Body>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(submission.sliderValues).map(([category, values]) => (
                    <div key={category} className="bg-secondary-50 p-4 rounded-lg">
                      <h3 className="font-medium text-secondary-900 mb-2 capitalize">
                        {category.replace(/_/g, ' ')}
                      </h3>
                      <div className="text-2xl font-bold text-primary-600">
                        {values.main}/10
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          )}

          {/* Goals & Reasons */}
          {submission.rawReasons && Array.isArray(submission.rawReasons) && submission.rawReasons.length > 0 && (
            <Card>
              <Card.Header>
                <h2 className="text-xl font-semibold text-secondary-900">
                  Goals & Reasons
                </h2>
              </Card.Header>
              <Card.Body>
                <div className="space-y-2">
                  {submission.rawReasons.map((reason, index) => (
                    <div key={index} className="bg-primary-50 p-3 rounded-lg">
                      <p className="text-primary-900 font-medium">{reason}</p>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          )}

          {/* Discomfort Details */}
          {submission.rawDiscomfort && Object.keys(submission.rawDiscomfort).length > 0 && (
            <Card>
              <Card.Header>
                <h2 className="text-xl font-semibold text-secondary-900">
                  Discomfort Details
                </h2>
              </Card.Header>
              <Card.Body>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-secondary-700">Currently has pain</label>
                    <p className="text-secondary-900 capitalize">{submission.rawDiscomfort.hasPain}</p>
                  </div>
                  {submission.rawDiscomfort.hasPain === 'yes' && (
                    <>
                      <div>
                        <label className="text-sm font-medium text-secondary-700">Pain level</label>
                        <p className="text-secondary-900">{submission.rawDiscomfort.pain}/10</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-secondary-700">Onset</label>
                        <p className="text-secondary-900 capitalize">{submission.rawDiscomfort.onset}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-secondary-700">Progress</label>
                        <p className="text-secondary-900 capitalize">{submission.rawDiscomfort.progress}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-secondary-700">Trigger</label>
                        <p className="text-secondary-900 capitalize">{submission.rawDiscomfort.trigger}</p>
                      </div>
                    </>
                  )}
                  {submission.rawDiscomfort.areas && submission.rawDiscomfort.areas.length > 0 && (
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-secondary-700">Affected areas</label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {submission.rawDiscomfort.areas.map((area, index) => (
                          <span key={index} className="px-2 py-1 bg-secondary-200 text-secondary-800 rounded text-sm">
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {submission.rawDiscomfort.notes && (
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-secondary-700">Notes</label>
                      <p className="text-secondary-900">{submission.rawDiscomfort.notes}</p>
                    </div>
                  )}
                </div>
              </Card.Body>
            </Card>
          )}

          {/* Medical History */}
          {medicalConditions.length > 0 && (
            <Card>
              <Card.Header>
                <h2 className="text-xl font-semibold text-secondary-900">
                  Medical Conditions
                </h2>
              </Card.Header>
              <Card.Body>
                <div className="flex flex-wrap gap-2">
                  {medicalConditions.map((condition, index) => (
                    <span key={index} className="px-3 py-1 bg-warning-100 text-warning-800 rounded-full text-sm">
                      {condition}
                    </span>
                  ))}
                </div>
                {submission.rawHistory.notes && (
                  <div className="mt-4 p-3 bg-secondary-50 rounded-lg">
                    <label className="text-sm font-medium text-secondary-700">Additional notes</label>
                    <p className="text-secondary-900 mt-1">{submission.rawHistory.notes}</p>
                  </div>
                )}
              </Card.Body>
            </Card>
          )}

          {/* Surgeries */}
          {submission.surgeries && submission.surgeries.length > 0 && (
            <Card>
              <Card.Header>
                <h2 className="text-xl font-semibold text-secondary-900">
                  Surgical History
                </h2>
              </Card.Header>
              <Card.Body>
                <div className="space-y-3">
                  {submission.surgeries.map((surgery, index) => (
                    <div key={index} className="bg-secondary-50 p-4 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <span className="text-sm font-medium text-secondary-700">Year: </span>
                          <span className="text-secondary-900">{surgery.year}</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-secondary-700">Region: </span>
                          <span className="text-secondary-900">{surgery.bodyRegion}</span>
                        </div>
                        {surgery.notes && (
                          <div>
                            <span className="text-sm font-medium text-secondary-700">Notes: </span>
                            <span className="text-secondary-900">{surgery.notes}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          )}

          {/* Implants */}
          {submission.implants && submission.implants.length > 0 && (
            <Card>
              <Card.Header>
                <h2 className="text-xl font-semibold text-secondary-900">
                  Implants
                </h2>
              </Card.Header>
              <Card.Body>
                <div className="space-y-3">
                  {submission.implants.map((implant, index) => (
                    <div key={index} className="bg-secondary-50 p-4 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <span className="text-sm font-medium text-secondary-700">Code: </span>
                          <span className="text-secondary-900">{implant.implantCode}</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-secondary-700">Year: </span>
                          <span className="text-secondary-900">{implant.year}</span>
                        </div>
                        {implant.side && (
                          <div>
                            <span className="text-sm font-medium text-secondary-700">Side: </span>
                            <span className="text-secondary-900">{implant.side}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 