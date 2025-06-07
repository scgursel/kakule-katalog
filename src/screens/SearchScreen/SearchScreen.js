// src/screens/SearchScreen/SearchScreen.js - Basit versiyon
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
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

  // Route params'tan gelen initial değerler
  const { initialQuery } = route.params || {};

  useEffect(() => {
    loadAllProducts();
  }, []);

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    performSearch();
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

  const performSearch = () => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      return;
    }

    console.log('🔍 Searching for:', query);
    
    // Basit tag araması
    const results = products.filter(product => {
      if (!product.tags || !Array.isArray(product.tags)) return false;
      
      return product.tags.some(tag => 
        tag.toLowerCase().includes(query.toLowerCase())
      );
    });

    console.log('✅ Found:', results.length, 'products');
    setSearchResults(results);
  };

  const handleProductPress = (product) => {
    console.log('📱 Product pressed:', product.id);
    // navigation.navigate('ProductDetail', { product });
  };

  const popularTags = ['20mm', 'ceviz', 'parlak', 'altin', 'çerçeve', 'B', 'G'];

  const renderEmptyState = () => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Ürünler yükleniyor...</Text>
        </View>
      );
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
      {/* Arama Çubuğu */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Etiketlerde ara... (örn: 20mm, ceviz, altin)"
          onChangeText={setQuery}
          value={query}
          style={styles.searchbar}
          iconColor={theme.colors.primary}
        />
      </View>

      {/* Popüler Etiketler */}
      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
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

      {/* Sonuçlar */}
      {searchResults.length > 0 ? (
        <View style={styles.resultsContainer}>
          <View style={styles.resultsHeader}>
            <Text variant="titleMedium" style={styles.resultsTitle}>
              Arama Sonuçları
            </Text>
            <Text variant="bodySmall" style={styles.resultsCount}>
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
  },
  searchbar: {
    elevation: 4,
  },
  section: {
    padding: theme.spacing.md,
  },
  sectionTitle: {
    color: theme.colors.onBackground,
    marginBottom: theme.spacing.md,
    fontWeight: '600',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  popularChip: {
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.primaryContainer,
  },
  resultsContainer: {
    flex: 1,
  },
  resultsHeader: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outline,
  },
  resultsTitle: {
    color: theme.colors.onSurface,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  resultsCount: {
    color: theme.colors.onSurface,
    opacity: 0.7,
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