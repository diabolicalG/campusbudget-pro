@echo off
REM Campus Budget Pro - Capacitor Android Build Script (Windows)
REM This script automates the process of building an APK from the React app

echo.
echo 🚀 Starting Capacitor Android APK Build Process...
echo.

REM Step 1: Install dependencies
echo 📦 Step 1: Installing npm dependencies...
call npm install
echo ✅ Dependencies installed
echo.

REM Step 2: Build React app
echo 🔨 Step 2: Building React application...
call npm run build
echo ✅ React app built successfully
echo.

REM Step 3: Initialize Capacitor (if not already done)
if not exist "capacitor.config.json" (
  echo ⚙️ Step 3: Initializing Capacitor...
  call npx cap init
  echo ✅ Capacitor initialized
) else (
  echo ✅ Step 3: Capacitor already initialized
)
echo.

REM Step 4: Install Capacitor CLI and Android
echo 📥 Step 4: Installing Capacitor CLI and Android platform...
call npm install @capacitor/cli @capacitor/core @capacitor/android --save
echo ✅ Capacitor packages installed
echo.

REM Step 5: Add Android platform (if not already added)
if not exist "android" (
  echo 🤖 Step 5: Adding Android platform...
  call npx cap add android
  echo ✅ Android platform added
) else (
  echo ✅ Step 5: Android platform already added
)
echo.

REM Step 6: Copy web assets to Android
echo 📋 Step 6: Copying web assets to Android...
call npx cap copy android
echo ✅ Web assets copied
echo.

REM Step 7: Sync Capacitor configuration
echo 🔄 Step 7: Syncing Capacitor configuration...
call npx cap sync android
echo ✅ Capacitor synced
echo.

echo ✨ Build preparation complete!
echo.
echo Next steps:
echo 1. Open Android Studio: npx cap open android
echo 2. In Android Studio:
echo    - Build ^> Build Bundle(s) / APK(s) ^> Build APK(s)
echo    - Or run: cd android ^&^& gradlew.bat assembleDebug
echo.
echo Your APK will be located at:
echo   android\app\build\outputs\apk\debug\app-debug.apk
echo.
