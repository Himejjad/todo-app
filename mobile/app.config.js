// Expo app configuration
module.exports = ({ config }) => ({
  ...config,
  name: 'Todo App',
  slug: 'todo-app-mobile',
  version: '0.1.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  scheme: 'todoapp',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#667eea'
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#667eea'
    },
    package: 'com.example.todoapp'
  },
  web: {
    bundler: 'metro',
    favicon: './assets/favicon.png'
  },
  extra: {
    apiBaseUrl: process.env.API_BASE_URL || 'http://192.168.1.106:5000/api',
    offlineMode: process.env.OFFLINE_MODE === 'true'
  },
  plugins: []
});
