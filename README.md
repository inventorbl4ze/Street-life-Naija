# CITY LIFE: UNLIMITED

A mobile-first, single-player 3D city-life game project.

## Current prototype (0.2)

The project has moved from the original 2D canvas prototype to a **Three.js 3D scene**. The current foundation includes:

- Third-person 3D player character
- Walk and sprint controls with a mobile joystick
- A compact modern city block with roads, buildings, windows and trees
- Basic wandering pedestrians
- Parked cars and moving traffic vehicles
- Enter/exit parked-car driving mode
- Money and energy HUD
- Local save data on the device
- Mobile-friendly rendering settings

This is an early playable foundation, not a finished open-world game. The city is currently a small prototype district; deeper gameplay systems, interiors, missions, shops, character customization, traffic intelligence, and a much larger world remain to be built.

## Run the web version

- Install Node.js
- Run `npm install`
- Run `npm run dev`
- Open the local Vite address in a browser

## Android APK

Capacitor packages the bundled web game for Android. GitHub Actions is configured to build a **debug APK** when the game source changes or when the workflow is manually run.

After a successful workflow:
1. Open the repository's **Actions** tab.
2. Open the latest **Build CITY LIFE Android APK** run.
3. Download the `CITY-LIFE-UNLIMITED-debug-apk` artifact.
4. Extract the ZIP and install `app-debug.apk` on an Android device.

A debug APK is for testing, not a Play Store release. A store release needs a separately signed release build and store preparation.

## Main files

- `index.html` — game screen and HUD
- `src/main.js` — Three.js world, player, vehicles and simulation
- `src/style.css` — mobile interface and controls
- `capacitor.config.json` — Android wrapper settings
