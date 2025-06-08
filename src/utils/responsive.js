// src/utils/responsive.js
import { Dimensions, Platform, StatusBar } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Cihaz boyutları
export const dimensions = {
  screenWidth,
  screenHeight,
  // Status bar hariç kullanılabilir yükseklik
  windowHeight: screenHeight - (Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0),
};

// Cihaz tipleri
export const isTablet = () => {
  const aspectRatio = screenHeight / screenWidth;
  return (screenWidth >= 768 || (aspectRatio < 1.6 && screenWidth >= 468));
};

export const isSmallDevice = () => screenWidth < 375;
export const isMediumDevice = () => screenWidth >= 375 && screenWidth < 768;
export const isLargeDevice = () => screenWidth >= 768;

// Responsive değerler
export const responsiveValue = (phone, tablet = null, desktop = null) => {
  if (isTablet() && desktop !== null && screenWidth >= 1024) return desktop;
  if (isTablet() && tablet !== null) return tablet;
  return phone;
};

// Responsive font boyutları
export const fontSize = {
  xs: responsiveValue(10, 12, 14),
  sm: responsiveValue(12, 14, 16),
  md: responsiveValue(14, 16, 18),
  lg: responsiveValue(16, 18, 20),
  xl: responsiveValue(18, 20, 24),
  xxl: responsiveValue(20, 24, 28),
  xxxl: responsiveValue(24, 28, 32),
};

// Responsive spacing
export const spacing = {
  xs: responsiveValue(4, 6, 8),
  sm: responsiveValue(8, 10, 12),
  md: responsiveValue(16, 20, 24),
  lg: responsiveValue(24, 28, 32),
  xl: responsiveValue(32, 40, 48),
  xxl: responsiveValue(48, 56, 64),
};

// Grid sistem için kolon sayıları
export const getColumns = () => {
  if (screenWidth >= 1024) return 4;
  if (screenWidth >= 768) return 3;
  if (screenWidth >= 480) return 2;
  return 2;
};

// Responsive margin/padding
export const getPadding = (size = 'md') => ({
  paddingHorizontal: spacing[size],
  paddingVertical: spacing[size] * 0.75,
});

export const getMargin = (size = 'md') => ({
  marginHorizontal: spacing[size],
  marginVertical: spacing[size] * 0.75,
});

// Kart genişliği hesaplama
export const getCardWidth = (columns = 2, containerPadding = spacing.md) => {
  const totalPadding = containerPadding * 2;
  const gutterWidth = spacing.sm * (columns - 1);
  return (screenWidth - totalPadding - gutterWidth) / columns;
};

// Safe area padding
export const getSafeAreaPadding = () => ({
  paddingTop: Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0,
  paddingBottom: Platform.OS === 'ios' ? 34 : 0,
});

// Responsive image dimensions
export const getImageDimensions = (aspectRatio = 1) => {
  const width = screenWidth - (spacing.md * 2);
  return {
    width,
    height: width / aspectRatio,
  };
};

// Orientation helpers
export const isPortrait = () => screenHeight > screenWidth;
export const isLandscape = () => screenWidth > screenHeight;

// Platform specific
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

// Responsive shadow
export const getShadow = (elevation = 4) => ({
  ...Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: elevation / 2,
      },
      shadowOpacity: 0.1 + (elevation * 0.025),
      shadowRadius: elevation,
    },
    android: {
      elevation,
    },
  }),
});