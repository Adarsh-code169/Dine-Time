# 🍽️ Dine-Time

Dine-Time is a modern React Native + Expo app for browsing restaurants, building an order, and tracking it from kitchen to door. It now ships with a real Firebase backend (Auth + Firestore), persistent local state, and a fully-fleshed-out order flow.

## ✨ Features

### Auth & onboarding
- 3-page onboarding carousel for first-time users.
- Email + password **sign up / sign in** backed by **Firebase Authentication**.
- **Forgot Password** flow that sends a real reset email.
- "Continue as Guest" mode for browsing without an account.

### Discovery
- Greeting + search bar with live filtering across name, category, and dish names.
- Horizontal category filter strip with active state.
- "Trending Now" horizontal carousel of top-rated restaurants.
- Promo banner, pull-to-refresh, polished restaurant cards with gradient overlays, rating + delivery chips.

### Restaurant & menu
- Hero image with gradient overlay, info row (rating / time / delivery / item count), and description.
- Menu filters (All / Popular / Mains / Sides) and reusable `MenuItem` cards.
- Floating "View Cart" pill appears as soon as you add an item.
- Toast on every add-to-cart action.

### Cart & checkout
- Cart **persisted via AsyncStorage** — survives app reloads.
- Per-line quantity controls, remove, clear-all with confirmation.
- Subtotal + 8% tax + delivery fee summary.
- Full **Checkout screen**: address picker (with inline add-new), payment method (COD / Card / Wallet), order summary, total.

### Orders
- Orders are written to **Firestore** under `orders/{id}` when signed in (falls back to local storage in guest/demo mode).
- Real-time subscription updates the History tab.
- **Order Tracking screen** with animated status hero, 4-step progress stepper (Placed → Preparing → On the way → Delivered), full order summary, and delivery address.
- Status auto-progresses for demo purposes so you can see the tracker animate end-to-end.

### Profile
- Stats row: orders / favorites / addresses.
- **Edit Profile** screen (display name, phone, bio) — synced to Firestore.
- **Saved Addresses** screen with add/remove and Home/Work/Other labels.
- Favorites tab is persisted across sessions.
- Logout confirmation + clear-cart on sign out.

### Look & feel
- Centralized theme constants (colors, radii, shadows, gradients).
- Linear gradients on primary CTAs, hero images, promo banner, and tracking screens.
- Toast notifications (`react-native-toast-message`) for success, error, info.
- Cart badge on the tab bar, pulsing avatar status icon on tracking, refined empty states throughout.

## 🛠️ Tech Stack

- **Framework**: React Native + Expo (SDK 54)
- **Routing**: Expo Router v6 (file-based)
- **Styling**: NativeWind + custom theme constants
- **State**: Zustand with `persist` middleware → AsyncStorage
- **Backend**: Firebase (Auth + Firestore)
- **UX extras**: expo-linear-gradient, react-native-toast-message, @expo/vector-icons

## 🚀 Getting Started

### 1. Install
```bash
npm install
```

### 2. Configure Firebase (optional but recommended)

The app ships in **Demo Mode** out of the box — it runs end-to-end without any Firebase setup using only on-device storage. To enable real auth + cloud sync, edit `app/config/firebase.js`:

```js
const firebaseConfig = {
    apiKey: '...',
    authDomain: '...',
    projectId: '...',
    storageBucket: '...',
    messagingSenderId: '...',
    appId: '...',
};
```

You can get these values from Firebase Console → ⚙️ Project Settings → "Your apps" → Web app. Enable **Email/Password** under Authentication → Sign-in method, and create a Firestore database in production or test mode.

If `apiKey === 'YOUR_API_KEY'` the app auto-detects Demo Mode and won't try to talk to Firebase.

### 3. Run
```bash
npm start
```
Then press `i` (iOS sim), `a` (Android emulator), or scan the QR code with Expo Go.

## 📂 Project layout

```
app/
├── _layout.jsx              Root stack + auth gating + toast provider
├── index.jsx                Landing screen (auto-routes to onboarding / tabs)
├── onboarding.jsx           3-page intro carousel
├── login.jsx                Sign in with validation + loading states
├── signup.jsx               Account creation
├── forgot-password.jsx      Password reset
├── checkout.jsx             Full checkout flow (address + payment + summary)
├── order-tracking.jsx       Animated order status + stepper
├── edit-profile.jsx         Update display name / phone / bio
├── addresses.jsx            Add / remove delivery addresses
├── (tabs)/
│   ├── _layout.jsx          Bottom tab nav with live cart badge
│   ├── home/                Discovery (index + restaurant-details)
│   ├── history.jsx          Real orders from Firestore + status pills
│   ├── cart.jsx             Persisted cart with summary
│   ├── favorites.jsx        Saved restaurants
│   └── profile.jsx          Stats + menu + logout
├── components/              RestaurantCard, MenuItem
├── store/                   authStore, cartStore, favoritesStore, ordersStore
├── config/firebase.js       Firebase init with Demo Mode fallback
├── constants/theme.js       Colors, gradients, shadows, order status enums
└── data/dummyData.js        Restaurant + menu seed data
```

## 🧪 What's persisted

| Data            | Storage                                   |
|-----------------|-------------------------------------------|
| Cart            | AsyncStorage (`dinetime-cart`)            |
| Favorites       | AsyncStorage (`dinetime-favorites`)       |
| Orders (local)  | AsyncStorage (`dinetime-orders`)          |
| Orders (cloud)  | Firestore `orders/{orderId}`              |
| User profile    | Firestore `users/{uid}`                   |
| Demo user       | AsyncStorage (`@dinetime/demo_user`)      |
| Onboarding flag | AsyncStorage (`@dinetime/onboarded`)      |

## 📄 License
MIT
