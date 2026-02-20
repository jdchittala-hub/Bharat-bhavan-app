# Bharat Bhavan App

A React Native (Expo SDK 53) application.

## Prerequisites

- **Node.js** (LTS recommended)
- **pnpm** package manager
- **Android SDK** (for local Android builds)
- **Java Development Kit (JDK 17)**

## Getting Started

### Install Dependencies

```bash
pnpm install
```

### Start Development Server

```bash
pnpm start
```

### Run on Android (Development)

```bash
pnpm android
```

### Run on Web

```bash
pnpm web
```

---

## Android Release Build

### 1. Navigate to the Android Directory

```bash
cd android
```

### 2. Clean Previous Build Artifacts

```bash
./gradlew clean
```

> This deletes all Gradle build outputs (`android/build/`, `android/app/build/`). It does **not** affect `node_modules/`, so there is no need to re-run `pnpm install` after cleaning.

### 3. Build the Release APK

```bash
./gradlew assembleRelease
```

Or combine clean and build in one command:

```bash
./gradlew clean assembleRelease
```

### 4. Locate the APK

The generated APK will be at:

```
android/app/build/outputs/apk/release/app-release.apk
```

To find it quickly from the project root:

```bash
find android/app/build/outputs -name "*.apk"
```

### Build an AAB (for Google Play Store)

```bash
cd android && ./gradlew clean bundleRelease
```

Output: `android/app/build/outputs/bundle/release/app-release.aab`

---

## Gradle Commands Reference

| Command                         | Description                                      |
| ------------------------------- | ------------------------------------------------ |
| `./gradlew clean`               | Deletes all build artifacts                      |
| `./gradlew assembleDebug`       | Builds debug APK (uses Metro dev server)         |
| `./gradlew assembleRelease`     | Builds release APK with bundled JS + Hermes      |
| `./gradlew bundleRelease`       | Builds release AAB for Play Store                |
| `./gradlew clean assembleRelease` | Clean + release APK in one command             |
| `./gradlew tasks`               | Lists all available Gradle tasks                 |

---

## EAS Build (Cloud Builds)

Alternatively, you can use EAS Build for cloud-based builds:

```bash
# Install EAS CLI
npm install -g eas-cli

# Log in to Expo
eas login

# Development build (internal distribution)
pnpm build:dev --platform android

# Preview build (internal distribution)
pnpm build:preview --platform android

# Production build (Play Store ready)
pnpm build:prod --platform android
```

---