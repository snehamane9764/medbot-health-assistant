# MedBot Health Assistant

A recruiter-ready React Native health assistant for iOS, Android, and web. MedBot guides users through a short symptom check, identifies COVID-19-related patterns and emergency warning signs, and provides clear next-step guidance.

> **Medical disclaimer:** MedBot is an educational portfolio project. It does not diagnose illness or replace advice from a licensed healthcare professional. In an emergency, call 911 in the United States or your local emergency number.

## Highlights

- Guided three-step symptom assessment
- Rule-based risk score with transparent symptom weights
- Immediate escalation for emergency warning signs
- COVID-19 symptom pattern detection
- Session-based assessment history
- Responsive interface for iOS, Android, and web
- Private, offline-first assessment flow
- Automated tests for low-risk, high-risk, and urgent scenarios
- Expo Go friendly project structure

## Tech stack

- React Native
- Expo
- JavaScript
- Node.js test runner

Recommended runtime: Node.js 20.19.4 or newer.

If you use nvm:

```bash
nvm use
```

The repository is intentionally ready for a Flask API integration. The assessment engine currently runs on-device so reviewers can use the complete demo without configuring a server.

## Run locally

```bash
npm install
npm start
```

For iPhone testing, install Expo Go from the App Store, then scan the QR code printed by Expo.

To run in a browser:

```bash
npm run web
```

## Offline Web Version

Build and run a static web version without the Expo development server:

```bash
npm run offline:web
```

Then open:

```text
http://localhost:4173
```

To open from an iPhone on the same Wi-Fi:

```bash
npm run offline:web:phone
```

Use the printed `Open on phone` URL in Safari on your iPhone.

For phone use, host the `dist/` folder on an HTTPS site such as GitHub Pages, Netlify, or Vercel. After the first successful load, the service worker caches the app so it can keep opening offline. On iPhone, open the HTTPS link in Safari, tap Share, then tap **Add to Home Screen**.

## Install on iPhone

Fastest option for demos:

1. Install Expo Go on your iPhone.
2. Run `npm start`.
3. Scan the QR code with the iPhone Camera app.
4. Keep the laptop and phone on the same Wi-Fi network.

Real installable iPhone build:

```bash
npm install -g eas-cli
eas login
npm run build:ios
```

Choose the internal distribution option when prompted. Expo will create an iOS build link you can open on your iPhone. Apple may require signing into an Apple Developer account to install builds on a physical device.

To run the assessment-engine tests:

```bash
npm test
```

## Assessment approach

The engine assigns documented weights to reported symptoms and adjusts the score using temperature, symptom duration, and age. Emergency signs always override the numeric score and produce urgent guidance. This deterministic approach is easy to audit and appropriate for demonstrating preliminary triage logic without claiming an AI-generated diagnosis.

## Portfolio summary

Developed a cross-platform health assistant with native mobile and web interfaces. Built a transparent symptom-analysis engine that collects patient context, detects COVID-19-related symptom patterns, flags emergency warning signs, and returns actionable preliminary guidance through a polished, accessible assessment flow.

## Future improvements

- Connect the existing Flask API and SQLite assessment history
- Add secure authentication and encrypted cloud sync
- Localize the assessment for additional languages
- Add clinician-reviewed symptom protocols and versioned medical content
- Add end-to-end tests and App Store deployment automation
