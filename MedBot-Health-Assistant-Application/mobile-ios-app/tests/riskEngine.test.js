const test = require('node:test');
const assert = require('node:assert/strict');
const { assessSymptoms } = require('../src/riskEngine');

test('returns low risk for no reported symptoms', () => {
  assert.equal(assessSymptoms({ symptoms: [] }).level, 'Low');
});

test('raises risk for a clinically relevant symptom pattern', () => {
  const result = assessSymptoms({
    symptoms: ['Fever or chills', 'Cough', 'Loss of taste or smell'],
    temperature: 101.2,
    duration: 4,
    age: 31,
  });
  assert.equal(result.level, 'High');
  assert.ok(result.score >= 60);
});

test('routes emergency warning signs to urgent care', () => {
  const result = assessSymptoms({ symptoms: ['Chest pain or pressure'] });
  assert.equal(result.level, 'Urgent');
  assert.equal(result.score, 90);
  assert.deepEqual(result.emergencySymptoms, ['Chest pain or pressure']);
});
