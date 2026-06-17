const EMERGENCY_SYMPTOMS = new Set([
  'Difficulty breathing',
  'Chest pain or pressure',
  'Confusion or difficulty waking',
  'Bluish lips or face',
]);

const SYMPTOM_WEIGHTS = {
  'Fever or chills': 18,
  'Cough': 16,
  'Shortness of breath': 22,
  'Loss of taste or smell': 24,
  'Fatigue': 8,
  'Muscle or body aches': 8,
  'Headache': 5,
  'Sore throat': 6,
  'Congestion or runny nose': 4,
  'Nausea or vomiting': 5,
  'Diarrhea': 4,
  'Difficulty breathing': 40,
  'Chest pain or pressure': 40,
  'Confusion or difficulty waking': 40,
  'Bluish lips or face': 40,
};

function assessSymptoms({ symptoms = [], temperature = 0, duration = 0, age = 0 }) {
  const emergencySymptoms = symptoms.filter((symptom) => EMERGENCY_SYMPTOMS.has(symptom));
  let score = symptoms.reduce((total, symptom) => total + (SYMPTOM_WEIGHTS[symptom] || 0), 0);

  if (temperature >= 100.4) score += 12;
  if (temperature >= 103) score += 12;
  if (duration >= 3) score += 6;
  if (duration >= 7) score += 6;
  if (age >= 65) score += 8;

  score = Math.min(score, 100);
  let level = 'Low';
  if (score >= 60) level = 'High';
  else if (score >= 30) level = 'Moderate';

  if (emergencySymptoms.length) {
    level = 'Urgent';
    score = Math.max(score, 90);
  }

  const guidance = emergencySymptoms.length
    ? [
        'Call emergency services now or go to the nearest emergency department.',
        'Do not drive yourself if you feel faint, confused, or severely short of breath.',
      ]
    : level === 'High'
      ? [
          'Contact a licensed healthcare professional today.',
          'Consider a COVID-19 test and avoid close contact until you know more.',
          'Monitor breathing, temperature, and symptom changes closely.',
        ]
      : level === 'Moderate'
        ? [
            'Consider a COVID-19 test and contact a clinician if symptoms persist or worsen.',
            'Rest, hydrate, and monitor your temperature.',
          ]
        : [
            'Continue to monitor your symptoms and prioritize rest and hydration.',
            'Seek medical advice if symptoms worsen or new concerns appear.',
          ];

  return { score, level, emergencySymptoms, guidance };
}

module.exports = { assessSymptoms, EMERGENCY_SYMPTOMS, SYMPTOM_WEIGHTS };
