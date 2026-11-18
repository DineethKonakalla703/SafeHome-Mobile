# SafeHome-Mobile

[![Expo](https://img.shields.io/badge/Expo-SDK%2058-black.svg)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React%20Native-0.88-61dafb.svg)](https://reactnative.dev/)
[![Expo Router](https://img.shields.io/badge/Expo%20Router-v58-blue.svg)](https://docs.expo.dev/router/introduction/)
[![License](https://img.shields.io/badge/License-Proprietary-blue.svg)](https://github.com/DineethKonakalla703/SafeHome-Mobile)

**SafeHome-Mobile** is the cross-platform mobile application for residents and field staff in the SafeHome Residential Facility ecosystem. Built using **Expo SDK 58**, **React Native 0.88**, and **Expo Router**, it delivers an intuitive, on-the-go experience for managing maintenance tickets, emergency alerts, digital gate passes, notices, billing, and AI Copilot interactions.

---

## 1. Key Features

- **Resident Home & Quick Actions:** At-a-glance dashboard showing outstanding maintenance dues, active ticket progress, quick SOS emergency contact, and upcoming estate events.
- **Maintenance Requests:** Submit tickets with photos, track step-by-step progress, view assigned technicians, and add comments.
- **Digital Gate Access:** Authorize visitors, view delivery parcels, generate guest gate passes, and track entry/exit events.
- **AI Resident Copilot:** Interactive mobile assistant powered by the SafeHome RAG/GraphRAG backend for answering society bylaws and maintenance inquiries.
- **Community Life:** Estate notice board, resident community forum, staff directory, and society voting polls.
- **Secure Credential Storage:** Tokens stored encrypted on-device via `expo-secure-store`.
- **Dynamic API Resolution:** Automatically resolves the backend server's IP address when running with Expo Go over local Wi-Fi, with configurable fallback via `EXPO_PUBLIC_API_URL`.

---

## 2. Technology Stack

- **Framework:** Expo SDK 58 / React Native 0.88
- **Navigation:** Expo Router (File-based routing with tab bar layouts)
- **Typography & UI:** Fraunces & Manrope fonts (`@expo-google-fonts`), Expo Vector Icons
- **Security:** Expo SecureStore (`expo-secure-store`)
- **Sensors & Haptics:** Expo Haptics (`expo-haptics`), Expo Speech (`expo-speech`)
- **Styling:** React Native StyleSheet with custom estate theme tokens (`theme.js`)

---

## 3. Directory Structure

```text
SafeHome-Mobile/
├── assets/                       # App icons, splash screens, logos
│   ├── adaptive-icon.png         # Android adaptive icon
│   ├── icon.png                  # iOS app icon
│   └── splash-icon.png           # Splash screen branding
├── src/
│   ├── app/                      # Expo Router screen tree
│   │   ├── (tabs)/               # Bottom tab navigation
│   │   │   ├── _layout.js        # Tab bar configuration & icons
│   │   │   ├── home.js           # Resident dashboard
│   │   │   ├── requests.js       # Active & resolved tickets
│   │   │   ├── gate.js           # Visitor & delivery pass management
│   │   │   ├── copilot.js        # AI conversational assistant
│   │   │   └── more.js           # Settings, bills, community tools
│   │   ├── tickets/              # Ticket workflows
│   │   │   ├── new.js            # Complaint submission form
│   │   │   └── [id].js           # Ticket case details & timeline
│   │   ├── _layout.js            # Root layout with auth state provider
│   │   ├── index.js              # Entry redirect (auth check)
│   │   ├── login.js              # Credential login view
│   │   ├── sos.js                # Emergency contacts & alert trigger
│   │   ├── bills.js              # Outstanding fee payments
│   │   ├── notices.js            # Society broadcasts
│   │   ├── parcels.js            # Package delivery tracking
│   │   ├── residents.js          # Resident directory
│   │   └── staff.js              # Maintenance & security roster
│   ├── components/               # Reusable mobile UI components
│   │   ├── Card.js               # Styled container card
│   │   ├── Header.js             # Navigation header
│   │   └── Button.js             # Accessible primary button
│   ├── lib/                      # Core mobile utilities & network
│   │   ├── api.js                # Fetch client with dynamic IP resolution
│   │   ├── auth.js               # SecureStore session token management
│   │   └── agent.js              # Copilot streaming & turn handler
│   └── theme.js                  # Color palette, spacing, and font constants
├── .env.example                  # Environment configuration template
├── .gitignore                    # Git tracking rules
├── app.json                      # Expo application manifest
├── eslint.config.js              # Linter rules
├── LICENSE                       # License file
├── package.json                  # Dependencies & scripts
└── README.md                     # Documentation
```

---

## 4. Installation & Setup

### Prerequisites
- Node.js >= 18.x installed
- Mobile Device with **Expo Go** installed (iOS App Store or Android Google Play)
- SafeHome-Backend running on your computer (on port 5000)

### Installation
```bash
# Clone the repository
git clone https://github.com/DineethKonakalla703/SafeHome-Mobile.git
cd SafeHome-Mobile

# Install dependencies
npm install
```

### Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Configure your computer's local network IP:
```env
# Point to your development computer's local IP on Wi-Fi
EXPO_PUBLIC_API_URL=http://192.168.1.100:5000/api
```
*(If running on web or Android emulator, `http://localhost:5000/api` or `http://10.0.2.2:5000/api` can also be used).*

---

## 5. Running the Application

### Option A: Physical Phone via Expo Go (Recommended)
1. Ensure your phone and development computer are connected to the **same Wi-Fi network**.
2. Run the start command:
   ```bash
   npx expo start
   ```
3. Scan the generated QR code in your terminal:
   - **Android:** Scan using the Expo Go app.
   - **iOS:** Scan using the default Camera app and tap the Expo prompt.

### Option B: Web Browser
```bash
npx expo start --web
```

### Option C: Android / iOS Simulators
```bash
# Android Emulator
npm run android

# iOS Simulator (macOS only)
npm run ios
```

---

## 6. Default Demo Credentials

Log in using seeded demo credentials:
- **Resident:** `resident1@safehome.com` / `Demo@123`
- **Technician:** `technician1@safehome.com` / `Demo@123`

---

## 7. License

Proprietary / Academic Capstone Project · Developed by Dineeth Konakalla.
