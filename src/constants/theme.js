// src/constants/theme.js
import { DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    // Ana turuncu tonları - Kakule logosu ile uyumlu
    primary: '#FF6B35',          // Ana turuncu
    primaryDark: '#E55100',      // Koyu turuncu
    primaryLight: '#FF8F65',     // Açık turuncu
    accent: '#FF8F00',           // Vurgu turuncu
    
    // Nötr renkler
    background: '#FAFAFA',       // Açık gri arka plan
    surface: '#FFFFFF',          // Beyaz yüzeyler
    text: '#212121',             // Koyu gri metin
    textSecondary: '#757575',    // İkincil metin
    
    // Yardımcı renkler
    primaryContainer: '#FFF3E0', // Çok açık turuncu
    onPrimary: '#FFFFFF',        // Turuncu üzerindeki beyaz
    onSurface: '#212121',
    onBackground: '#212121',
    outline: '#E0E0E0',
    disabled: '#BDBDBD',
    error: '#F44336',
    success: '#4CAF50',
    
    // Özel renkler
    cardBackground: '#FFFFFF',
    headerGradient: ['#FF6B35', '#FF8F65'],
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  // Responsive breakpoints
  breakpoints: {
    phone: 0,
    tablet: 768,
    desktop: 1024,
  },
  // Tipografi
  fonts: {
    ...DefaultTheme.fonts,
    regular: {
      fontFamily: 'System',
      fontWeight: '400',
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '500',
    },
    bold: {
      fontFamily: 'System',
      fontWeight: '700',
    },
  },
};