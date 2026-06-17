# iPhone Usage Guide

## Quick Demo With Expo Go

1. Install Expo Go from the iPhone App Store.
2. Open a terminal in the app folder:

```bash
cd mobile-ios-app
npx expo start -c
```

3. Make sure the iPhone and laptop are on the same Wi-Fi network.
4. Scan the QR code with the iPhone Camera app.
5. Open the link in Expo Go.

This is the fastest way to show the app during interviews or recruiter screens.

## Installable iPhone Build

For an app that works without your laptop running the Expo server:

```bash
cd mobile-ios-app
npm install -g eas-cli
eas login
npm run build:ios
```

Expo will create a build link. Apple may require an Apple Developer account to install the app on a physical iPhone.
