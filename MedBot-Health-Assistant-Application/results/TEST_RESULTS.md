# Test Results

Verified on June 16, 2026.

Environment note: Expo SDK 54 recommends Node.js 20.19.4 or newer. The assessment-engine tests pass independently through Node's built-in test runner.

Command:

```bash
npm test
```

Result:

```text
tests 3
pass 3
fail 0
```

Covered scenarios:

- Low risk when no symptoms are reported
- High risk for fever, cough, loss of taste or smell, elevated temperature, and multi-day duration
- Urgent guidance when an emergency warning sign is reported

Additional verification completed before the folder was packaged:

```bash
npx expo export --platform web --output-dir /tmp/medbot-web-check
```

Result:

```text
Web Bundled successfully
Exported: /tmp/medbot-web-check
```

Final packaged app verification:

```bash
cd mobile-ios-app
npx expo export --platform web --output-dir /tmp/medbot-mobile-web-check
```

Result:

```text
Web Bundled successfully
Exported: /tmp/medbot-mobile-web-check
```

Offline web build verification:

```bash
cd mobile-ios-app
npm run build:web
```

Result:

```text
Web Bundled successfully
Exported: dist
```
