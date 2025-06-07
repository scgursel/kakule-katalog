// src/screens/SearchScreen/SearchScreen.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Searchbar, Text, Chip, Card, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';

export default function SearchScreen({ route, navigation }) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // Route params'tan gelen initial değerler
  const { initialQuery, initialCategory } = route.params || {};

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
    }
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialQuery, initialCategory]);

  const categories = [
    { id: 'cerceveler', name: 'Çerçeveler', icon: 'image-outline', color: '#2E7D32' },
    { id: 'paspartolar', name: 'Paspartolar', icon: 'layers-outline', color: '#8D6E63' },
    { id: 'aksesuarlar', name: 'Aksesuarlar', icon: 'construct-outline', color: '#5D4037' },
  ];

  const popularSearches = ['vintage', 'modern', 'ahşap', 'metal', 'yeşil', 'beyaz', 'siyah', 'küçük'];
  const colors = ['beyaz', 'siyah', 'kahverengi', 'yeşil', 'mavi', 'kırmızı'];
  const materials = ['ahşap', 'metal', 'plastik', 'cam'];

  const handleCategoryPress = (categoryId) => {
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
  };

  const handleSearch = () => {
    // Buraya gerçek arama fonksiyonu gelecek
    console.log('Arama:', { query, selectedCategory });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Arama Çubuğu */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Ürün ara... (örn: yeşil çerçeve, vintage)"
          onChangeText={setQuery}
          value={query}
          style={styles.searchbar}
          iconColor={theme.colors.primary}
          onSubmitEditing={handleSearch}
        />
      </View>

      {/* Kategori Filtreleri */}
      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Kategoriler
        </Text>
        <View style={styles.categoryContainer}>
          {categories.map((category) => (
            <Chip
              key={category.id}
              mode={selectedCategory === category.id ? 'flat' : 'outlined'}
              selected={selectedCategory === category.id}
              onPress={() => handleCategoryPress(category.id)}
              style={[
                styles.categoryChip,
                selectedCategory === category.id && { backgroundColor: category.color + '20' }
              ]}
              icon={category.icon}
            >
              {category.name}
            </Chip>
          ))}
        </View>
      </View>

      {/* Popüler Aramalar */}
      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Popüler Aramalar
        </Text>
        <View style={styles.tagsContainer}>
          {popularSearches.map((search) => (
            <Chip
              key={search}
              mode="outlined"
              onPress={() => setQuery(search)}
              style={styles.popularChip}
              compact
            >
              {search}
            </Chip>
          ))}
        </View>
      </View>

      {/* Renk Filtreleri */}
      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Renkler
        </Text>
        <View style={styles.tagsContainer}>
          {colors.map((color) => (
            <Chip
              key={color}
              mode="outlined"
              onPress={() => setQuery(color)}
              style={styles.colorChip}
              compact
            >
              {color}
            </Chip>
          ))}
        </View>
      </View>

      {/* Malzeme Filtreleri */}
      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Malzemeler
        </Text>
        <View style={styles.tagsContainer}>
          {materials.map((material) => (
            <Chip
              key={material}
              mode="outlined"
              onPress={() => setQuery(material)}
              style={styles.materialChip}
              compact
            >
              {material}
            </Chip>
          ))}
        </View>
      </View>

      {/* Arama Sonuçları Placeholder */}
      {(query || selectedCategory) && (
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Arama Sonuçları
          </Text>
          <Card style={styles.resultCard}>
            <Card.Content>
              <View style={styles.resultContent}>
                <Ionicons name="search" size={48} color={theme.colors.primary} />
                <Text variant="titleLarge" style={styles.resultTitle}>
                  Arama Sistemi Hazırlanıyor
                </Text>
                <Text variant="bodyMedium" style={styles.resultDescription}>
                  Yakında "{query}" için sonuçları gösterebileceğiz
                </Text>
                {selectedCategory && (
                  <Text variant="bodySmall" style={styles.resultCategory}>
                    Kategori: {categories.find(c => c.id === selectedCategory)?.name}
                  </Text>
                )}
              </View>
            </Card.Content>
          </Card>
        </View>
      )}

      <View style={styles.bottomSpacer} />
    </ScrollView>
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
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  categoryChip: {
    marginBottom: theme.spacing.sm,
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
  colorChip: {
    marginBottom: theme.spacing.sm,
    backgroundColor: '#FFF3E0',
  },
  materialChip: {
    marginBottom: theme.spacing.sm,
    backgroundColor: '#F3E5F5',
  },
  resultCard: {
    elevation: 4,
    borderRadius: 12,
  },
  resultContent: {
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  resultTitle: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
    color: theme.colors.primary,
    fontWeight: '600',
  },
  resultDescription: {
    textAlign: 'center',
    color: theme.colors.onSurface,
    opacity: 0.7,
    marginBottom: theme.spacing.sm,
  },
  resultCategory: {
    textAlign: 'center',
    color: theme.colors.primary,
    fontStyle: 'italic',
  },
  bottomSpacer: {
    height: theme.spacing.lg,
  },
});