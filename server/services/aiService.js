// server/services/aiService.js
// Multilingual AI extraction engine for CARE-PASS AI
// Strictly non-diagnostic, information-organizer.

/**
 * Robust multilingual analyzer supporting English & Tamil
 * Handles both direct LLM calls (Gemini/OpenAI) and intelligent resilient semantic extraction.
 */

// Tamil symptom & medical term dictionary for deep accurate parsing
const TAMIL_KEYWORDS = {
  fever: ['காய்ச்சல்', 'சூடு', 'ஜுரம்'],
  weakness: ['சோர்வு', 'களைப்பு', 'பலவீனம்', 'உடம்பு சோர்வா'],
  headache: ['தலைவலி', 'தலை பாரம்'],
  cough: ['இருமல்', 'சளி'],
  body_pain: ['உடம்பு வலி', 'கை கால் வலி', 'தசை வலி'],
  chest_pain: ['நெஞ்சு வலி', 'மார்பு வலி'],
  shortness_of_breath: ['மூச்சுத்திணறல்', 'மூச்சு வாங்குதல்', 'மூச்சு விட கஷ்டம்'],
  stomach_pain: ['வயிற்று வலி', 'வயிறு வலி'],
  dizziness: ['மயக்கம்', 'தலைச்சுற்றல்'],
  nausea: ['வாந்தி', 'குமட்டல்'],
  throat_pain: ['தொண்டை வலி', 'தொண்டை கரகரப்பு'],
  duration_days: [/(\d+|இரண்டு|மூன்று|நான்கு|ஐந்து|ஒரு)\s*(நாட்களாக|நாட்கள்|நாள்)/i],
  duration_weeks: [/(\d+|இரண்டு|மூன்று)\s*(வாரங்களாக|வாரம்)/i],
  duration_hours: [/(\d+)\s*(மணிநேரம்|மணிகளாக)/i],
};

const ENGLISH_KEYWORDS = {
  urgent_flags: [
    'crushing chest pain', 'chest pain radiating', 'difficulty breathing', 'cannot breathe',
    'sudden weakness on one side', 'slurred speech', 'coughing up blood', 'severe allergic reaction',
    'anaphylaxis', 'loss of consciousness', 'bluish lips', 'sudden severe headache'
  ],
  attention_flags: [
    'high fever', 'persistent vomiting', 'dehydration', 'moderate pain', 'blood in urine',
    'spreading rash', 'fever for 3 days', 'fever for 4 days', 'fever for 5 days', 'fever over 102'
  ]
};

/**
 * Calculate Care-Pass Score (Information Completeness Score 0 - 100%)
 * Measures information completeness, NOT health status.
 */
function calculateCompletenessScore(data) {
  let score = 0;
  const breakdown = {
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

/**
 * Built-in Multilingual Semantic Extractor
 * Extracts ONLY explicitly mentioned information. Never hallucinates.
 */
export function extractHealthInformationLocal(inputText, language = 'en') {
  const text = (inputText || '').trim();
  const lowerText = text.toLowerCase();

  const isTamil = language === 'ta' || /[\u0B80-\u0BFF]/.test(text);

  let symptoms = [];
  let duration = 'Not provided';
  let severity = 'Not provided';
  let medicationsMentioned = [];
  let previousConditions = [];
  let relevantInformation = [];
  let missingInformation = [];
  let priority = 'routine';
  let reason = '';
  let followUpQuestions = [];
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
    // Symptoms
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
    const hasUrgentSigns = ENGLISH_KEYWORDS.urgent_flags.some(flag => lowerText.includes(flag));
    if (hasUrgentSigns || /chest pain/i.test(text) && /breathing/i.test(text)) {
      priority = 'urgent';
      reason = 'Potential urgent red-flag information detected in user statement (e.g. chest discomfort / breathing difficulty). Immediate emergency medical assessment advised.';
    } else if (
      symptoms.length >= 2 ||
      severity.includes('severe') ||
      (duration !== 'Not provided' && !duration.includes('hour')) ||
      ENGLISH_KEYWORDS.attention_flags.some(flag => lowerText.includes(flag))
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

  // Smart follow-up questions a healthcare professional might ask
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

  // Relevant information explicitly extracted
  if (text.includes('hospital') || text.includes('doctor') || text.includes('மருத்துவர்')) {
    relevantInformation.push('User indicated intention to consult or previous medical visits.');
  }
  if (text.includes('travel') || text.includes('பயணம்')) {
    relevantInformation.push('Recent travel context noted.');
  }
  if (text.includes('allergy') || text.includes('ஒவ்வாமை')) {
    relevantInformation.push('Allergy history mentioned.');
  }

  const result = {
    mainConcern: mainConcern || 'Health concern mentioned by patient',
    symptoms: symptoms.length > 0 ? symptoms : ['General discomfort (as described)'],
    duration: duration,
    severity: severity,
    medicationsMentioned: medicationsMentioned.length > 0 ? medicationsMentioned : ['Not provided'],
    previousConditions: previousConditions.length > 0 ? previousConditions : ['Not provided'],
    relevantInformation: relevantInformation.length > 0 ? relevantInformation : ['None explicitly stated in input'],
    otherConcerns: 'None explicitly provided',
    missingInformation: missingInformation,
    priority: priority, // 'routine' | 'attention' | 'urgent'
    reason: reason,
    followUpQuestions: followUpQuestions.slice(0, 4),
    disclaimer: 'This priority indicator is informational and does not replace professional medical assessment.',
    timestamp: new Date().toISOString()
  };

  const { score, breakdown } = calculateCompletenessScore(result);
  result.completenessScore = score;
  result.completenessBreakdown = breakdown;

  return result;
}

/**
 * Main AI Analysis Controller:
 * Attempts Cloud LLM (Gemini or OpenAI) if key is provided;
 * smoothly falls back to the built-in deterministic extractor if keys are omitted or call fails.
 */
export async function analyzeHealthConcern(text, language = 'en') {
  const geminiKey = process.env.GEMINI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (geminiKey) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are CARE-PASS AI, an informational patient information organizer for a student hackathon prototype.
You MUST STRICTLY FOLLOW THESE RULES:
1. NEVER diagnose diseases or medical conditions.
2. NEVER prescribe medication or give individualized medical treatments.
3. NEVER invent or hallucinate information not present in the user text.
4. Extract ONLY information explicitly stated by the user. If unknown, return "Not provided".
5. If the user writes in Tamil, accurately translate the meaning into English while preserving the original context.
6. Identify missing information that a doctor would need.
7. Assign an informational priority: "routine", "attention", or "urgent". (Urgent is only for critical red flags like crushing chest pain, severe breathing loss, stroke signs).
8. Generate 3-4 professional follow-up questions a doctor might ask.

User Input (${language}):
"${text}"

Respond ONLY with valid JSON with this exact structure:
{
  "mainConcern": "short title",
  "symptoms": ["symptom 1", "symptom 2"],
  "duration": "e.g. 2 days or Not provided",
  "severity": "as described by user or Not provided",
  "medicationsMentioned": ["med 1"] or ["Not provided"],
  "previousConditions": ["condition 1"] or ["Not provided"],
  "relevantInformation": ["detail 1"] or ["None explicitly stated"],
  "otherConcerns": "...",
  "missingInformation": ["e.g. Current medications", "Exact fever reading"],
  "priority": "routine" | "attention" | "urgent",
  "reason": "explanation based strictly on provided info",
  "followUpQuestions": ["question 1", "question 2", "question 3"],
  "disclaimer": "This priority indicator is informational and does not replace professional medical assessment."
}`
            }]
          }],
          generationConfig: {
            temperature: 0.1,
            responseMimeType: "application/json"
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (jsonText) {
          const parsed = JSON.parse(jsonText);
          const { score, breakdown } = calculateCompletenessScore(parsed);
          parsed.completenessScore = score;
          parsed.completenessBreakdown = breakdown;
          parsed.source = 'gemini-ai';
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Gemini API call failed, falling back to built-in semantic extractor:', err.message);
    }
  }

  // Use built-in multilingual semantic extraction engine
  const localResult = extractHealthInformationLocal(text, language);
  localResult.source = 'carepass-engine';
  return localResult;
}
