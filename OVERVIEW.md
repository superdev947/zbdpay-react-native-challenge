# Crypto Chart Viewer + Price Alerts (Expo / React Native)

## Approach
This app uses:
- React Navigation Drawer: lists top 10 cryptocurrencies and navigates to each detail screen.
- React Query: polls CoinGecko prices every ~15s and fetches 7-day chart data per coin.
- Zustand + AsyncStorage: stores one active alert per coin and a list of triggered (unread) alerts.
- NativeWind: styles with Tailwind-like classes.
- Victory Native: renders a simple animated area chart.

Alerts are evaluated whenever fresh price data arrives. When an alert triggers, it is removed from active alerts and added to the triggered-unread list. The header bell shows a badge count of unread triggers.

The Alerts screen lists triggered alerts with UTC timestamps. When the Alerts screen is opened, the unread triggers are cleared (so they aren’t shown again).

## Running the app
1. Install dependencies:
   ```bash
   npm install

2. Start Expo:
   ```bash
   npx expo start

3. Run on device/simulator:
    - iOS: press
        ```bash
        i
    - Android: press
        ```bash
        a
    - Or scan QR using Expo Go

## Testing

Run the unit tests using:

```bash
npm test
```

To run a specific test file:

```bash
npm test -- <path-to-test-file>
```

For example:

```bash
npm test -- src/store/__tests__/alertsStore.test.ts
```

## Linting

Run ESLint to check code quality:

```bash
npx eslint .
```

## Limitations / Trade-offs / Assumptions
- Uses CoinGecko public endpoints (no auth). Rate limits may apply; polling is set to 15s to reduce load.
- One active alert per coin (matches typical UX; easier to update/cancel).
- Alerts trigger once and are removed from active list.
- "Real-time" is implemented via polling rather than websockets.

## Optional Enhancements
- Push notifications: can be added using expo-notifications; on trigger, schedule a local notification.
- Deep linking: configure linking to open the Alerts screen when tapping a push notification.
- Background execution: true background price checks are platform-limited; best-effort using periodic foreground polling.


---

## ✅ Spec Checklist (mapped to your requirements)

## 🧭 Navigation
- Drawer navigation: ✅
- Drawer shows 10 cryptos by market cap: ✅ (`TOP_COINS`)
- Selecting opens detail screen: ✅

## 📈 Crypto Detail Screen
- Price chart: ✅ (7d chart)
- Current price: ✅
- Set price alert “above/below”: ✅
- If alert active, show it + cancel/update: ✅

## 🚨 Alerts System
- Notification icon top-right: ✅ (`AlertBell`)
- Badge when any alert triggered: ✅ (count of unread triggers)
- Icon opens Alerts screen: ✅
- List triggered alerts w/ timestamps UTC: ✅
- When displayed, cleared and not shown again: ✅ (clears on screen open)

## 🧩 Technical
- Expo + RN: ✅
- NativeWind: ✅
- Frequently updated tracking: ✅ (15s polling)
- State management: ✅ (Zustand + persist)
- TypeScript modular: ✅
- Unit tests: ✅
- iOS/Android: ✅

---

## 📦 APK Build Notes (what to put in README)
For an actual submission, you’d generate and share the APK via EAS:

```bash
npm i -g eas-cli
eas login
eas build:configure
npm run build:apk
