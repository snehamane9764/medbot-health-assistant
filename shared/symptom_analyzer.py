"""
MedBot Symptom Analyzer - Rule-based COVID-19 and General Health Assessment
"""
from datetime import datetime
from typing import Dict, List, Tuple

class SymptomAnalyzer:
    """Rule-based symptom analysis engine for COVID-19 detection and health assessment"""
    
    # COVID-19 specific symptoms with severity weights
    COVID_SYMPTOMS = {
        'fever': {'weight': 3, 'critical': True},
        'dry_cough': {'weight': 3, 'critical': True},
        'fatigue': {'weight': 2, 'critical': False},
        'loss_of_taste': {'weight': 4, 'critical': True},
        'loss_of_smell': {'weight': 4, 'critical': True},
        'difficulty_breathing': {'weight': 5, 'critical': True},
        'chest_pain': {'weight': 4, 'critical': True},
        'sore_throat': {'weight': 2, 'critical': False},
        'headache': {'weight': 1, 'critical': False},
        'body_aches': {'weight': 2, 'critical': False},
        'chills': {'weight': 2, 'critical': False},
        'nausea': {'weight': 1, 'critical': False},
        'diarrhea': {'weight': 1, 'critical': False},
        'congestion': {'weight': 1, 'critical': False}
    }
    
    # General symptoms for broader health assessment
    GENERAL_SYMPTOMS = {
        'dizziness': {'severity': 'moderate', 'urgent': False},
        'rash': {'severity': 'low', 'urgent': False},
        'joint_pain': {'severity': 'moderate', 'urgent': False},
        'confusion': {'severity': 'high', 'urgent': True},
        'severe_abdominal_pain': {'severity': 'high', 'urgent': True},
        'persistent_vomiting': {'severity': 'high', 'urgent': True},
        'blood_in_stool': {'severity': 'high', 'urgent': True},
        'sudden_vision_changes': {'severity': 'high', 'urgent': True}
    }
    
    def __init__(self):
        self.assessment_history = []
    
    def analyze_symptoms(
        self, 
        user_data: Dict[str, any], 
        symptoms: List[str],
        duration_days: int = 0,
        temperature: float = 0.0
    ) -> Dict[str, any]:
        """
        Perform comprehensive symptom analysis
        
        Args:
            user_data: Dict with 'name', 'age', 'gender', 'medical_history'
            symptoms: List of reported symptoms
            duration_days: How long symptoms have been present
            temperature: Body temperature in Fahrenheit
            
        Returns:
            Dict with analysis results
        """
        # Calculate COVID-19 risk score
        covid_risk = self._calculate_covid_risk(symptoms, temperature, duration_days)
        
        # Check for urgent symptoms
        urgent_care = self._check_urgent_symptoms(symptoms, user_data['age'])
        
        # Generate recommendations
        recommendations = self._generate_recommendations(
            covid_risk, urgent_care, symptoms, user_data['age']
        )
        
        # Create health alert if needed
        alert = self._create_health_alert(covid_risk, urgent_care, user_data)
        
        # Build assessment report
        assessment = {
            'timestamp': datetime.now().isoformat(),
            'user': {
                'name': user_data['name'],
                'age': user_data['age'],
                'gender': user_data['gender']
            },
            'symptoms': symptoms,
            'duration_days': duration_days,
            'temperature': temperature,
            'covid_risk': covid_risk,
            'urgent_care_needed': urgent_care,
            'recommendations': recommendations,
            'alert': alert,
            'disclaimer': 'This is a preliminary assessment. Please consult a healthcare professional for accurate diagnosis.'
        }
        
        self.assessment_history.append(assessment)
        return assessment
    
    def _calculate_covid_risk(
        self, 
        symptoms: List[str], 
        temperature: float,
        duration_days: int
    ) -> Dict[str, any]:
        """Calculate COVID-19 infection likelihood"""
        score = 0
        max_score = 0
        critical_symptoms = []
        
        for symptom in symptoms:
            if symptom in self.COVID_SYMPTOMS:
                weight = self.COVID_SYMPTOMS[symptom]['weight']
                score += weight
                max_score += weight
                
                if self.COVID_SYMPTOMS[symptom]['critical']:
                    critical_symptoms.append(symptom)
        
        # Temperature bonus
        if temperature >= 100.4:  # Fever threshold
            score += 3
            max_score += 3
            critical_symptoms.append('fever')
        
        # Duration factor (prolonged symptoms increase risk)
        if duration_days >= 3:
            score += 1
        
        # Calculate percentage
        if max_score > 0:
            risk_percentage = (score / (max_score + 3)) * 100  # +3 for duration
        else:
            risk_percentage = 0
        
        # Determine risk level
        if risk_percentage >= 70 or len(critical_symptoms) >= 3:
            risk_level = 'HIGH'
            color = 'red'
        elif risk_percentage >= 40 or len(critical_symptoms) >= 2:
            risk_level = 'MODERATE'
            color = 'orange'
        elif risk_percentage >= 20:
            risk_level = 'LOW'
            color = 'yellow'
        else:
            risk_level = 'MINIMAL'
            color = 'green'
        
        return {
            'level': risk_level,
            'percentage': round(risk_percentage, 1),
            'score': score,
            'critical_symptoms': critical_symptoms,
            'color': color,
            'detected_covid_symptoms': [s for s in symptoms if s in self.COVID_SYMPTOMS]
        }
    
    def _check_urgent_symptoms(self, symptoms: List[str], age: int) -> bool:
        """Check if immediate medical attention is needed"""
        urgent_symptoms = [
            'difficulty_breathing',
            'chest_pain',
            'confusion',
            'severe_abdominal_pain',
            'persistent_vomiting',
            'blood_in_stool',
            'sudden_vision_changes'
        ]
        
        # Check for urgent symptoms
        for symptom in symptoms:
            if symptom in urgent_symptoms:
                return True
        
        # Age-based risk (elderly and very young)
        if age >= 65 or age <= 5:
            if 'fever' in symptoms or 'difficulty_breathing' in symptoms:
                return True
        
        return False
    
    def _generate_recommendations(
        self, 
        covid_risk: Dict, 
        urgent_care: bool,
        symptoms: List[str],
        age: int
    ) -> List[str]:
        """Generate personalized health recommendations"""
        recommendations = []
        
        if urgent_care:
            recommendations.append('🚨 SEEK IMMEDIATE MEDICAL ATTENTION - Visit ER or call 911')
            recommendations.append('Do not drive yourself - have someone take you or call emergency services')
            return recommendations
        
        if covid_risk['level'] == 'HIGH':
            recommendations.extend([
                '🏥 Contact your healthcare provider immediately',
                '📞 Consider COVID-19 testing',
                '🏠 Self-isolate to prevent potential spread',
                '😷 Wear a mask if you must be around others',
                '📊 Monitor your symptoms closely - call 911 if breathing becomes difficult'
            ])
        elif covid_risk['level'] == 'MODERATE':
            recommendations.extend([
                '📞 Schedule a telehealth or in-person appointment with your doctor',
                '🧪 Consider getting tested for COVID-19',
                '🏠 Stay home and rest',
                '💧 Stay hydrated and monitor symptoms',
                '😷 Wear a mask around household members'
            ])
        elif covid_risk['level'] == 'LOW':
            recommendations.extend([
                '🏠 Rest and monitor your symptoms',
                '💧 Drink plenty of fluids',
                '🌡️ Monitor your temperature',
                '📞 Contact doctor if symptoms worsen',
                '😷 Wear mask if going out in public'
            ])
        else:
            recommendations.extend([
                '✅ Your symptoms appear mild',
                '💧 Stay hydrated',
                '🛏️ Get adequate rest',
                '📞 Contact doctor if symptoms develop or worsen'
            ])
        
        # Age-specific advice
        if age >= 65:
            recommendations.append('⚠️ As a senior, monitor symptoms closely and don\'t hesitate to seek care')
        elif age <= 12:
            recommendations.append('⚠️ Children should be monitored closely - contact pediatrician if concerned')
        
        # Symptom-specific advice
        if 'fever' in symptoms:
            recommendations.append('🌡️ Take fever-reducing medication as needed (acetaminophen or ibuprofen)')
        
        if 'dry_cough' in symptoms or 'sore_throat' in symptoms:
            recommendations.append('🍯 Use throat lozenges and warm liquids for comfort')
        
        return recommendations
    
    def _create_health_alert(
        self, 
        covid_risk: Dict, 
        urgent_care: bool,
        user_data: Dict
    ) -> Dict[str, any]:
        """Create automated health alert for high-risk cases"""
        if not (urgent_care or covid_risk['level'] in ['HIGH', 'MODERATE']):
            return None
        
        if urgent_care:
            severity = 'CRITICAL'
            message = f"URGENT: {user_data['name']} requires immediate medical attention"
        elif covid_risk['level'] == 'HIGH':
            severity = 'HIGH'
            message = f"HIGH RISK: {user_data['name']} shows high COVID-19 risk ({covid_risk['percentage']}%)"
        else:
            severity = 'MODERATE'
            message = f"MODERATE RISK: {user_data['name']} shows moderate COVID-19 risk ({covid_risk['percentage']}%)"
        
        return {
            'severity': severity,
            'message': message,
            'timestamp': datetime.now().isoformat(),
            'requires_action': urgent_care or covid_risk['level'] == 'HIGH',
            'user': user_data['name'],
            'age': user_data['age']
        }
    
    def get_symptom_categories(self) -> Dict[str, List[str]]:
        """Return categorized symptoms for UI selection"""
        return {
            'respiratory': [
                'dry_cough', 'difficulty_breathing', 'sore_throat', 
                'congestion', 'chest_pain'
            ],
            'systemic': [
                'fever', 'fatigue', 'chills', 'body_aches', 
                'headache'
            ],
            'sensory': [
                'loss_of_taste', 'loss_of_smell', 'sudden_vision_changes'
            ],
            'gastrointestinal': [
                'nausea', 'diarrhea', 'severe_abdominal_pain',
                'persistent_vomiting', 'blood_in_stool'
            ],
            'other': [
                'dizziness', 'rash', 'joint_pain', 'confusion'
            ]
        }
    
    def format_symptom_name(self, symptom: str) -> str:
        """Convert symptom key to readable name"""
        return symptom.replace('_', ' ').title()


# Example usage and testing
if __name__ == '__main__':
    analyzer = SymptomAnalyzer()
    
    # Test case 1: High COVID risk
    user = {
        'name': 'John Doe',
        'age': 45,
        'gender': 'male',
        'medical_history': []
    }
    
    symptoms = ['fever', 'dry_cough', 'loss_of_taste', 'fatigue']
    result = analyzer.analyze_symptoms(user, symptoms, duration_days=3, temperature=101.5)
    
    print("=== COVID-19 RISK ASSESSMENT ===")
    print(f"Risk Level: {result['covid_risk']['level']}")
    print(f"Risk Score: {result['covid_risk']['percentage']}%")
    print(f"Critical Symptoms: {result['covid_risk']['critical_symptoms']}")
    print(f"\nRecommendations:")
    for rec in result['recommendations']:
        print(f"  {rec}")
