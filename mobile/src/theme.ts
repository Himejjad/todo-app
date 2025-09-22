import { Appearance } from 'react-native';

export type ThemeMode = 'light' | 'dark';

export const systemColorScheme = (): ThemeMode => (Appearance.getColorScheme() === 'dark' ? 'dark' : 'light');

export const palette = {
  light: {
    gradient: ['#667eea', '#764ba2'],
    textPrimary: '#1f2937',
    textInverse: '#ffffff',
    card: '#ffffff',
    cardAlt: '#f9fafb',
    border: '#e5e7eb',
    success: '#10b981',
    dangerBg: '#fee2e2',
    dangerText: '#dc2626',
    subtle: 'rgba(255,255,255,0.85)',
  },
  dark: {
    gradient: ['#0f172a', '#312e81'],
    textPrimary: '#f1f5f9',
    textInverse: '#ffffff',
    card: '#1e293b',
    cardAlt: '#334155',
    border: '#475569',
    success: '#10b981',
    dangerBg: '#7f1d1d',
    dangerText: '#fecaca',
    subtle: 'rgba(255,255,255,0.7)',
  },
};

export const getTheme = (mode: ThemeMode) => palette[mode];
