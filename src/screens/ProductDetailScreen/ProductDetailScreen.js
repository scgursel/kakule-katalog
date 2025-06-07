import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

export default function ProductDetailScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text variant="headlineSmall">Ürün Detayı</Text>
    </View>
  );
}