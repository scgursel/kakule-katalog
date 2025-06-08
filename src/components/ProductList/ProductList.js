// src/components/ProductList/ProductList.js
import React from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import ProductCard from '../ProductCard/ProductCard';
import { theme } from '../../constants/theme';
import { 
  getColumns, 
  getCardWidth, 
  spacing,
  isTablet,
  responsiveValue
} from '../../utils/responsive';

export default function ProductList({ 
  products = [], 
  onProductPress, 
  showRelevanceScore = false,
  numColumns = null,
  horizontal = false,
  compact = false 
}) {
  // Otomatik kolon sayısı hesapla
  const columns = numColumns || getColumns();
  const containerPadding = spacing.md;
  
  // Kart genişliği hesapla
  const cardWidth = horizontal 
    ? responsiveValue(150, 180, 200) 
    : getCardWidth(columns, containerPadding);

  const renderProduct = ({ item, index }) => (
    <ProductCard
      product={item}
      onPress={() => onProductPress(item)}
      showRelevanceScore={showRelevanceScore}
      style={columns > 1 ? styles.gridItem : styles.listItem}
      width={columns > 1 ? cardWidth : undefined}
      compact={compact || columns > 2}
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      {/* Bu boş liste durumu ekranlarda handle ediliyor */}
    </View>
  );

  const ItemSeparatorComponent = () => (
    <View style={{ height: spacing.sm, width: spacing.sm }} />
  );

  const getItemLayout = (data, index) => ({
    length: cardWidth + spacing.sm,
    offset: (cardWidth + spacing.sm) * index,
    index,
  });

  return (
    <FlatList
      data={products}
      renderItem={renderProduct}
      keyExtractor={(item) => item.id}
      numColumns={horizontal ? 1 : columns}
      horizontal={horizontal}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.container,
        horizontal && styles.horizontalContainer,
        products.length === 0 && styles.emptyContentContainer
      ]}
      columnWrapperStyle={columns > 1 && !horizontal ? styles.row : null}
      ListEmptyComponent={renderEmpty}
      ItemSeparatorComponent={ItemSeparatorComponent}
      getItemLayout={horizontal ? getItemLayout : undefined}
      // Performans optimizasyonları
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      initialNumToRender={10}
      windowSize={10}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  horizontalContainer: {
    paddingVertical: spacing.sm,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  gridItem: {
    marginBottom: spacing.sm,
  },
  listItem: {
    marginBottom: spacing.md,
  },
  emptyContainer: {
    minHeight: 100,
  },
  emptyContentContainer: {
    flexGrow: 1,
  },
});