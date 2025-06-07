// src/screens/CategoryScreen/CategoryScreen.js - Basit versiyon
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
    // Basit arama - sadece tag'larda ara
    if (searchQuery) {
      const filtered = products.filter(product => {
        if (!product.tags || !Array.isArray(product.tags)) return false;
        
        return product.tags.some(tag => 
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchQuery, products]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      console.log('🔍 Loading products for category:', category.id);

      const categoryProducts = await productService.getProductsByCategory(category.id);
      console.log('✅ Loaded products:', categoryProducts.length, categoryProducts);
      
      setProducts(categoryProducts);
      setFilteredProducts(categoryProducts);
    } catch (error) {
      console.error('❌ Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductPress = (product) => {
    console.log('📱 Product pressed:', product.id);
    // navigation.navigate('ProductDetail', { product });
  };

  const handleTagPress = (tag) => {
    console.log('🏷️ Tag pressed:', tag);
    setSearchQuery(tag);
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
        </View>
      </View>

      <Card.Content style={styles.productContent}>
        <Text variant="titleMedium" style={styles.productName} numberOfLines={2}>
          {item.name}
        </Text>

        {item.productCode && (
          <Text variant="bodySmall" style={styles.productCode}>
            Kod: {item.productCode}
          </Text>
        )}

        <Text variant="bodySmall" style={styles.productDescription} numberOfLines={2}>
          {item.shortDescription || item.description}
        </Text>

        {/* Specs - Kompakt chip'ler */}
        <View style={styles.specsContainer}>
          {item.specs?.width && (
            <Chip 
              mode="outlined" 
              compact 
              style={styles.specChip} 
              textStyle={styles.specText}
              contentStyle={styles.specContent}
            >
              {item.specs.width}
            </Chip>
          )}
          {item.specs?.color && (
            <Chip 
              mode="outlined" 
              compact 
              style={styles.specChip} 
              textStyle={styles.specText}
              contentStyle={styles.specContent}
            >
              {item.specs.color}
            </Chip>
          )}
        </View>

        {/* Tags - Ultra kompakt */}
        {item.tags && Array.isArray(item.tags) && item.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            <Text variant="bodySmall" style={styles.tagsLabel}>
              Etiketler:
            </Text>
            <View style={styles.tagsRow}>
              {item.tags.slice(0, 4).map((tag, index) => (
                <Chip
                  key={index}
                  mode="outlined"
                  compact
                  style={styles.tagChip}
                  textStyle={styles.tagText}
                  contentStyle={styles.tagContent}
                  onPress={() => handleTagPress(tag)}
                >
                  {tag}
                </Chip>
              ))}
              {item.tags.length > 4 && (
                <Text style={styles.moreTagsText}>+{item.tags.length - 4}</Text>
              )}
            </View>
          </View>
        )}
      </Card.Content>

      <Card.Actions>
        <Button
          mode="outlined"
          onPress={() => handleProductPress(item)}
          style={styles.detailButton}
        >
          Detay
        </Button>
        <Button
          mode="contained"
          onPress={() => {
            console.log('📞 Teklif istendi:', item.name);
          }}
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

      {/* Basit Arama */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Etiketlerde ara... (örn: 20mm, ceviz, altin)"
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
              {searchQuery ? 'Sonuç Bulunamadı' : 'Ürün Bulunamadı'}
            </Text>
            <Text variant="bodyMedium" style={styles.emptyDescription}>
              {searchQuery 
                ? `"${searchQuery}" için eşleşen ürün bulunamadı`
                : 'Bu kategoride henüz ürün bulunmuyor'
              }
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
  productContent: {
    padding: theme.spacing.md,
  },
  productName: {
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: theme.spacing.xs,
  },
  productCode: {
    color: theme.colors.primary,
    fontWeight: '500',
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
    height: 28, // Yükseklik artırıldı
    backgroundColor: theme.colors.secondaryContainer,
    paddingHorizontal: 6,
    marginHorizontal: 2,
  },
  specText: {
    fontSize: 10, // Yazı biraz büyütüldü
    lineHeight: 14,
  },
  specContent: {
    paddingHorizontal: 4,
    paddingVertical: 2, // Dikey padding eklendi
    marginHorizontal: 0,
    marginVertical: 0,
  },
  tagsContainer: {
    marginBottom: theme.spacing.sm,
  },
  tagsLabel: {
    color: theme.colors.onSurface,
    fontWeight: '500',
    marginBottom: theme.spacing.xs,
    fontSize: 11,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 3,
    alignItems: 'center',
  },
  tagChip: {
    height: 28, // Yükseklik artırıldı
    backgroundColor: theme.colors.primaryContainer,
    paddingHorizontal: 4,
    marginVertical: 1,
    marginHorizontal: 1,
    minWidth: 30,
  },
  tagText: {
    fontSize: 9, // Yazı biraz büyütüldü
    color: theme.colors.primary,
    fontWeight: '500',
    lineHeight: 12,
  },
  tagContent: {
    paddingHorizontal: 2,
    paddingVertical: 2, // Dikey padding eklendi
    marginHorizontal: 0,
    marginVertical: 0,
  },
  moreTagsText: {
    fontSize: 9,
    color: theme.colors.primary,
    fontWeight: '500',
    marginLeft: 2,
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