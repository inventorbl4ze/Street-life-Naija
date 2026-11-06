# CITY LIFE: UNLIMITED

A mobile-first, single-player city-life game project.

## Playable prototype
The current game is an early **2D top-down prototype**. It includes a city map, touch joystick, pedestrians, traffic, buildings, basic shops, missions, money, and local save data.

The long-term target is a larger 3D city game. The current prototype is not yet a GTA-scale 3D game.

## Android APK
This project uses Capacitor to package the web game for Android. GitHub Actions is configured to build a debug APK when the game files change or when the workflow is manually run.

After a successful workflow:
1. Open the repository's **Actions** tab.
2. Open the latest **Build CITY LIFE Android APK** run.
3. Download the `CITY-LIFE-UNLIMITED-debug-apk` artifact.
4. Extract the ZIP and install `app-debug.apk` on an Android device.

A debug APK is for testing. A Play Store release needs a separately signed release build and store preparation.

## Local development
- `npm install`
- `npm run build`
- `npx cap add android`
- `npx cap sync android`

The web game is in `index.html`.
