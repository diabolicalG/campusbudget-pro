# Capacitor Android APK Setup Guide

This guide will help you convert Campus Budget Pro to an Android APK using Capacitor.

## Prerequisites

- **Node.js** (v14+) and npm
- **Java Development Kit (JDK)** 11 or higher
- **Android SDK** (API level 33+)
- **Android Studio** (recommended)
- **Git**

## Step 1: Install Dependencies

From the project root (`campusbudget-pro/` directory):

```bash
cd campusbudget-pro
npm install
```

## Step 2: Add Capacitor to Your Project

```bash
npm install @capacitor/core @capacitor/cli
npm install -D @capacitor/android
```

## Step 3: Initialize Capacitor

```bash
npx cap init
```

When prompted:
- **App name:** Campus Budget Pro
- **App Package ID:** com.campusbudgetpro.app
- **Directory containing web assets to copy into Capacitor:** build
- **Directory for platform-specific code:** android

This will create the `capacitor.config.json` file (already added to this branch).

## Step 4: Build React Web Assets

```bash
npm run build
```

This generates the optimized build in the `build/` directory.

## Step 5: Add Android Platform

```bash
npx cap add android
```

This creates the `android/` folder with the Android project structure.

## Step 6: Copy Web Assets to Android

```bash
npx cap copy android
```

## Step 7: Open in Android Studio

```bash
npx cap open android
```

This opens Android Studio with the Android project loaded.

### In Android Studio:

1. **Build the APK:**
   - Go to **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
   - Wait for the build to complete
   
2. **Or Build with Gradle (Command Line):**
   ```bash
   cd android
   ./gradlew assembleDebug
   ```
   
   For a release APK:
   ```bash
   ./gradlew assembleRelease
   ```

## Step 8: Locate Your APK

- **Debug APK:** `android/app/build/outputs/apk/debug/app-debug.apk`
- **Release APK:** `android/app/build/outputs/apk/release/app-release.apk`

## Step 9: Install on Device or Emulator

### Using ADB (Android Debug Bridge):

```bash
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

Or in Android Studio:
- Click **Run** → **Run 'app'** to install and launch on a connected device/emulator

## Troubleshooting

### Firebase Configuration
Make sure your `campusbudget-pro/src/firebase.js` has valid Firebase credentials for Android:
- Update `firebaseConfig` with your actual Firebase project details
- Enable authentication methods in Firebase Console (Email/Password)

### Build Errors
- Clear Gradle cache: `cd android && ./gradlew clean`
- Rebuild: `./gradlew assembleDebug`

### Android SDK Issues
- Ensure Android SDK API 33+ is installed
- Set `ANDROID_SDK_ROOT` environment variable if needed:
  ```bash
  export ANDROID_SDK_ROOT=~/Library/Android/sdk  # macOS/Linux
  # or
  set ANDROID_SDK_ROOT=%USERPROFILE%\AppData\Local\Android\sdk  # Windows
  ```

## Updating Your App

After making changes to your React code:

1. Rebuild React assets: `npm run build`
2. Copy to Android: `npx cap copy android`
3. Rebuild APK in Android Studio or via: `cd android && ./gradlew assembleDebug`

## Next Steps

- Test on Android device or emulator
- Configure Firebase authentication
- Sign APK for production release
- Publish to Google Play Store (requires Play Store developer account)

For more info: https://capacitorjs.com/docs/getting-started
