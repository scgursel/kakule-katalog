// src/screens/SearchScreen/SearchScreen.js - Temiz versiyon
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Linking } from 'react-native';
import { Searchbar, Text, Chip, ActivityIndicator } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import ProductList from '../../components/ProductList/ProductList';
import productService from '../../services/productService';

export default function SearchScreen({ route, navigation }) {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Route params'tan gelen değerler
  const { initialQuery, filterType } = route.params || {};

  useEffect(() => {
    loadAllProducts();
  }, []);

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  // Ürünler yüklendikten SONRA filtre uygula
  useEffect(() => {
    if (filterType && products.length > 0) {
      handleSpecialFilter(filterType);
    }
  }, [filterType, products]);

  useEffect(() => {
    if (!filterType) { // Sadece normal arama için
      performSearch();
    }
  }, [query, products]);

  const loadAllProducts = async () => {
    try {
      setLoading(true);
      const allProducts = await productService.getAllProducts();
      setProducts(allProducts);
    } catch (error) {
      console.error('❌ Search: Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Özel filtreler (öne çıkanlar, popülerler)
  const handleSpecialFilter = (filterType) => {
    console.log('🔍 Special filter:', filterType);
    console.log('📊 Available products:', products.length);
    
    if (filterType === 'featured') {
      const featured = products.filter(product => product.featured === true);
      console.log('🌟 Featured products found:', featured.length);
      setSearchResults(featured);
      return;
    }
    
    if (filterType === 'popular') {
      const popular = products.filter(product => product.popular === true);
      console.log('🔥 Popular products found:', popular.length);
      setSearchResults(popular);
      return;
    }
  };

  // Minimal normalizasyon - sadece problem yaşanan karakterler
  const normalizeForSearch = (text) => {
    if (!text) return '';
    return text
      .toLowerCase()
      .replace(/ü/g, 'u')  // ü -> u
      .replace(/Ü/g, 'u')  // Ü -> u
      .replace(/ş/g, 's')  // ş -> s
      .replace(/Ş/g, 's')  // Ş -> s
      .replace(/ğ/g, 'g')  // ğ -> g
      .replace(/Ğ/g, 'g')  // Ğ -> g
      .replace(/ç/g, 'c')  // ç -> c
      .replace(/Ç/g, 'c')  // Ç -> c
      .replace(/ö/g, 'o')  // ö -> o
      .replace(/Ö/g, 'o')  // Ö -> o
      .replace(/ı/g, 'i')  // ı -> i
      .replace(/İ/g, 'i'); // İ -> i
  };

  const performSearch = () => {
    if (!query || query.length < 2) {
      if (!route.params?.filterType) {
        setSearchResults([]);
      }
      return;
    }

    console.log('🔍 Searching for:', query);
    
    // Hem basit hem normalize arama yap
    const normalizedQuery = normalizeForSearch(query);
    console.log('🔍 Query normalized:', `"${query}" -> "${normalizedQuery}"`);
    
    const results = products.filter(product => {
      // Güvenlik kontrolü
      if (!product || !product.tags || !Array.isArray(product.tags)) {
        return false;
      }
      
      // Tag'larda arama yap - BOTH original AND normalized
      return product.tags.some(tag => {
        if (!tag) return false;
        
        // Önce normal eşleşme dene
        const normalMatch = tag.toLowerCase().includes(query.toLowerCase());
        
        // Sonra normalize eşleşme dene
        const normalizedTag = normalizeForSearch(tag);
        const normalizedMatch = normalizedTag.includes(normalizedQuery);
        
        const isMatch = normalMatch || normalizedMatch;
        
        if (isMatch) {
          console.log(`✅ Match: "${tag}" matches "${query}" (normal: ${normalMatch}, normalized: ${normalizedMatch})`);
        }
        
        return isMatch;
      });
    });

    console.log('✅ Found:', results.length, 'products');
    setSearchResults(results);
  };

  const handleProductPress = (product) => {
    console.log('📱 Product pressed:', product?.id, product?.name);
    // navigation.navigate('ProductDetail', { product });
  };

  const popularTags = ['20mm', 'inox', 'parlak', 'altin', 'ceviz'];

  const renderEmptyState = () => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Ürünler yükleniyor...</Text>
        </View>
      );
    }

    // Özel filtre durumları
    if (route.params?.filterType && !query) {
      const filterType = route.params.filterType;
      if (searchResults.length === 0) {
        return (
          <View style={styles.centerContainer}>
            <Ionicons name="sad-outline" size={64} color={theme.colors.disabled} />
            <Text variant="headlineSmall" style={styles.emptyTitle}>
              {filterType === 'featured' ? 'Öne Çıkan Ürün Yok' : 'Popüler Ürün Yok'}
            </Text>
            <Text variant="bodyMedium" style={styles.emptyDescription}>
              {filterType === 'featured' 
                ? 'Henüz öne çıkan ürün bulunmuyor'
                : 'Popüler ürün bulunamadı'
              }
            </Text>
          </View>
        );
      }
      return null;
    }

    if (!query) {
      return (
        <View style={styles.centerContainer}>
          <Ionicons name="search" size={64} color={theme.colors.disabled} />
          <Text variant="headlineSmall" style={styles.emptyTitle}>
            Arama Yapın
          </Text>
          <Text variant="bodyMedium" style={styles.emptyDescription}>
            Ürünleri bulmak için yukarıdaki arama çubuğunu kullanın
          </Text>
        </View>
      );
    }

    if (searchResults.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Ionicons name="sad-outline" size={64} color={theme.colors.disabled} />
          <Text variant="headlineSmall" style={styles.emptyTitle}>
            Sonuç Bulunamadı
          </Text>
          <Text variant="bodyMedium" style={styles.emptyDescription}>
            "{query}" için eşleşen ürün bulunamadı.{'\n'}
            Farklı kelimeler deneyin.
          </Text>
        </View>
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      {/* Arama Çubuğu - Kompakt */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Etiketlerde ara... (örn: 20mm, ceviz, gümüş)"
          onChangeText={setQuery}
          value={query}
          style={styles.searchbar}
          iconColor={theme.colors.primary}
        />
      </View>

      {/* Popüler Etiketler - Sadece boş durumda göster */}
      {!query && searchResults.length === 0 && (
        <View style={styles.tagsSection}>
          <Text variant="titleMedium" style={styles.tagsTitle}>
            Popüler Etiketler
          </Text>
          <View style={styles.tagsContainer}>
            {popularTags.map((tag) => (
              <Chip
                key={tag}
                mode="outlined"
                onPress={() => setQuery(tag)}
                style={styles.popularChip}
                compact
              >
                {tag}
              </Chip>
            ))}
          </View>
        </View>
      )}

      {/* Sonuçlar */}
      {searchResults.length > 0 ? (
        <View style={styles.resultsContainer}>
          <View style={styles.resultsHeader}>
            <Text variant="titleLarge" style={styles.resultsTitle}>
              {route.params?.filterType === 'featured' ? 'Öne Çıkan Ürünler' :
               route.params?.filterType === 'popular' ? 'Popüler Ürünler' :
               'Arama Sonuçları'}
            </Text>
            <Text variant="bodyMedium" style={styles.resultsCount}>
              {searchResults.length} ürün bulundu
            </Text>
          </View>
          
          <ProductList
            products={searchResults}
            onProductPress={handleProductPress}
            numColumns={2}
          />
        </View>
      ) : (
        renderEmptyState()
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  searchContainer: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    elevation: 2,
    paddingBottom: theme.spacing.sm,
  },
  searchbar: {
    elevation: 4,
  },
  tagsSection: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outline,
  },
  tagsTitle: {
    color: theme.colors.onSurface,
    marginBottom: theme.spacing.sm,
    fontWeight: '600',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  popularChip: {
    backgroundColor: theme.colors.primaryContainer,
    height: 40,
  },
  resultsContainer: {
    flex: 1,
  },
  resultsHeader: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outline,
  },
  resultsTitle: {
    color: theme.colors.onSurface,
    fontWeight: '700',
    marginBottom: theme.spacing.xs,
  },
  resultsCount: {
    color: theme.colors.primary,
    fontWeight: '500',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    color: theme.colors.onBackground,
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
    lineHeight: 20,
  },
});