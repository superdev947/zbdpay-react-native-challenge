# 🧪 Senior React Native Coding Challenge

## Crypto Chart Viewer + Price Alerts

### 🔍 Overview

Build a **Crypto Chart Viewer app** using **React Native with Expo** that:

- Displays interactive price charts for **10 cryptocurrencies**
- Allows users to navigate via a **drawer**
- Enables users to set **price alerts** per crypto
- Shows a notification indicator when an alert is triggered
- Lets users review and clear triggered alerts

---

## 🎯 Objectives

### 🧭 Navigation

- Implement **drawer navigation**
- The drawer should be a list of **10 cryptocurrencies** by market cap
- Selecting a currency opens a **detail screen** for that cryptocurrency

---

### 📈 Crypto Detail Screen

- Show a **price chart** (e.g., last 24h or 7d)
- Display the **current price**
- Allow users to **set a price alert** (e.g., "Notify me if the price goes above $70,000")
- If an alert is already active, display it with an option to cancel or update

---

### 🚨 Alerts System

- Display a **notification icon** in the top-right of the app
  - Show a badge or indicator when **any alert is triggered**
- Tapping the icon opens an **Alerts screen**
  - List all **triggered alerts** with timestamps UTC
- When alerts are displayed in the log, they are **cleared** and not shown again

---

## 🧩 Technical Requirements

- Use **React Native with Expo**
- Style the app using **NativeWind**
  - How you style is up to you
- Implement real-time or frequently updated price tracking
- Handle state management for:
  - The list of cryptocurrencies and prices
  - Price alerts per crypto
  - Notification badge state
  - Triggered alert log
- Use **TypeScript** and clean, modular code
- The app should work smoothly on both **iOS and Android**

---

## ✅ What We’re Looking For

- Scalable app structure and clean state architecture
- Good UX around charts, alert creation, and notifications
- Clear handling of edge cases (e.g., API failures, invalid inputs, rapid price changes)
- Maintainable TypeScript usage and reusable components

---

## 💡 Bonus (Optional)

- Animations on the chart render
- Persist alert state across app restarts
- Send **push notifications** when a price alert is triggered
- Implement **deep linking** so that tapping a push notification opens the **Alerts screen** directly

---

## 📝 Submission Instructions

- Include an `OVERVIEW.md` with:
  - A short overview of your approach
  - Instructions for running the app
  - Any limitations, trade-offs, or assumptions made
- Fork this REPO and push your code
- Create an apk build and share a link to download it in the README.
