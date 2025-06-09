// src/screens/CategoryScreen/CategoryScreen.js - ProductList kullanan versiyon
import React, { useState, useEffect } from 'react';

import { View, StyleSheet, Platform} from 'react-native';
import { Text, ActivityIndicator, Searchbar } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import ProductList from '../../components/ProductList/ProductList';
import productService from '../../services/productService';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CategoryScreen({ route, navigation }) {
  const { category } = route.params;
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Başlık için navigationOptions
    navigation.setOptions({
      title: category?.name || 'Kategori',
      headerStyle: {
        backgroundColor: category?.color || theme.colors.primary,
      },
    });
  }, [category]);

  useEffect(() => {
    loadProducts();
  }, [category]);

  useEffect(() => {
    // Türkçe karakter destekli arama
    if (searchQuery) {
      const normalizedQuery = normalizeText(searchQuery);
      const filtered = products.filter(product => {
        if (!product.tags || !Array.isArray(product.tags)) return false;

        return product.tags.some(tag => {
          const normalizedTag = normalizeText(tag);
          return normalizedTag.includes(normalizedQuery);
        });
      });
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchQuery, products]);

  // Türkçe karakter normalizasyonu
  const normalizeText = (text) => {
    if (!text) return '';
    return text
      .toLowerCase()
      .replace(/í̇/g, 'i')  // í̇ -> i
      .replace(/İ/g, 'i')   // İ -> i
      .replace(/i̇/g, 'i')   // i̇ -> i (farklı encoding)
      .replace(/ı/g, 'i')   // ı -> i
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/Ğ/g, 'g')
      .replace(/Ü/g, 'u')
      .replace(/Ş/g, 's')
      .replace(/Ö/g, 'o')
      .replace(/Ç/g, 'c');
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      console.log('🔍 Loading products for category:', category.id);

      const categoryProducts = await productService.getProductsByCategory(category.id);
      console.log('✅ Loaded products:', categoryProducts.length);

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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Ürünler yükleniyor...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>

      <View style={styles.container}>
        {/* Header - Başlık zaten üst barda gösteriliyor, sadece açıklama ve ürün sayısı göster */}
        <View style={styles.header}>
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
            placeholder="Etiketlerde ara... (örn: 20mm, ceviz, inox)"
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchbar}
          />
        </View>

        {/* ProductList Kullan - Tek Kolon */}
        {filteredProducts.length > 0 ? (
          <ProductList
            products={filteredProducts}
            onProductPress={handleProductPress}
            numColumns={1} // Tek kolon - daha detaylı görünüm
          />
        ) : (
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
      </View>
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  // Stiller için:
  header: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    elevation: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,

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
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outline,
  },
  searchbar: {
    elevation: 2,
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