// src/constants/theme.js
import { DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2E7D32',        // Yeşil (doğa, çerçeve)
    accent: '#8D6E63',         // Kahverengi (ahşap)
    background: '#FAFAFA',     // Açık gri
    surface: '#FFFFFF',        // Beyaz
    text: '#212121',          // Koyu gri
    onSurface: '#212121',
    onBackground: '#212121',
    primaryContainer: '#E8F5E8',
    error: '#F44336',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
};