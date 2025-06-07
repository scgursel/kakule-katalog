// src/components/ProductList/ProductList.js
import React from 'react';
import { FlatList, View, StyleSheet, Dimensions } from 'react-native';
import ProductCard from '../ProductCard/ProductCard';
import { theme } from '../../constants/theme';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - theme.spacing.md * 3) / 2; // 2 kolon için

export default function ProductList({ 
  products = [], 
  onProductPress, 
  showRelevanceScore = false,
  numColumns = 2,
  horizontal = false 
}) {
  const renderProduct = ({ item, index }) => (
    <ProductCard
      product={item}
      onPress={() => onProductPress(item)}
      showRelevanceScore={showRelevanceScore}
      style={numColumns === 2 ? styles.gridItem : styles.listItem}
      width={numColumns === 2 ? ITEM_WIDTH : undefined}
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      {/* Bu boş liste durumu SearchScreen'de handle ediliyor */}
    </View>
  );

  return (
    <FlatList
      data={products}
      renderItem={renderProduct}
      keyExtractor={(item) => item.id}
      numColumns={horizontal ? 1 : numColumns}
      horizontal={horizontal}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.container,
        horizontal && styles.horizontalContainer
      ]}
      columnWrapperStyle={numColumns === 2 && !horizontal ? styles.row : null}
      ListEmptyComponent={renderEmpty}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.md,
  },
  horizontalContainer: {
    paddingVertical: theme.spacing.md,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  gridItem: {
    marginBottom: theme.spacing.md,
  },
  listItem: {
    marginBottom: theme.spacing.md,
  },
  separator: {
    height: theme.spacing.sm,
  },
  emptyContainer: {
    height: 100, // SearchScreen'de kendi empty state'i var
  },
});