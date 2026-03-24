import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator
} from 'react-native';
import axios from 'axios';

const API_URL = 'http://192.168.1.100:5000/api';

export default function App() {
  const [screen, setScreen] = useState('home');
  const [userData, setUserData] = useState({
    name: '',
    age: '',
    gender: 'male'
  });
  const [symptomCategories, setSymptomCategories] = useState({});
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [temperature, setTemperature] = useState('');
  const [duration, setDuration] = useState('');
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSymptoms();
  }, []);

  const fetchSymptoms = async () => {
    try {
      const response = await axios.get(`${API_URL}/symptoms/categories`);
      setSymptomCategories(response.data);
    } catch (error) {
      console.error('Error fetching symptoms:', error);
    }
  };

  const toggleSymptom = (symptomKey) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptomKey)
        ? prev.filter(s => s !== symptomKey)
        : [...prev, symptomKey]
    );
  };

  const handleAssessment = async () => {
    if (!userData.name || !userData.age) {
      Alert.alert('Error', 'Please fill in your name and age');
      return;
    }

    if (selectedSymptoms.length === 0) {
      Alert.alert('Error', 'Please select at least one symptom');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/assess`, {
        name: userData.name,
        age: parseInt(userData.age),
        gender: userData.gender,
        symptoms: selectedSymptoms,
        temperature: parseFloat(temperature) || 0,
        duration_days: parseInt(duration) || 0
      });

      setAssessment(response.data);
      setScreen('results');
    } catch (error) {
      console.error('Error performing assessment:', error);
      Alert.alert('Error', 'Failed to perform assessment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetAssessment = () => {
    setScreen('home');
    setSelectedSymptoms([]);
    setTemperature('');
    setDuration('');
    setAssessment(null);
  };

  const getRiskColor = (level) => {
    const colors = {
      'HIGH': '#e74c3c',
      'MODERATE': '#f39c12',
      'LOW': '#f1c40f',
      'MINIMAL': '#27ae60'
    };
    return colors[level] || '#95a5a6';
  };

  // Home Screen
  if (screen === 'home') {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.logo}>🏥</Text>
            <Text style={styles.title}>MedBot</Text>
            <Text style={styles.subtitle}>Health Assistant</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Your Information</Text>
            
            <Text style={styles.label}>Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              value={userData.name}
              onChangeText={(text) => setUserData({...userData, name: text})}
            />

            <Text style={styles.label}>Age *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your age"
              keyboardType="numeric"
              value={userData.age}
              onChangeText={(text) => setUserData({...userData, age: text})}
            />

            <Text style={styles.label}>Gender *</Text>
            <View style={styles.genderButtons}>
              {['male', 'female', 'other'].map(gender => (
                <TouchableOpacity
                  key={gender}
                  style={[
                    styles.genderButton,
                    userData.gender === gender && styles.genderButtonActive
                  ]}
                  onPress={() => setUserData({...userData, gender})}
                >
                  <Text
                    style={[
                      styles.genderButtonText,
                      userData.gender === gender && styles.genderButtonTextActive
                    ]}
                  >
                    {gender.charAt(0).toUpperCase() + gender.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => setScreen('symptoms')}
            >
              <Text style={styles.primaryButtonText}>Continue →</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Symptoms Screen
  if (screen === 'symptoms') {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Select Symptoms</Text>
            <Text style={styles.subtitle}>Choose all that apply</Text>
          </View>

          {Object.entries(symptomCategories).map(([category, symptoms]) => (
            <View key={category} style={styles.card}>
              <Text style={styles.categoryTitle}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Text>
              <View style={styles.symptomGrid}>
                {symptoms.map(symptom => (
                  <TouchableOpacity
                    key={symptom.key}
                    style={[
                      styles.symptomButton,
                      selectedSymptoms.includes(symptom.key) && styles.symptomButtonActive
                    ]}
                    onPress={() => toggleSymptom(symptom.key)}
                  >
                    <Text
                      style={[
                        styles.symptomButtonText,
                        selectedSymptoms.includes(symptom.key) && styles.symptomButtonTextActive
                      ]}
                    >
                      {selectedSymptoms.includes(symptom.key) ? '✓ ' : ''}
                      {symptom.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Additional Information</Text>
            
            <Text style={styles.label}>Temperature (°F)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 98.6"
              keyboardType="decimal-pad"
              value={temperature}
              onChangeText={setTemperature}
            />

            <Text style={styles.label}>Duration (days)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 3"
              keyboardType="numeric"
              value={duration}
              onChangeText={setDuration}
            />
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => setScreen('home')}
            >
              <Text style={styles.secondaryButtonText}>← Back</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleAssessment}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.primaryButtonText}>Assess →</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Results Screen
  if (screen === 'results' && assessment) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Your Assessment</Text>
          </View>

          {/* Risk Card */}
          <View style={[styles.card, { borderLeftWidth: 5, borderLeftColor: getRiskColor(assessment.covid_risk.level) }]}>
            <Text style={styles.cardTitle}>🦠 COVID-19 Risk</Text>
            <View style={styles.riskInfo}>
              <Text style={styles.riskLabel}>Level:</Text>
              <Text style={[styles.riskValue, { color: getRiskColor(assessment.covid_risk.level) }]}>
                {assessment.covid_risk.level}
              </Text>
            </View>
            <View style={styles.riskInfo}>
              <Text style={styles.riskLabel}>Score:</Text>
              <Text style={styles.riskValue}>{assessment.covid_risk.percentage}%</Text>
            </View>
          </View>

          {/* Urgent Warning */}
          {assessment.urgent_care_needed && (
            <View style={[styles.card, styles.urgentCard]}>
              <Text style={styles.urgentTitle}>🚨 URGENT</Text>
              <Text style={styles.urgentText}>Seek immediate medical attention</Text>
            </View>
          )}

          {/* Recommendations */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>💡 Recommendations</Text>
            {assessment.recommendations.map((rec, idx) => (
              <View key={idx} style={styles.recommendation}>
                <Text style={styles.recommendationText}>{rec}</Text>
              </View>
            ))}
          </View>

          {/* Disclaimer */}
          <View style={styles.disclaimerCard}>
            <Text style={styles.disclaimerText}>
              ⚠️ {assessment.disclaimer}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={resetAssessment}
          >
            <Text style={styles.primaryButtonText}>New Assessment</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    fontSize: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c7fb1',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 5,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
    marginTop: 10,
  },
  input: {
    borderWidth: 2,
    borderColor: '#e1e8ed',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  genderButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  genderButton: {
    flex: 1,
    padding: 12,
    borderWidth: 2,
    borderColor: '#e1e8ed',
    borderRadius: 8,
    alignItems: 'center',
  },
  genderButtonActive: {
    backgroundColor: '#2c7fb1',
    borderColor: '#2c7fb1',
  },
  genderButtonText: {
    color: '#2c3e50',
    fontWeight: '600',
  },
  genderButtonTextActive: {
    color: '#fff',
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c7fb1',
    marginBottom: 10,
    textTransform: 'capitalize',
  },
  symptomGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  symptomButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 2,
    borderColor: '#e1e8ed',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  symptomButtonActive: {
    backgroundColor: '#2c7fb1',
    borderColor: '#2c7fb1',
  },
  symptomButtonText: {
    fontSize: 14,
    color: '#2c3e50',
  },
  symptomButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: '#2c7fb1',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    borderWidth: 1,
    borderColor: '#e1e8ed',
  },
  secondaryButtonText: {
    color: '#2c3e50',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  riskInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  riskLabel: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  riskValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  urgentCard: {
    backgroundColor: '#f8d7da',
    borderWidth: 3,
    borderColor: '#e74c3c',
  },
  urgentTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#e74c3c',
    textAlign: 'center',
  },
  urgentText: {
    fontSize: 16,
    color: '#721c24',
    textAlign: 'center',
    marginTop: 5,
  },
  recommendation: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2c7fb1',
    borderRadius: 4,
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 14,
    color: '#2c3e50',
  },
  disclaimerCard: {
    backgroundColor: '#d1ecf1',
    padding: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#0c5460',
    borderRadius: 4,
    marginBottom: 15,
  },
  disclaimerText: {
    fontSize: 14,
    color: '#0c5460',
  },
});
