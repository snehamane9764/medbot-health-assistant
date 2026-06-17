# Architecture

## App Layer

The mobile app is built with React Native and Expo. It uses a simple screen-state flow:

1. Home screen
2. User details
3. Symptom selection
4. Temperature and duration
5. Result summary
6. Session history

## Assessment Engine

The rule-based engine lives in:

```text
mobile-ios-app/src/riskEngine.js
```

It accepts:

- reported symptoms
- temperature
- symptom duration
- age

It returns:

- numeric score
- risk level
- emergency symptoms
- next-step guidance

## Risk Model

Each symptom has a documented weight. Temperature, duration, and age can increase the score. Emergency warning signs override normal scoring and route the user to urgent guidance.

## Why Rule-Based

A rule-based model is transparent, testable, and easier to explain in a healthcare portfolio project. It avoids presenting uncertain generated text as medical diagnosis.
