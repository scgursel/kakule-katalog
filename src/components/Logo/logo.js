// src/components/Logo/Logo.js
import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { responsiveValue, fontSize } from '../../utils/responsive';

export default function Logo({ 
  size = 'medium', 
  showText = true, 
  style,
  textStyle 
}) {
  const sizes = {
    small: responsiveValue(60, 80, 100),
    medium: responsiveValue(100, 120, 140),
    large: responsiveValue(140, 160, 180),
  };

  const logoSize = sizes[size] || sizes.medium;

  return (
    <View style={[styles.container, style]}>
      <Image
        source={require('../../../assets/logo.png')} // Logo dosyanızı assets klasörüne koyun
        style={[
          styles.logo,
          {
            width: logoSize,
            height: logoSize,
          }
        ]}
        resizeMode="contain"
      />
      {showText && (
        <View style={styles.textContainer}>
          <Text 
            variant="headlineMedium" 
            style={[styles.brandText, textStyle]}
          >
            KAKULE
          </Text>
          <Text 
            variant="bodyMedium" 
            style={[styles.tagline, textStyle]}
          >
            Sanatsal Resim Çerçeveleri
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  logo: {
    marginBottom: 8,
  },
  textContainer: {
    alignItems: 'center',
  },
  brandText: {
    fontWeight: 'bold',
    color: '#FF6B35',
    fontSize: fontSize.xxl,
    letterSpacing: 1,
  },
  tagline: {
    color: '#757575',
    fontSize: fontSize.sm,
    marginTop: 4,
  },
});