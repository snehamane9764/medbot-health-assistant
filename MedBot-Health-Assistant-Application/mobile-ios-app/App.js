import React, { useEffect, useMemo, useState } from 'react';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const { assessSymptoms } = require('./src/riskEngine');

const COLORS = {
  ink: '#18312D',
  muted: '#687B77',
  canvas: '#F4F8F7',
  card: '#FFFFFF',
  teal: '#0B766E',
  tealSoft: '#DDF0EC',
  navy: '#153F4A',
  border: '#DCE7E4',
  red: '#B54242',
  redSoft: '#FBE9E7',
  amber: '#9B6417',
  amberSoft: '#FFF2D9',
};

const symptoms = [
  'Fever or chills',
  'Cough',
  'Shortness of breath',
  'Loss of taste or smell',
  'Fatigue',
  'Muscle or body aches',
  'Headache',
  'Sore throat',
  'Congestion or runny nose',
  'Nausea or vomiting',
  'Diarrhea',
];

const warningSigns = [
  'Difficulty breathing',
  'Chest pain or pressure',
  'Confusion or difficulty waking',
  'Bluish lips or face',
];

function Pill({ label, selected, onPress, danger = false }) {
  return (
    <TouchableOpacity
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={[styles.pill, selected && styles.pillSelected, danger && styles.pillDanger, danger && selected && styles.pillDangerSelected]}
    >
      <View style={[styles.check, selected && styles.checkSelected, danger && selected && styles.checkDanger]}>
        {selected ? <Text style={styles.checkMark}>✓</Text> : null}
      </View>
      <Text style={[styles.pillText, selected && styles.pillTextSelected, danger && styles.dangerText]}>{label}</Text>
    </TouchableOpacity>
  );
}

function Header({ step, onBack }) {
  return (
    <View style={styles.header}>
      {onBack ? (
        <TouchableOpacity onPress={onBack} style={styles.backButton} accessibilityLabel="Go back">
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.brandMark}><View style={styles.brandCrossV} /><View style={styles.brandCrossH} /></View>
      )}
      <View style={styles.headerCopy}>
        <Text style={styles.brand}>MedBot</Text>
        <Text style={styles.eyebrow}>{step || 'HEALTH ASSISTANT'}</Text>
      </View>
      <View style={styles.secure}><View style={styles.secureDot} /><Text style={styles.secureText}>Private</Text></View>
    </View>
  );
}

function PrimaryButton({ children, onPress, disabled = false }) {
  return (
    <TouchableOpacity disabled={disabled} onPress={onPress} style={[styles.primaryButton, disabled && styles.buttonDisabled]}>
      <Text style={styles.primaryButtonText}>{children}</Text>
      <Text style={styles.buttonArrow}>→</Text>
    </TouchableOpacity>
  );
}

export default function App() {
  useEffect(() => {
    if (Platform.OS === 'web' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    }
  }, []);

  const [screen, setScreen] = useState('home');
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Prefer not to say');
  const [selected, setSelected] = useState([]);
  const [temperature, setTemperature] = useState('');
  const [duration, setDuration] = useState('');
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  const progress = useMemo(() => `${Math.round((step / 3) * 100)}%`, [step]);

  function toggleSymptom(item) {
    setSelected((current) => current.includes(item) ? current.filter((value) => value !== item) : [...current, item]);
  }

  function beginAssessment() {
    setStep(1);
    setScreen('assessment');
  }

  function submitAssessment() {
    const assessment = assessSymptoms({
      symptoms: selected,
      temperature: Number(temperature),
      duration: Number(duration),
      age: Number(age),
    });
    const completed = { ...assessment, date: new Date(), symptoms: [...selected], name: name.trim() || 'Guest' };
    setResult(completed);
    setHistory((items) => [completed, ...items]);
    setScreen('result');
  }

  function resetAssessment() {
    setSelected([]);
    setTemperature('');
    setDuration('');
    beginAssessment();
  }

  if (screen === 'home') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />
        <ScrollView contentContainerStyle={styles.page}>
          <Header />
          <View style={styles.hero}>
            <View style={styles.heroOrb}><View style={styles.pulseRing} /><View style={styles.heroCrossV} /><View style={styles.heroCrossH} /></View>
            <Text style={styles.heroEyebrow}>PRELIMINARY HEALTH GUIDANCE</Text>
            <Text style={styles.heroTitle}>Understand your symptoms with confidence.</Text>
            <Text style={styles.heroBody}>A quick, private assessment that helps you decide what to do next. No account required.</Text>
            <PrimaryButton onPress={beginAssessment}>Start assessment</PrimaryButton>
            <Text style={styles.timeNote}>Takes about 2 minutes</Text>
          </View>
          <View style={styles.featureRow}>
            <View style={styles.feature}><Text style={styles.featureNumber}>01</Text><Text style={styles.featureTitle}>Private by design</Text><Text style={styles.featureBody}>Your answers stay on this device.</Text></View>
            <View style={styles.feature}><Text style={styles.featureNumber}>02</Text><Text style={styles.featureTitle}>Clear next steps</Text><Text style={styles.featureBody}>Practical guidance based on reported symptoms.</Text></View>
          </View>
          <TouchableOpacity onPress={() => setScreen('history')} style={styles.historyLink}>
            <Text style={styles.historyLinkText}>View assessment history</Text><Text style={styles.historyLinkText}>→</Text>
          </TouchableOpacity>
          <View style={styles.disclaimer}><Text style={styles.disclaimerTitle}>Important</Text><Text style={styles.disclaimerBody}>MedBot is an educational prototype, not a diagnostic tool. For emergencies, call 911 in the United States or your local emergency number.</Text></View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (screen === 'history') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.page}>
          <Header step="ASSESSMENT HISTORY" onBack={() => setScreen('home')} />
          <Text style={styles.sectionTitle}>Your recent check-ins</Text>
          <Text style={styles.sectionLead}>Stored only for this app session.</Text>
          {history.length === 0 ? (
            <View style={styles.emptyState}><Text style={styles.emptyTitle}>No assessments yet</Text><Text style={styles.emptyBody}>Complete your first symptom check to see a summary here.</Text><PrimaryButton onPress={beginAssessment}>Start assessment</PrimaryButton></View>
          ) : history.map((item, index) => (
            <View style={styles.historyCard} key={`${item.date.toISOString()}-${index}`}>
              <View><Text style={styles.historyDate}>{item.date.toLocaleDateString()}</Text><Text style={styles.historySymptoms}>{item.symptoms.length} symptoms reported</Text></View>
              <View style={[styles.levelBadge, item.level === 'Urgent' || item.level === 'High' ? styles.levelDanger : item.level === 'Moderate' ? styles.levelAmber : styles.levelLow]}><Text style={styles.levelBadgeText}>{item.level}</Text></View>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (screen === 'result' && result) {
    const urgent = result.level === 'Urgent';
    const high = result.level === 'High';
    const moderate = result.level === 'Moderate';
    const accent = urgent || high ? COLORS.red : moderate ? COLORS.amber : COLORS.teal;
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.page}>
          <Header step="YOUR ASSESSMENT" onBack={() => setScreen('home')} />
          <View style={styles.resultHero}>
            <Text style={styles.resultKicker}>{urgent ? 'ACT NOW' : 'PRELIMINARY RESULT'}</Text>
            <View style={[styles.scoreRing, { borderColor: accent }]}><Text style={[styles.score, { color: accent }]}>{result.score}</Text><Text style={styles.scoreOutOf}>/ 100</Text></View>
            <Text style={styles.resultTitle}>{result.level} concern</Text>
            <Text style={styles.resultBody}>Based on the symptoms and details you reported. This is not a diagnosis.</Text>
          </View>
          {urgent ? <View style={styles.emergencyCard}><Text style={styles.emergencyTitle}>Emergency warning sign detected</Text><Text style={styles.emergencyBody}>Call 911 or your local emergency number now. Do not wait for symptoms to improve.</Text></View> : null}
          <Text style={styles.smallHeading}>RECOMMENDED NEXT STEPS</Text>
          {result.guidance.map((item, index) => (
            <View style={styles.guidanceRow} key={item}><View style={styles.guidanceNumber}><Text style={styles.guidanceNumberText}>{index + 1}</Text></View><Text style={styles.guidanceText}>{item}</Text></View>
          ))}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Assessment summary</Text>
            <View style={styles.summaryLine}><Text style={styles.summaryLabel}>Symptoms</Text><Text style={styles.summaryValue}>{result.symptoms.length || 'None'}</Text></View>
            <View style={styles.summaryLine}><Text style={styles.summaryLabel}>Temperature</Text><Text style={styles.summaryValue}>{temperature ? `${temperature} °F` : 'Not provided'}</Text></View>
            <View style={styles.summaryLine}><Text style={styles.summaryLabel}>Duration</Text><Text style={styles.summaryValue}>{duration ? `${duration} days` : 'Not provided'}</Text></View>
          </View>
          <PrimaryButton onPress={resetAssessment}>Start new assessment</PrimaryButton>
          <TouchableOpacity onPress={() => setScreen('home')} style={styles.secondaryButton}><Text style={styles.secondaryButtonText}>Return home</Text></TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
        <Header step={`STEP ${step} OF 3`} onBack={() => step === 1 ? setScreen('home') : setStep(step - 1)} />
        <View style={styles.progressTrack}><View style={[styles.progressFill, { width: progress }]} /></View>
        {step === 1 ? (
          <View>
            <Text style={styles.sectionKicker}>LET'S START WITH YOU</Text>
            <Text style={styles.sectionTitle}>A few quick details</Text>
            <Text style={styles.sectionLead}>This helps us put your symptoms in context.</Text>
            <Text style={styles.label}>First name</Text>
            <TextInput value={name} onChangeText={setName} placeholder="Enter your name" placeholderTextColor="#9AA9A6" style={styles.input} />
            <Text style={styles.label}>Age</Text>
            <TextInput value={age} onChangeText={setAge} placeholder="e.g. 34" placeholderTextColor="#9AA9A6" keyboardType="number-pad" style={styles.input} />
            <Text style={styles.label}>Gender</Text>
            <View style={styles.optionRow}>{['Female', 'Male', 'Non-binary', 'Prefer not to say'].map((item) => <TouchableOpacity key={item} onPress={() => setGender(item)} style={[styles.option, gender === item && styles.optionSelected]}><Text style={[styles.optionText, gender === item && styles.optionTextSelected]}>{item}</Text></TouchableOpacity>)}</View>
            <PrimaryButton disabled={!age || Number(age) < 1 || Number(age) > 120} onPress={() => setStep(2)}>Continue</PrimaryButton>
          </View>
        ) : step === 2 ? (
          <View>
            <Text style={styles.sectionKicker}>SYMPTOM CHECK</Text>
            <Text style={styles.sectionTitle}>What are you feeling?</Text>
            <Text style={styles.sectionLead}>Select everything that applies right now.</Text>
            <View style={styles.pillGrid}>{symptoms.map((item) => <Pill key={item} label={item} selected={selected.includes(item)} onPress={() => toggleSymptom(item)} />)}</View>
            <Text style={styles.warningHeading}>Emergency warning signs</Text>
            <Text style={styles.warningBody}>Select any that apply, even if already covered above.</Text>
            <View style={styles.pillGrid}>{warningSigns.map((item) => <Pill danger key={item} label={item} selected={selected.includes(item)} onPress={() => toggleSymptom(item)} />)}</View>
            <PrimaryButton onPress={() => setStep(3)}>Continue</PrimaryButton>
          </View>
        ) : (
          <View>
            <Text style={styles.sectionKicker}>FINAL DETAILS</Text>
            <Text style={styles.sectionTitle}>A little more context</Text>
            <Text style={styles.sectionLead}>Both fields are optional, but improve the assessment.</Text>
            <Text style={styles.label}>Current temperature (°F)</Text>
            <TextInput value={temperature} onChangeText={setTemperature} placeholder="e.g. 101.2" placeholderTextColor="#9AA9A6" keyboardType="decimal-pad" style={styles.input} />
            <Text style={styles.label}>How many days have you felt unwell?</Text>
            <TextInput value={duration} onChangeText={setDuration} placeholder="e.g. 3" placeholderTextColor="#9AA9A6" keyboardType="number-pad" style={styles.input} />
            <View style={styles.reviewCard}><Text style={styles.reviewTitle}>Ready to review</Text><Text style={styles.reviewBody}>{selected.length === 0 ? 'No symptoms selected' : `${selected.length} symptom${selected.length === 1 ? '' : 's'} selected`} · Age {age} · {gender}</Text></View>
            <PrimaryButton onPress={submitAssessment}>See my result</PrimaryButton>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.canvas },
  page: { flexGrow: 1, paddingHorizontal: 22, paddingTop: 10, paddingBottom: 40, backgroundColor: COLORS.canvas },
  header: { flexDirection: 'row', alignItems: 'center', minHeight: 58, marginBottom: 16 },
  headerCopy: { flex: 1, marginLeft: 11 },
  brand: { color: COLORS.ink, fontWeight: '800', fontSize: 20, letterSpacing: -0.5 },
  eyebrow: { color: COLORS.muted, fontSize: 9, fontWeight: '700', letterSpacing: 1.5, marginTop: 1 },
  brandMark: { width: 35, height: 35, borderRadius: 12, backgroundColor: COLORS.teal, position: 'relative' },
  brandCrossV: { position: 'absolute', width: 4, height: 18, borderRadius: 2, backgroundColor: '#fff', left: 15.5, top: 8.5 },
  brandCrossH: { position: 'absolute', width: 18, height: 4, borderRadius: 2, backgroundColor: '#fff', left: 8.5, top: 15.5 },
  secure: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 7, borderRadius: 20, backgroundColor: COLORS.tealSoft },
  secureDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.teal, marginRight: 5 },
  secureText: { color: COLORS.teal, fontSize: 11, fontWeight: '700' },
  backButton: { width: 35, height: 35, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  backText: { color: COLORS.ink, fontSize: 29, lineHeight: 30, marginTop: -3 },
  hero: { backgroundColor: COLORS.navy, borderRadius: 28, paddingHorizontal: 24, paddingVertical: 32, alignItems: 'center', overflow: 'hidden' },
  heroOrb: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#23606A', marginBottom: 24, position: 'relative' },
  pulseRing: { position: 'absolute', width: 62, height: 62, borderRadius: 31, borderWidth: 1, borderColor: '#4F8288', left: 9, top: 9 },
  heroCrossV: { position: 'absolute', width: 7, height: 31, borderRadius: 4, backgroundColor: '#A8DED4', left: 36.5, top: 24.5 },
  heroCrossH: { position: 'absolute', width: 31, height: 7, borderRadius: 4, backgroundColor: '#A8DED4', left: 24.5, top: 36.5 },
  heroEyebrow: { color: '#9CC5C2', fontSize: 10, fontWeight: '800', letterSpacing: 1.8, marginBottom: 12 },
  heroTitle: { color: '#fff', fontSize: 34, lineHeight: 39, fontWeight: '800', letterSpacing: -1.1, textAlign: 'center' },
  heroBody: { color: '#C9DCDA', fontSize: 15, lineHeight: 23, textAlign: 'center', marginTop: 14, marginBottom: 24 },
  primaryButton: { minHeight: 56, borderRadius: 17, backgroundColor: COLORS.teal, paddingHorizontal: 20, marginTop: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  heroBodyButton: { backgroundColor: COLORS.teal },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  buttonArrow: { color: '#fff', fontSize: 21 },
  buttonDisabled: { opacity: 0.4 },
  timeNote: { color: '#9CC5C2', fontSize: 11, marginTop: 13 },
  featureRow: { flexDirection: 'row', gap: 12, marginTop: 16 },
  feature: { flex: 1, padding: 17, borderRadius: 20, backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border },
  featureNumber: { color: COLORS.teal, fontWeight: '800', fontSize: 11, marginBottom: 16 },
  featureTitle: { color: COLORS.ink, fontSize: 15, fontWeight: '800', marginBottom: 6 },
  featureBody: { color: COLORS.muted, fontSize: 12, lineHeight: 18 },
  historyLink: { marginTop: 16, minHeight: 54, borderBottomWidth: 1, borderBottomColor: COLORS.border, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  historyLinkText: { color: COLORS.teal, fontSize: 14, fontWeight: '800' },
  disclaimer: { marginTop: 20, padding: 16, borderRadius: 16, backgroundColor: '#EBF1F0', flexDirection: 'row', gap: 10 },
  disclaimerTitle: { color: COLORS.ink, fontSize: 12, fontWeight: '800' },
  disclaimerBody: { color: COLORS.muted, fontSize: 11, lineHeight: 17, flex: 1 },
  progressTrack: { height: 4, backgroundColor: COLORS.border, borderRadius: 2, marginBottom: 34 },
  progressFill: { height: 4, backgroundColor: COLORS.teal, borderRadius: 2 },
  sectionKicker: { color: COLORS.teal, fontSize: 10, fontWeight: '800', letterSpacing: 1.7, marginBottom: 10 },
  sectionTitle: { color: COLORS.ink, fontSize: 31, lineHeight: 36, fontWeight: '800', letterSpacing: -0.7 },
  sectionLead: { color: COLORS.muted, fontSize: 15, lineHeight: 22, marginTop: 9, marginBottom: 28 },
  label: { color: COLORS.ink, fontSize: 13, fontWeight: '800', marginBottom: 8 },
  input: { backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, borderRadius: 16, minHeight: 55, paddingHorizontal: 16, color: COLORS.ink, fontSize: 16, marginBottom: 20 },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 5 },
  option: { paddingHorizontal: 14, paddingVertical: 11, borderRadius: 13, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.card },
  optionSelected: { backgroundColor: COLORS.tealSoft, borderColor: COLORS.teal },
  optionText: { color: COLORS.muted, fontSize: 13, fontWeight: '600' },
  optionTextSelected: { color: COLORS.teal, fontWeight: '800' },
  pillGrid: { gap: 9 },
  pill: { minHeight: 54, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.card, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center' },
  pillSelected: { borderColor: COLORS.teal, backgroundColor: COLORS.tealSoft },
  pillDanger: { borderColor: '#E9C5C1' },
  pillDangerSelected: { backgroundColor: COLORS.redSoft, borderColor: COLORS.red },
  pillText: { color: COLORS.ink, fontSize: 14, fontWeight: '650', flex: 1 },
  pillTextSelected: { color: COLORS.teal, fontWeight: '800' },
  dangerText: { color: COLORS.red },
  check: { width: 22, height: 22, borderRadius: 7, borderWidth: 1, borderColor: '#B7C7C4', marginRight: 12, justifyContent: 'center', alignItems: 'center' },
  checkSelected: { backgroundColor: COLORS.teal, borderColor: COLORS.teal },
  checkDanger: { backgroundColor: COLORS.red, borderColor: COLORS.red },
  checkMark: { color: '#fff', fontSize: 14, fontWeight: '900' },
  warningHeading: { color: COLORS.red, fontSize: 15, fontWeight: '800', marginTop: 28, marginBottom: 5 },
  warningBody: { color: COLORS.muted, fontSize: 12, marginBottom: 13 },
  reviewCard: { backgroundColor: COLORS.tealSoft, borderRadius: 17, padding: 17, marginTop: 5 },
  reviewTitle: { color: COLORS.teal, fontSize: 13, fontWeight: '800', marginBottom: 5 },
  reviewBody: { color: COLORS.ink, fontSize: 13, lineHeight: 19 },
  resultHero: { alignItems: 'center', paddingVertical: 20 },
  resultKicker: { color: COLORS.teal, fontSize: 10, fontWeight: '800', letterSpacing: 1.8, marginBottom: 18 },
  scoreRing: { width: 128, height: 128, borderRadius: 64, borderWidth: 10, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', backgroundColor: COLORS.card },
  score: { fontSize: 42, fontWeight: '900', letterSpacing: -1.5 },
  scoreOutOf: { color: COLORS.muted, fontSize: 11, marginTop: 17 },
  resultTitle: { color: COLORS.ink, fontSize: 28, fontWeight: '800', marginTop: 19 },
  resultBody: { color: COLORS.muted, fontSize: 14, lineHeight: 21, textAlign: 'center', marginTop: 8, maxWidth: 330 },
  emergencyCard: { backgroundColor: COLORS.redSoft, borderWidth: 1, borderColor: '#E9C5C1', borderRadius: 18, padding: 18, marginTop: 12, marginBottom: 24 },
  emergencyTitle: { color: COLORS.red, fontSize: 16, fontWeight: '900', marginBottom: 7 },
  emergencyBody: { color: '#753535', fontSize: 13, lineHeight: 20 },
  smallHeading: { color: COLORS.muted, fontSize: 10, fontWeight: '800', letterSpacing: 1.4, marginTop: 22, marginBottom: 12 },
  guidanceRow: { flexDirection: 'row', backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, borderRadius: 17, padding: 15, alignItems: 'center', marginBottom: 9 },
  guidanceNumber: { width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.tealSoft, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  guidanceNumberText: { color: COLORS.teal, fontWeight: '900', fontSize: 12 },
  guidanceText: { color: COLORS.ink, fontSize: 13, lineHeight: 19, flex: 1 },
  summaryCard: { backgroundColor: COLORS.navy, borderRadius: 20, padding: 19, marginTop: 18 },
  summaryTitle: { color: '#fff', fontSize: 16, fontWeight: '800', marginBottom: 13 },
  summaryLine: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderTopWidth: 1, borderTopColor: '#315A63' },
  summaryLabel: { color: '#AFCAC8', fontSize: 12 },
  summaryValue: { color: '#fff', fontSize: 12, fontWeight: '700' },
  secondaryButton: { alignItems: 'center', justifyContent: 'center', minHeight: 52, marginTop: 7 },
  secondaryButtonText: { color: COLORS.teal, fontWeight: '800' },
  emptyState: { backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, borderRadius: 22, padding: 23, marginTop: 8 },
  emptyTitle: { color: COLORS.ink, fontSize: 18, fontWeight: '800' },
  emptyBody: { color: COLORS.muted, fontSize: 13, lineHeight: 20, marginTop: 7 },
  historyCard: { backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, borderRadius: 18, padding: 17, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  historyDate: { color: COLORS.ink, fontSize: 14, fontWeight: '800' },
  historySymptoms: { color: COLORS.muted, fontSize: 12, marginTop: 5 },
  levelBadge: { borderRadius: 20, paddingHorizontal: 12, paddingVertical: 7 },
  levelLow: { backgroundColor: COLORS.tealSoft },
  levelAmber: { backgroundColor: COLORS.amberSoft },
  levelDanger: { backgroundColor: COLORS.redSoft },
  levelBadgeText: { color: COLORS.ink, fontSize: 11, fontWeight: '800' },
});
