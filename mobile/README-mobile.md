# Todo App Mobile (Expo + React Native + TypeScript)

Mobile companion to the existing web + backend Todo application.

## Features
- Add, list, toggle, delete todos
- Pull to refresh
- Offline cache (loads instantly from local storage; syncs afterward)
- Optimistic updates (add / toggle / delete feel instant)
- Light / Dark theme toggle + (optional follow system)
- Swipe to delete (gesture)
- Gradient UI inspired by the web version
- TypeScript strict mode

## Project Structure
```
mobile/
  App.tsx
  app.config.js
  babel.config.js
  tsconfig.json
  src/
    components/
      TodoItem.tsx
    config.ts
    types.ts
  assets/
    icon.png (placeholder)
    splash.png (placeholder)
```

## API Base URL
The app reads `extra.apiBaseUrl` from `app.config.js` (or env variable `API_BASE_URL` when building).
Default: `http://localhost:5000/api`

When running on a physical device, `localhost` refers to the device itself. Replace with your machine's LAN IP (e.g. `http://192.168.1.5:5000/api`). You can set:

```
API_BASE_URL=http://192.168.1.5:5000/api npx expo start
```

Or edit `extra.apiBaseUrl` in `app.config.js` temporarily.

## Getting Started
1. Install dependencies:
```
cd mobile
npm install
```
2. Start backend (root repo):
```
# In another terminal
cd backend
npm install  # if not installed
npm start    # or node server.js
```
3. Start Expo:
```
cd mobile
npm start
```
4. Open on device/emulator using the QR code / prompts.

## Type Checking
```
npm run typecheck
```

## Advanced Features Implemented

### Offline Cache
Reads from `AsyncStorage` key `todos-cache` on startup. Network fetch updates cache.

### Optimistic UI
Creation, toggle, and delete update UI immediately. On server failure a refetch restores consistency.

### Theme
Toggle button in header (☀️ / 🌙). Persists `themeMode` in storage. To follow system, set key manually:
```
await AsyncStorage.setItem('themeFollowSystem', 'true')
```
You could expose this via a settings screen later.

### Swipe To Delete
Swipe left on a todo to reveal Delete action (uses `react-native-gesture-handler`).

## Running on iPhone (Cross-Platform)
1. Install Expo Go from the App Store.
2. Ensure your iPhone and dev machine are on the same Wi‑Fi.
3. Start backend with LAN IP accessible: `PORT=5000 npm start` inside `backend/`.
4. Determine your machine LAN IP (e.g. `ifconfig`, look for something like `192.168.x.x`).
5. Start Expo with API URL env:
```
API_BASE_URL=http://192.168.x.x:5000/api npm start
```
6. Scan the QR code with the Camera app (iOS 11+) and open in Expo Go.
7. Edits to code hot-reload automatically.

If you need custom native modules later, you can prebuild:
```
npx expo prebuild
```
But keep managed workflow for simplicity while possible.

## Future Enhancements (Next Ideas)
- Authentication (JWT) + protected routes
- Pagination / infinite scroll for large lists
- Background sync + conflict resolution
- E2E tests with Detox
- Push notifications for reminders (Expo Notifications)

## Notes
If you see network errors on device, open the API URL in Safari on your phone. If it fails there, your phone cannot reach the server (firewall / IP / port).
