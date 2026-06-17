# MedBot Health Assistant

MedBot is a cross-platform health assistant portfolio project with a polished iPhone-ready mobile app. It guides users through a short symptom assessment, detects COVID-19-related symptom patterns, flags emergency warning signs, and returns clear preliminary guidance.

> **Medical disclaimer:** MedBot is an educational software project. It does not diagnose illness or replace advice from a licensed healthcare professional. In an emergency, call 911 in the United States or your local emergency number.

## Repository Structure

```text
.
├── mobile-ios-app/        # Expo React Native app for iPhone, Android, and web
├── docs/                  # Recruiter-facing project documentation
├── results/               # Test results and demo outcomes
├── src/                   # Current local app source copy
└── tests/                 # Current local test copy
```

The primary GitHub showcase folder is [`mobile-ios-app`](./mobile-ios-app).

## Key Features

- iPhone-ready React Native app built with Expo
- Guided three-step symptom assessment
- Rule-based risk score with transparent symptom weights
- COVID-19 symptom pattern detection
- Emergency warning sign escalation
- Session-based assessment history
- Web preview support for quick demos
- Automated tests for low-risk, high-risk, and urgent scenarios

## Tech Stack

- React Native
- Expo
- JavaScript
- Node.js test runner

Recommended runtime: Node.js 20.19.4 or newer.

## Run The iPhone App

```bash
npm install
npx expo start -c
```

Then scan the QR code with the iPhone Camera app and open it in Expo Go.

You can also run the same app from the project root:

```bash
npm start
```

## Build An Installable iPhone App

```bash
cd mobile-ios-app
npm install -g eas-cli
eas login
npm run build:ios
```

Expo will generate an iOS build link. Apple may require an Apple Developer account for installation on a physical iPhone.

## Results

See [`results/TEST_RESULTS.md`](./results/TEST_RESULTS.md) for the verified assessment engine results.

## Offline Web Demo

```bash
npm run offline:web
```

Then open `http://localhost:4173`. To make it available on your phone without running Expo, host the generated `mobile-ios-app/dist/` folder on GitHub Pages, Netlify, or Vercel. On iPhone, open the HTTPS link in Safari, tap Share, then tap **Add to Home Screen**.

For iPhone testing on the same Wi-Fi:

```bash
npm run offline:web:phone
```

Open the printed phone URL in Safari.

## Portfolio Summary

Developed a cross-platform health assistant with iPhone, Android, and web interfaces. Built a transparent symptom-analysis engine that collects patient context, detects COVID-19-related symptom patterns, flags emergency symptoms, and returns actionable preliminary guidance through a polished assessment flow.
