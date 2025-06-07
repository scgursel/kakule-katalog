


// src/screens/CategoryScreen/CategoryScreen.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card, Chip, Button, ActivityIndicator, Searchbar } from 'react-native-paper';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import productService from '../../services/productService';


export default function CategoryScreen({ route, navigation }) {
  const { category } = route.params;
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');



  useEffect(() => {
    loadProducts();
  }, [category]);

  useEffect(() => {
    // Arama filtresi
    if (searchQuery) {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchQuery, products]);

  const loadProducts = async () => {
    try {
      setLoading(true);

      const categoryProducts = await productService.getProductsByCategory(category.id);
      setProducts(categoryProducts);
      setFilteredProducts(categoryProducts);
      setLoading(false);

    } catch (error) {
      console.error('Ürünler yüklenirken hata:', error);
      setLoading(false);
    }
  };

  const renderProduct = ({ item }) => (
    <Card style={styles.productCard}>
      <View style={styles.imageContainer}>
        {item.images?.[0] ? (
          <Image
            source={{ uri: item.images[0].thumbnail || item.images[0].url }}
            style={styles.productImage}
            contentFit="cover"
            transition={200}
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Ionicons name="image-outline" size={40} color={theme.colors.disabled} />
          </View>
        )}

        {/* Badges */}
        <View style={styles.badgeContainer}>
          {item.featured && (
            <Chip style={styles.featuredBadge} compact>⭐ Öne Çıkan</Chip>
          )}
          {!item.availability && (
            <Chip style={styles.unavailableBadge} compact>Stokta Yok</Chip>
          )}
        </View>
      </View>

      <Card.Content style={styles.productContent}>
        <Text variant="titleMedium" style={styles.productName} numberOfLines={2}>
          {item.name}
        </Text>

        <Text variant="bodySmall" style={styles.productDescription} numberOfLines={2}>
          {item.shortDescription}
        </Text>

        {/* Specs */}
        <View style={styles.specsContainer}>
          <Chip mode="outlined" compact style={styles.specChip}>
            {item.specs?.material}
          </Chip>
          <Chip mode="outlined" compact style={styles.specChip}>
            {item.specs?.color}
          </Chip>
          <Chip mode="outlined" compact style={styles.specChip}>
            {item.specs?.dimensions}
          </Chip>
        </View>

        {/* Price */}
        <Text variant="titleLarge" style={styles.price}>
          {item.price}
        </Text>

        {/* Tags */}
        <View style={styles.tagsContainer}>
          {item.tags.slice(0, 3).map((tag, index) => (
            <Chip
              key={index}
              mode="outlined"
              compact
              style={styles.tagChip}
              textStyle={styles.tagText}
            >
              {tag}
            </Chip>
          ))}
          {item.tags.length > 3 && (
            <Text style={styles.moreTagsText}>+{item.tags.length - 3}</Text>
          )}
        </View>
      </Card.Content>

      <Card.Actions>
        <Button
          mode="outlined"
          onPress={() => {/* Detay sayfasına git */ }}
          style={styles.detailButton}
        >
          Detay
        </Button>
        <Button
          mode="contained"
          onPress={() => {/* Teklif Al */ }}
          style={styles.quoteButton}
        >
          Teklif Al
        </Button>
      </Card.Actions>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Ürünler yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.categoryTitle}>
          {category.name}
        </Text>
        <Text variant="bodyMedium" style={styles.categoryDescription}>
          {category.description}
        </Text>
        <Text variant="bodySmall" style={styles.productCount}>
          {filteredProducts.length} ürün bulundu
        </Text>
      </View>

      {/* Arama */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder={`${category.name} içinde ara...`}
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
      </View>

      {/* Ürün Listesi */}
      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        numColumns={1}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.productList}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Ionicons name="search" size={64} color={theme.colors.disabled} />
            <Text variant="headlineSmall" style={styles.emptyTitle}>
              Ürün bulunamadı
            </Text>
            <Text variant="bodyMedium" style={styles.emptyDescription}>
              Bu kategoride henüz ürün bulunmuyor
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: theme.spacing.md,
    color: theme.colors.onBackground,
  },
  header: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    elevation: 2,
  },
  categoryTitle: {
    color: theme.colors.primary,
    fontWeight: 'bold',
    marginBottom: theme.spacing.xs,
  },
  categoryDescription: {
    color: theme.colors.onSurface,
    marginBottom: theme.spacing.sm,
  },
  productCount: {
    color: theme.colors.onSurface,
    opacity: 0.7,
  },
  searchContainer: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
  },
  searchbar: {
    elevation: 2,
  },
  productList: {
    padding: theme.spacing.md,
  },
  productCard: {
    marginBottom: theme.spacing.md,
    elevation: 4,
    borderRadius: 12,
  },
  imageContainer: {
    position: 'relative',
    height: 200,
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  badgeContainer: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    gap: theme.spacing.xs,
  },
  featuredBadge: {
    backgroundColor: '#FFD700',
  },
  unavailableBadge: {
    backgroundColor: theme.colors.error,
  },
  productContent: {
    padding: theme.spacing.md,
  },
  productName: {
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: theme.spacing.xs,
  },
  productDescription: {
    color: theme.colors.onSurface,
    opacity: 0.7,
    marginBottom: theme.spacing.sm,
  },
  specsContainer: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
    flexWrap: 'wrap',
  },
  specChip: {
    height: 24,
  },
  price: {
    color: theme.colors.primary,
    fontWeight: 'bold',
    marginBottom: theme.spacing.sm,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
    alignItems: 'center',
  },
  tagChip: {
    height: 20,
    backgroundColor: theme.colors.primaryContainer,
  },
  tagText: {
    fontSize: 10,
    color: theme.colors.primary,
  },
  moreTagsText: {
    fontSize: 10,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  detailButton: {
    borderColor: theme.colors.primary,
  },
  quoteButton: {
    backgroundColor: theme.colors.primary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
    marginTop: 100,
  },
  emptyTitle: {
    textAlign: 'center',
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    color: theme.colors.onBackground,
  },
  emptyDescription: {
    textAlign: 'center',
    color: theme.colors.onBackground,
    opacity: 0.7,
  },
});