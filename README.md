# CITY LIFE: UNLIMITED

A mobile-first, single-player 3D city-life game prototype.

## Current build

The project uses Three.js and Vite, with Capacitor configured for Android packaging.

### Playable foundations
- Third-person 3D character and follow camera
- Mobile joystick, sprint and keyboard controls
- Compact modern city district with roads, buildings, trees and windows
- Pedestrians and simple traffic
- Parked cars and a basic enter/drive/exit loop
- Local job board with delivery-style objectives and rewards
- Corner-shop purchases and a starter-home ownership system
- Money, energy, inventory and local device saves
- Repeating day-to-evening lighting cycle
- Original 16-second cinematic opening with camera flyover, chapter captions, title reveal and skip button

## Current limitations

This is an early prototype, not a finished GTA-scale open world. The city is one compact district. Interiors are not yet explorable; vehicles, pedestrian AI, jobs, traffic rules, missions, property management, animations, audio, and the city map need substantial expansion and testing. Some systems are intentionally simple placeholders.

## Run the web version

- Install Node.js
- Run `npm install`
- Run `npm run dev`
- Open the local Vite address in a browser

## Android APK

GitHub Actions is configured to build a **debug APK** when game source files change or when the workflow is manually run.

After a successful workflow:
1. Open the repository's **Actions** tab.
2. Open the latest **Build CITY LIFE Android APK** run.
3. Download the `CITY-LIFE-UNLIMITED-debug-apk` artifact.
4. Extract the ZIP and install `app-debug.apk` on an Android device.

A debug APK is for testing, not a Play Store release. A store release requires a separately signed release build and further device testing.

## Main files

- `index.html` — game shell, HUD, intro and touch controls
- `src/main.js` — 3D world, cinematic camera, player, cars, pedestrians and game systems
- `src/style.css` — responsive mobile UI
- `capacitor.config.json` — Android wrapper configuration


## City services and shopping update
- Enterable furnished interiors for supermarkets, restaurants, banks, hospitals, shopping malls, homes and specialist stores.
- Specialist furniture stores include chair, bed, sofa, table and electronics shops.
- Furniture purchases are added to the player's furniture collection and appear in residential interiors.
- Supermarket and food-store shopping adds groceries and household supplies to inventory.
- Restaurant meals restore energy; the hospital offers a rest service; the bank supports deposits and withdrawals.
- The city landmarks use the in-game dollar economy and the $50,000 starting balance.
- These are prototype interiors built from 3D game assets; they are not yet full multi-floor buildings.
