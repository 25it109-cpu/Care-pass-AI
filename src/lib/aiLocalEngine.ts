// src/lib/aiLocalEngine.ts
// Client-side resilient extraction engine for CARE-PASS AI
// Strictly non-diagnostic, zero-hallucination patient information organizer.
import { HealthSummary, CompletenessBreakdown, User, EmergencyContact, Appointment, AdminMetrics } from '../types';

export function calculateCompletenessScore(data: {
  mainConcern?: string;
  symptoms?: string[];
  duration?: string;
  medicationsMentioned?: string[];
  severity?: string;
  relevantInformation?: string[];
}): { score: number; breakdown: CompletenessBreakdown } {
  let score = 0;
  const breakdown: CompletenessBreakdown = {
    mainConcern: false,
    symptoms: false,
    duration: false,
    medications: false,
    severity: false,
    additionalDetails: false
  };

  if (data.mainConcern && data.mainConcern !== 'Not provided') {
    score += 25;
    breakdown.mainConcern = true;
  }
  if (data.symptoms && data.symptoms.length > 0) {
    score += 25;
    breakdown.symptoms = true;
  }
  if (data.duration && data.duration !== 'Not provided') {
    score += 20;
    breakdown.duration = true;
  }
  if (data.medicationsMentioned && data.medicationsMentioned.length > 0 && data.medicationsMentioned[0] !== 'Not provided') {
    score += 10;
    breakdown.medications = true;
  }
  if (data.severity && data.severity !== 'Not provided') {
    score += 10;
    breakdown.severity = true;
  }
  if (data.relevantInformation && data.relevantInformation.length > 0 && data.relevantInformation[0] !== 'Not provided') {
    score += 10;
    breakdown.additionalDetails = true;
  }

  return {
    score: Math.min(score, 100),
    breakdown
  };
}

export function extractHealthInformationLocal(inputText: string, language: string = 'en'): HealthSummary {
  const text = (inputText || '').trim();
  const lowerText = text.toLowerCase();

  const isTamil = language === 'ta' || /[\u0B80-\u0BFF]/.test(text);

  let symptoms: string[] = [];
  let duration = 'Not provided';
  let severity = 'Not provided';
  let medicationsMentioned: string[] = [];
  let previousConditions: string[] = [];
  let relevantInformation: string[] = [];
  let missingInformation: string[] = [];
  let priority: 'routine' | 'attention' | 'urgent' = 'routine';
  let reason = '';
  let followUpQuestions: string[] = [];
  let mainConcern = '';

  if (isTamil) {
    // Tamil extraction
    if (text.includes('காய்ச்சல்') || text.includes('ஜுரம்')) symptoms.push('Fever (காய்ச்சல்)');
    if (text.includes('சோர்வு') || text.includes('களைப்பு') || text.includes('உடம்பு ரொம்ப சோர்வா')) symptoms.push('Weakness / Fatigue (சோர்வு)');
    if (text.includes('தலைவலி')) symptoms.push('Headache (தலைவலி)');
    if (text.includes('இருமல்')) symptoms.push('Cough (இருமல்)');
    if (text.includes('சளி')) symptoms.push('Cold / Congestion (சளி)');
    if (text.includes('உடம்பு வலி') || text.includes('கை கால் வலி')) symptoms.push('Body aches (உடம்பு வலி)');
    if (text.includes('வயிற்று வலி')) symptoms.push('Abdominal pain (வயிற்று வலி)');
    if (text.includes('நெஞ்சு வலி') || text.includes('மார்பு வலி')) symptoms.push('Chest pain (மார்பு வலி)');
    if (text.includes('மூச்சு')) symptoms.push('Breathing discomfort (மூச்சுத்திணறல்)');

    // Tamil duration patterns
    if (text.includes('இரண்டு நாட்களாக') || text.includes('2 நாட்களாக') || text.includes('2 நாள்')) {
      duration = '2 days (இரண்டு நாட்கள்)';
    } else if (text.includes('மூன்று நாட்களாக') || text.includes('3 நாட்களாக')) {
      duration = '3 days (மூன்று நாட்கள்)';
    } else if (text.includes('ஒரு வாரமாக') || text.includes('1 வாரம்')) {
      duration = '1 week (ஒரு வாரம்)';
    } else if (text.includes('இன்று காலை') || text.includes('இன்று')) {
      duration = 'Since today morning';
    }

    if (text.includes('ரொம்ப') || text.includes('அதிகமாக')) {
      severity = 'Described as severe/pronounced ("ரொம்ப / அதிகமாக")';
    } else if (text.includes('லேசாக') || text.includes('கொஞ்சம்')) {
      severity = 'Described as mild ("லேசாக / கொஞ்சம்")';
    }

    // Tamil medications
    const paracetamolMatch = text.match(/(பாரசிட்டமால்|பராசிட்டமால்|மாத்திரை|paracetamol|tablet)/i);
    if (paracetamolMatch) {
      medicationsMentioned.push('Paracetamol / Tablet mentioned');
    }

    // Priority check for Tamil
    if (text.includes('நெஞ்சு வலி') || text.includes('மூச்சு விட கஷ்டம்') || text.includes('மயக்கம் போட்டு விழுந்து')) {
      priority = 'urgent';
      reason = 'User explicitly reported acute chest discomfort or breathing difficulty. Requires immediate professional evaluation.';
    } else if (symptoms.length >= 2 || duration.includes('days') || duration.includes('நாட்கள்') || text.includes('ரொம்ப')) {
      priority = 'attention';
      reason = 'Symptoms have persisted across multiple days with reported fatigue or elevated discomfort. Seeking a medical evaluation is recommended to prepare next steps.';
    } else {
      priority = 'routine';
      reason = 'Mild or early concern described. Preparing an organized question list before consulting a healthcare provider.';
    }

    mainConcern = symptoms.length > 0 
      ? `${symptoms[0].split('(')[0].trim()} reported with associated symptoms`
      : 'General health concern reported';

  } else {
    // English extraction
    if (/\bfever\b|\bhigh temp|\bchills\b/i.test(text)) symptoms.push('Fever / Elevated temperature');
    if (/\bweakness\b|\bfatigue\b|\btiredness\b|\bexhaustion\b|\bletharg\b/i.test(text)) symptoms.push('Weakness / Fatigue');
    if (/\bheadache\b|\bmigraine\b/i.test(text)) symptoms.push('Headache');
    if (/\bcough\b|\bcoughing\b/i.test(text)) symptoms.push('Cough');
    if (/\bsore throat\b|\bthroat pain\b/i.test(text)) symptoms.push('Sore throat');
    if (/\bbody pain\b|\bbody aches\b|\bmuscle ache/i.test(text)) symptoms.push('Body aches / Muscle pain');
    if (/\bchest pain\b|\bchest pressure\b|\bheavy chest\b/i.test(text)) symptoms.push('Chest discomfort / Pain');
    if (/\bshortness of breath\b|\bdifficulty breathing\b|\bbreathes hard\b/i.test(text)) symptoms.push('Shortness of breath');
    if (/\bstomach pain\b|\babdominal pain\b|\bcramps\b/i.test(text)) symptoms.push('Stomach / Abdominal pain');
    if (/\bnausea\b|\bvomiting\b/i.test(text)) symptoms.push('Nausea / Vomiting');
    if (/\bdizziness\b|\blightheaded\b/i.test(text)) symptoms.push('Dizziness');
    if (/\brash\b|\bhives\b|\bitching\b/i.test(text)) symptoms.push('Skin rash / Itching');
    if (/\bswelling\b|\bswollen\b/i.test(text)) symptoms.push('Swelling');

    // Duration
    const durationMatch = text.match(/(\d+|two|three|four|five|six|several|a few|couple of)\s*(day|days|week|weeks|hour|hours|month|months)/i);
    if (durationMatch) {
      duration = durationMatch[0];
    } else if (/since yesterday/i.test(text)) {
      duration = 'Since yesterday';
    } else if (/since this morning/i.test(text)) {
      duration = 'Since this morning';
    } else if (/started today/i.test(text)) {
      duration = 'Started today';
    }

    // Severity
    if (/severe|extreme|intense|unbearable|very bad/i.test(text)) {
      severity = 'Reported as severe';
    } else if (/moderate|quite bad|bothersome/i.test(text)) {
      severity = 'Reported as moderate';
    } else if (/mild|slight|a little|not too bad/i.test(text)) {
      severity = 'Reported as mild';
    }

    // Medications
    const medMatches = text.match(/(paracetamol|ibuprofen|tylenol|aspirin|advil|antibiotic|metformin|lisinopril|inhaler|cough syrup|antihistamine)/gi);
    if (medMatches) {
      medicationsMentioned = Array.from(new Set(medMatches.map(m => m.charAt(0).toUpperCase() + m.slice(1).toLowerCase())));
    }

    // Previous conditions
    const condMatches = text.match(/(asthma|diabetes|hypertension|high blood pressure|allergy|heart condition|migraine history|thyroid)/gi);
    if (condMatches) {
      previousConditions = Array.from(new Set(condMatches.map(c => c.charAt(0).toUpperCase() + c.slice(1).toLowerCase())));
    }

    // Urgent checks
    const urgentFlags = [
      'crushing chest pain', 'chest pain radiating', 'difficulty breathing', 'cannot breathe',
      'sudden weakness on one side', 'slurred speech', 'coughing up blood', 'severe allergic reaction',
      'anaphylaxis', 'loss of consciousness', 'bluish lips', 'sudden severe headache'
    ];
    const hasUrgentSigns = urgentFlags.some(flag => lowerText.includes(flag));
    if (hasUrgentSigns || (/chest pain/i.test(text) && /breathing/i.test(text))) {
      priority = 'urgent';
      reason = 'Potential urgent red-flag information detected in user statement (e.g. chest discomfort / breathing difficulty). Immediate emergency medical assessment advised.';
    } else if (
      symptoms.length >= 2 ||
      severity.includes('severe') ||
      (duration !== 'Not provided' && !duration.includes('hour'))
    ) {
      priority = 'attention';
      reason = 'User reports multiple active symptoms or persistent duration requiring formal medical attention.';
    } else {
      priority = 'routine';
      reason = 'Routine symptom description. Appropriate for preparing an organized consultation summary for a regular clinic visit.';
    }

    mainConcern = symptoms.length > 0 
      ? `${symptoms[0]} and related symptoms`
      : (text.length > 60 ? text.slice(0, 60) + '...' : text || 'Health concern consultation');
  }

  // Identify Missing Information explicitly
  if (duration === 'Not provided') missingInformation.push('Exact onset date and duration of symptoms');
  if (medicationsMentioned.length === 0) missingInformation.push('Current medications or recent over-the-counter remedies');
  if (previousConditions.length === 0) missingInformation.push('Existing chronic conditions or known allergies');
  if (severity === 'Not provided') missingInformation.push('Subjective severity rating (e.g., scale of 1-10)');

  // Smart follow-up questions
  if (symptoms.some(s => s.toLowerCase().includes('fever') || s.includes('காய்ச்சல்'))) {
    followUpQuestions.push('Have you measured your body temperature with a thermometer, and what was the highest reading?');
    followUpQuestions.push('Are you experiencing any accompanying symptoms like chills, sweating, or body stiffness?');
  }
  if (symptoms.some(s => s.toLowerCase().includes('cough') || s.includes('இருமல்'))) {
    followUpQuestions.push('Is the cough dry, or are you bringing up phlegm/mucus?');
  }
  if (symptoms.some(s => s.toLowerCase().includes('pain') || s.includes('வலி'))) {
    followUpQuestions.push('Does the pain stay in one area, or does it spread to other parts of your body?');
    followUpQuestions.push('What activities make the discomfort better or worse?');
  }
  followUpQuestions.push('Have you recently started or stopped any prescription medications or dietary supplements?');
  followUpQuestions.push('Do you have any known medical conditions or drug allergies that your doctor should be aware of?');

  if (text.includes('hospital') || text.includes('doctor') || text.includes('மருத்துவர்')) {
    relevantInformation.push('User indicated intention to consult or previous medical visits.');
  }
  if (text.includes('travel') || text.includes('பயணம்')) {
    relevantInformation.push('Recent travel context noted.');
  }
  if (text.includes('allergy') || text.includes('ஒவ்வாமை')) {
    relevantInformation.push('Allergy history mentioned.');
  }

  const result: HealthSummary = {
    id: `sum-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    userId: 'current-user',
    language: language || 'en',
    mainConcern: mainConcern || 'Health concern mentioned by patient',
    symptoms: symptoms.length > 0 ? symptoms : ['General discomfort (as described)'],
    duration: duration,
    severity: severity,
    medicationsMentioned: medicationsMentioned.length > 0 ? medicationsMentioned : ['Not provided'],
    previousConditions: previousConditions.length > 0 ? previousConditions : ['Not provided'],
    relevantInformation: relevantInformation.length > 0 ? relevantInformation : ['None explicitly stated in input'],
    otherConcerns: 'None explicitly provided',
    missingInformation: missingInformation,
    priority: priority,
    priorityReason: reason,
    followUpQuestions: followUpQuestions.slice(0, 4),
    completenessScore: 0,
    disclaimer: 'This priority indicator is informational and does not replace professional medical assessment.',
    createdAt: new Date().toISOString()
  };

  const { score, breakdown } = calculateCompletenessScore(result);
  result.completenessScore = score;
  result.completenessBreakdown = breakdown;

  return result;
}

// Preloaded mock database for client-side standalone execution
export const clientMockDb = {
  users: [
    {
      id: 'user-patient-001',
      email: 'demo.patient@example.com',
      fullName: 'Ananya Sharma',
      role: 'PATIENT' as const,
      preferredLanguage: 'en',
      emergencyNumber: '108',
      isActive: true,
      createdAt: '2026-09-01T10:00:00.000Z'
    },
    {
      id: 'user-doctor-002',
      email: 'demo.doctor@example.com',
      fullName: 'Dr. Rajesh Varma, MD',
      role: 'HEALTHCARE_PROFESSIONAL' as const,
      preferredLanguage: 'en',
      emergencyNumber: '108',
      isActive: true,
      createdAt: '2026-08-15T09:00:00.000Z'
    },
    {
      id: 'user-admin-003',
      email: 'demo.admin@example.com',
      fullName: 'Karthik Admin',
      role: 'ADMIN' as const,
      preferredLanguage: 'en',
      emergencyNumber: '108',
      isActive: true,
      createdAt: '2026-08-01T08:00:00.000Z'
    }
  ],
  initialSummaries: [
    {
      id: 'sum-001',
      userId: 'user-patient-001',
      inputText: 'I have mild throat dryness and tiredness after traveling. No high fever.',
      language: 'en',
      mainConcern: 'Throat dryness and post-travel fatigue',
      symptoms: ['Mild throat dryness', 'Tiredness / Fatigue'],
      duration: '2 days',
      severity: 'Mild',
      medicationsMentioned: ['Not provided'],
      previousConditions: ['Not provided'],
      relevantInformation: ['Recent travel context noted'],
      missingInformation: ['Temperature measurement', 'Fluid intake levels'],
      priority: 'routine' as const,
      priorityReason: 'Mild throat dryness and tiredness without high fever or difficulty breathing.',
      followUpQuestions: [
        'Has the throat dryness progressed to soreness or difficulty swallowing?',
        'Have you been taking adequate hydration or warm fluids?'
      ],
      completenessScore: 70,
      completenessBreakdown: {
        mainConcern: true,
        symptoms: true,
        duration: true,
        medications: false,
        severity: true,
        additionalDetails: true
      },
      isDemo: true,
      label: 'DEMO DATA — NOT REAL PATIENT INFORMATION',
      createdAt: '2026-09-20T14:30:00.000Z',
      patientName: 'Ananya Sharma'
    },
    {
      id: 'sum-002',
      userId: 'user-patient-001',
      inputText: 'எனக்கு இரண்டு நாட்களாக காய்ச்சல் இருக்கு, உடம்பு ரொம்ப சோர்வா இருக்கு. பாரசிட்டமால் எடுத்தேன்.',
      language: 'ta',
      mainConcern: 'Fever with notable fatigue (இரண்டு நாட்கள் காய்ச்சல்)',
      symptoms: ['Fever (காய்ச்சல்)', 'Weakness / Fatigue (சோர்வு)'],
      duration: '2 days (இரண்டு நாட்கள்)',
      severity: 'Described as severe/pronounced ("ரொம்ப சோர்வா")',
      medicationsMentioned: ['Paracetamol / Tablet mentioned'],
      previousConditions: ['Not provided'],
      relevantInformation: ['User explicitly reported taking over-the-counter paracetamol'],
      missingInformation: ['Exact thermometer temperature reading', 'History of drug allergies'],
      priority: 'attention' as const,
      priorityReason: 'Fever persisting for 2 days accompanied by significant fatigue requires clinical assessment.',
      followUpQuestions: [
        'What was the highest measured temperature on thermometer?',
        'Did taking Paracetamol bring the temperature down temporarily?'
      ],
      completenessScore: 85,
      completenessBreakdown: {
        mainConcern: true,
        symptoms: true,
        duration: true,
        medications: true,
        severity: true,
        additionalDetails: true
      },
      isDemo: true,
      label: 'DEMO DATA — NOT REAL PATIENT INFORMATION',
      createdAt: '2026-09-27T10:15:00.000Z',
      patientName: 'Ananya Sharma'
    },
    {
      id: 'sum-003',
      userId: 'user-patient-001',
      inputText: 'Experiencing sudden back strain after lifting a heavy parcel this morning. Stiff movement.',
      language: 'en',
      mainConcern: 'Acute lower back strain after lifting',
      symptoms: ['Lower back pain', 'Movement stiffness'],
      duration: 'Since this morning',
      severity: 'Moderate',
      medicationsMentioned: ['Not provided'],
      previousConditions: ['Not provided'],
      relevantInformation: ['Occurred immediately following physical lifting of heavy object'],
      missingInformation: ['Presence of numbness or tingling in legs', 'Pain score on 1-10 scale'],
      priority: 'attention' as const,
      priorityReason: 'Sudden onset mechanical strain requiring clinical posture and spine examination.',
      followUpQuestions: [
        'Are you experiencing any numbness, tingling, or radiating pain down your legs?',
        'Does sitting or walking aggravate the pain?'
      ],
      completenessScore: 80,
      completenessBreakdown: {
        mainConcern: true,
        symptoms: true,
        duration: true,
        medications: false,
        severity: true,
        additionalDetails: true
      },
      isDemo: true,
      label: 'DEMO DATA — NOT REAL PATIENT INFORMATION',
      createdAt: '2026-10-05T09:00:00.000Z',
      patientName: 'Ananya Sharma'
    }
  ]
};
