# 🍽️ Dine-Time

A modern React Native food delivery application built with Expo, featuring restaurant browsing, cart management, favorites, and order history.

## ✨ Features

- 🏪 **Restaurant Browsing**: Browse through various restaurants with beautiful card layouts
- 🔍 **Search & Filter**: Search for restaurants and filter by cuisine type
- ❤️ **Favorites**: Save your favorite restaurants for quick access
- 🛒 **Shopping Cart**: Add items to cart with quantity management
- 📝 **Order History**: View your past orders
- 👤 **User Profile**: Manage your account and preferences
- 🔐 **Authentication**: Login and signup functionality
- 📱 **Bottom Tab Navigation**: Easy navigation between different sections

## 🛠️ Tech Stack

- **Framework**: [Expo](https://expo.dev) ~54.0.23
- **UI Library**: React Native 0.81.5
- **Navigation**: React Navigation (Bottom Tabs, Native Stack)
- **Styling**: NativeWind (TailwindCSS for React Native)
- **State Management**: Zustand
- **Icons**: Expo Vector Icons
- **Animations**: React Native Reanimated
- **Gestures**: React Native Gesture Handler

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Expo Go](https://expo.dev/go) app on your mobile device (for testing)

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Development Server

```bash
npx expo start
```

### 3. Run the App

After starting the development server, you'll see options to run the app on:

- **Android Emulator**: Press `a`
- **iOS Simulator**: Press `i` (macOS only)
- **Expo Go**: Scan the QR code with your Expo Go app
- **Web Browser**: Press `w`

## 📁 Project Structure

```
Dine-Time/
├── app/                        # Main application directory
│   ├── (tabs)/                # Tab-based navigation screens
│   │   ├── home/              # Home screen with restaurant listings
│   │   ├── cart.jsx           # Shopping cart screen
│   │   ├── favorites.jsx      # Favorite restaurants screen
│   │   ├── history.jsx        # Order history screen
│   │   └── profile.jsx        # User profile screen
│   ├── components/            # Reusable components
│   │   ├── RestaurantCard.jsx # Restaurant card component
│   │   └── MenuItem.jsx       # Menu item component
│   ├── store/                 # Zustand state management
│   │   ├── favoritesStore.js  # Favorites state
│   │   └── cartStore.js       # Cart state
│   ├── data/                  # Mock data
│   ├── login.jsx              # Login screen
│   ├── signup.jsx             # Signup screen
│   └── _layout.jsx            # Root layout
├── assets/                    # Images and static files
├── app.json                   # Expo configuration
├── package.json               # Dependencies
└── tailwind.config.js         # TailwindCSS configuration
```

## 🎯 Key Features Explained

### Restaurant Cards
Each restaurant card displays:
- Restaurant image with favorite toggle
- Restaurant name and category
- Rating badge
- Delivery time
- Delivery fee

### Favorites System
- Toggle favorites with heart icon
- Managed using Zustand state
- Persists across navigation

### Shopping Cart
- Add/remove items
- Update quantities
- View total price
- Checkout functionality

### Navigation
- Bottom tab navigation for main sections
- Stack navigation for detail screens
- Smooth transitions and animations

## 🎨 Styling

This project uses **NativeWind**, which brings TailwindCSS to React Native. You can use familiar TailwindCSS classes for styling components.

## 📱 Screens

1. **Home**: Browse restaurants and menu items
2. **Cart**: View and manage cart items
3. **Favorites**: Quick access to favorite restaurants
4. **History**: View past orders
5. **Profile**: Manage user settings
6. **Login/Signup**: Authentication screens

## 🔧 Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Open app on Android
- `npm run ios` - Open app on iOS
- `npm run web` - Open app in web browser
- `npm run lint` - Run ESLint

## 🐛 Troubleshooting

### Metro Bundler Issues
```bash
# Clear cache and restart
npx expo start -c
```

### Module Resolution Errors
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

## 📚 Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [NativeWind](https://www.nativewind.dev/)
- [Zustand](https://zustand-demo.pmnd.rs/)

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- Built with [Expo](https://expo.dev)
- Styled with [NativeWind](https://www.nativewind.dev/)
- Icons by [Expo Vector Icons](https://icons.expo.fyi/)

---

**Happy Coding! 🚀**
