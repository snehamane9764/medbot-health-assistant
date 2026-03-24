#!/usr/bin/env python3
"""
MedBot CLI - Command Line Health Assistant
"""
import sys
import os
from datetime import datetime

# Add shared module to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'shared'))
from symptom_analyzer import SymptomAnalyzer

# ANSI color codes for terminal output
class Colors:
    RED = '\033[91m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    MAGENTA = '\033[95m'
    CYAN = '\033[96m'
    WHITE = '\033[97m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'
    END = '\033[0m'

def print_header():
    """Print MedBot header"""
    print(f"\n{Colors.CYAN}{Colors.BOLD}")
    print("╔════════════════════════════════════════════════════════╗")
    print("║                                                        ║")
    print("║              🏥 MEDBOT HEALTH ASSISTANT 🏥             ║")
    print("║                                                        ║")
    print("║         Intelligent COVID-19 Detection System         ║")
    print("║                                                        ║")
    print("╚════════════════════════════════════════════════════════╝")
    print(f"{Colors.END}\n")

def print_disclaimer():
    """Print medical disclaimer"""
    print(f"{Colors.YELLOW}⚠️  DISCLAIMER:{Colors.END}")
    print("This is a preliminary health assessment tool.")
    print("Always consult with a healthcare professional for accurate diagnosis.")
    print(f"{Colors.BLUE}{'─' * 60}{Colors.END}\n")

def get_user_info():
    """Collect user information"""
    print(f"{Colors.BOLD}{Colors.CYAN}👤 USER INFORMATION{Colors.END}\n")
    
    name = input(f"{Colors.GREEN}Name: {Colors.END}").strip()
    while not name:
        print(f"{Colors.RED}Name cannot be empty!{Colors.END}")
        name = input(f"{Colors.GREEN}Name: {Colors.END}").strip()
    
    while True:
        try:
            age = int(input(f"{Colors.GREEN}Age: {Colors.END}"))
            if 0 < age < 120:
                break
            print(f"{Colors.RED}Please enter a valid age (1-119){Colors.END}")
        except ValueError:
            print(f"{Colors.RED}Please enter a valid number{Colors.END}")
    
    while True:
        gender = input(f"{Colors.GREEN}Gender (male/female/other): {Colors.END}").lower().strip()
        if gender in ['male', 'female', 'other']:
            break
        print(f"{Colors.RED}Please enter 'male', 'female', or 'other'{Colors.END}")
    
    print()
    return {'name': name, 'age': age, 'gender': gender, 'medical_history': []}

def display_symptom_categories(analyzer):
    """Display symptom categories for selection"""
    categories = analyzer.get_symptom_categories()
    
    print(f"{Colors.BOLD}{Colors.CYAN}🩺 SYMPTOM SELECTION{Colors.END}\n")
    print("Select symptoms by entering their numbers (comma-separated)")
    print(f"{Colors.BLUE}{'─' * 60}{Colors.END}\n")
    
    all_symptoms = []
    idx = 1
    
    category_colors = {
        'respiratory': Colors.CYAN,
        'systemic': Colors.YELLOW,
        'sensory': Colors.MAGENTA,
        'gastrointestinal': Colors.GREEN,
        'other': Colors.WHITE
    }
    
    for category, symptoms in categories.items():
        color = category_colors.get(category, Colors.WHITE)
        print(f"{color}{Colors.BOLD}{category.upper()}{Colors.END}")
        
        for symptom in symptoms:
            formatted_name = analyzer.format_symptom_name(symptom)
            print(f"  {Colors.BOLD}{idx:2d}.{Colors.END} {formatted_name}")
            all_symptoms.append(symptom)
            idx += 1
        print()
    
    return all_symptoms

def get_selected_symptoms(all_symptoms):
    """Get user's symptom selections"""
    while True:
        try:
            selection = input(f"{Colors.GREEN}Enter symptom numbers (e.g., 1,3,5): {Colors.END}").strip()
            if not selection:
                print(f"{Colors.RED}Please select at least one symptom{Colors.END}")
                continue
            
            indices = [int(x.strip()) - 1 for x in selection.split(',')]
            
            if all(0 <= i < len(all_symptoms) for i in indices):
                selected = [all_symptoms[i] for i in indices]
                return selected
            else:
                print(f"{Colors.RED}Invalid symptom number(s). Please try again.{Colors.END}")
        except ValueError:
            print(f"{Colors.RED}Invalid input. Use comma-separated numbers.{Colors.END}")

def get_additional_info():
    """Get temperature and duration"""
    print(f"\n{Colors.BOLD}{Colors.CYAN}📊 ADDITIONAL INFORMATION{Colors.END}\n")
    
    while True:
        try:
            temp_input = input(f"{Colors.GREEN}Body temperature (°F, or press Enter to skip): {Colors.END}").strip()
            if not temp_input:
                temperature = 0.0
                break
            temperature = float(temp_input)
            if 90.0 <= temperature <= 110.0:
                break
            print(f"{Colors.RED}Please enter a realistic temperature (90-110°F){Colors.END}")
        except ValueError:
            print(f"{Colors.RED}Please enter a valid number{Colors.END}")
    
    while True:
        try:
            duration_input = input(f"{Colors.GREEN}How many days have you had symptoms? (or press Enter to skip): {Colors.END}").strip()
            if not duration_input:
                duration = 0
                break
            duration = int(duration_input)
            if duration >= 0:
                break
            print(f"{Colors.RED}Please enter a non-negative number{Colors.END}")
        except ValueError:
            print(f"{Colors.RED}Please enter a valid number{Colors.END}")
    
    return temperature, duration

def display_assessment(assessment):
    """Display assessment results with color coding"""
    print(f"\n{Colors.BOLD}{Colors.BLUE}{'═' * 60}{Colors.END}")
    print(f"{Colors.BOLD}{Colors.CYAN}📋 HEALTH ASSESSMENT REPORT{Colors.END}")
    print(f"{Colors.BOLD}{Colors.BLUE}{'═' * 60}{Colors.END}\n")
    
    # User info
    print(f"{Colors.BOLD}Patient:{Colors.END} {assessment['user']['name']}")
    print(f"{Colors.BOLD}Age:{Colors.END} {assessment['user']['age']} years")
    print(f"{Colors.BOLD}Gender:{Colors.END} {assessment['user']['gender']}")
    print(f"{Colors.BOLD}Assessment Time:{Colors.END} {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    # COVID Risk
    covid_risk = assessment['covid_risk']
    risk_colors = {
        'HIGH': Colors.RED,
        'MODERATE': Colors.YELLOW,
        'LOW': Colors.YELLOW,
        'MINIMAL': Colors.GREEN
    }
    
    risk_color = risk_colors.get(covid_risk['level'], Colors.WHITE)
    
    print(f"{Colors.BOLD}{Colors.CYAN}🦠 COVID-19 RISK ASSESSMENT{Colors.END}")
    print(f"{Colors.BLUE}{'─' * 60}{Colors.END}")
    print(f"{Colors.BOLD}Risk Level:{Colors.END} {risk_color}{Colors.BOLD}{covid_risk['level']}{Colors.END}")
    print(f"{Colors.BOLD}Risk Score:{Colors.END} {risk_color}{covid_risk['percentage']}%{Colors.END}")
    
    if covid_risk['critical_symptoms']:
        print(f"{Colors.BOLD}Critical Symptoms Detected:{Colors.END}")
        for symptom in covid_risk['critical_symptoms']:
            print(f"  {Colors.RED}⚠{Colors.END} {symptom.replace('_', ' ').title()}")
    
    if covid_risk['detected_covid_symptoms']:
        print(f"{Colors.BOLD}COVID-Related Symptoms:{Colors.END}")
        for symptom in covid_risk['detected_covid_symptoms']:
            print(f"  • {symptom.replace('_', ' ').title()}")
    
    print()
    
    # Urgent Care Warning
    if assessment['urgent_care_needed']:
        print(f"{Colors.RED}{Colors.BOLD}{'!' * 60}{Colors.END}")
        print(f"{Colors.RED}{Colors.BOLD}🚨 URGENT MEDICAL ATTENTION REQUIRED 🚨{Colors.END}")
        print(f"{Colors.RED}{Colors.BOLD}{'!' * 60}{Colors.END}\n")
    
    # Recommendations
    print(f"{Colors.BOLD}{Colors.CYAN}💡 RECOMMENDATIONS{Colors.END}")
    print(f"{Colors.BLUE}{'─' * 60}{Colors.END}")
    for i, rec in enumerate(assessment['recommendations'], 1):
        # Color code based on urgency
        if '🚨' in rec or 'IMMEDIATE' in rec.upper():
            color = Colors.RED
        elif '🏥' in rec or '📞' in rec:
            color = Colors.YELLOW
        else:
            color = Colors.WHITE
        print(f"{color}{i}. {rec}{Colors.END}")
    
    print()
    
    # Alert
    if assessment['alert']:
        alert = assessment['alert']
        alert_colors = {
            'CRITICAL': Colors.RED,
            'HIGH': Colors.YELLOW,
            'MODERATE': Colors.YELLOW
        }
        alert_color = alert_colors.get(alert['severity'], Colors.WHITE)
        
        print(f"{alert_color}{Colors.BOLD}🔔 HEALTH ALERT GENERATED{Colors.END}")
        print(f"{Colors.BLUE}{'─' * 60}{Colors.END}")
        print(f"{alert_color}{alert['message']}{Colors.END}")
        print()
    
    # Disclaimer
    print(f"{Colors.BLUE}{'─' * 60}{Colors.END}")
    print(f"{Colors.YELLOW}⚠️  {assessment['disclaimer']}{Colors.END}")
    print(f"{Colors.BOLD}{Colors.BLUE}{'═' * 60}{Colors.END}\n")

def main():
    """Main CLI application"""
    try:
        # Initialize
        analyzer = SymptomAnalyzer()
        
        # Print header and disclaimer
        print_header()
        print_disclaimer()
        
        # Get user information
        user_data = get_user_info()
        
        # Display and select symptoms
        all_symptoms = display_symptom_categories(analyzer)
        selected_symptoms = get_selected_symptoms(all_symptoms)
        
        # Get additional information
        temperature, duration = get_additional_info()
        
        # Perform assessment
        print(f"\n{Colors.CYAN}🔄 Analyzing symptoms...{Colors.END}")
        assessment = analyzer.analyze_symptoms(
            user_data=user_data,
            symptoms=selected_symptoms,
            duration_days=duration,
            temperature=temperature
        )
        
        # Display results
        display_assessment(assessment)
        
        # Save option
        print(f"{Colors.GREEN}Assessment completed successfully!{Colors.END}\n")
        
        # Ask to continue
        while True:
            another = input(f"{Colors.CYAN}Perform another assessment? (yes/no): {Colors.END}").lower().strip()
            if another in ['yes', 'y']:
                print("\n" + "=" * 60 + "\n")
                main()
                break
            elif another in ['no', 'n']:
                print(f"\n{Colors.GREEN}Thank you for using MedBot! Stay healthy! 💚{Colors.END}\n")
                break
            else:
                print(f"{Colors.RED}Please enter 'yes' or 'no'{Colors.END}")
        
    except KeyboardInterrupt:
        print(f"\n\n{Colors.YELLOW}Assessment cancelled by user.{Colors.END}")
        print(f"{Colors.GREEN}Thank you for using MedBot!{Colors.END}\n")
        sys.exit(0)
    except Exception as e:
        print(f"\n{Colors.RED}Error: {str(e)}{Colors.END}\n")
        sys.exit(1)

if __name__ == '__main__':
    main()
