// src/components/SearchBar/SearchBar.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Searchbar, Chip, Portal, Modal, Text, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useDebounce } from '../../hooks/useDebounce';
import { theme } from '../../constants/theme';

export default function SearchBar({ 
  onSearch, 
  onFilterChange, 
  filters = {},
  placeholder = "Ürün ara... (örn: yeşil, ahşap, modern)" 
}) {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  const popularTags = ['yeşil', 'ahşap', 'modern', 'vintage', 'metal', 'beyaz'];

  const handleTagPress = (tag) => {
    setQuery(tag);
  };

  const clearFilters = () => {
    onFilterChange({});
  };

  const activeFilterCount = Object.keys(filters).length;

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder={placeholder}
          onChangeText={setQuery}
          value={query}
          style={styles.searchbar}
          iconColor={theme.colors.primary}
          onClearIconPress={() => setQuery('')}
        />
        
        <Button
          mode="outlined"
          onPress={() => setShowFilters(true)}
          style={styles.filterButton}
          icon="tune"
          contentStyle={styles.filterButtonContent}
        >
          {activeFilterCount > 0 ? `Filtre (${activeFilterCount})` : 'Filtre'}
        </Button>
      </View>

      {/* Popüler Etiketler */}
      <View style={styles.tagsContainer}>
        <Text variant="bodySmall" style={styles.tagsLabel}>
          Popüler aramalar:
        </Text>
        <View style={styles.tagsRow}>
          {popularTags.map((tag) => (
            <Chip
              key={tag}
              mode="outlined"
              onPress={() => handleTagPress(tag)}
              style={styles.tag}
              compact
            >
              {tag}
            </Chip>
          ))}
        </View>
      </View>

      {/* Filtre Modal */}
      <Portal>
        <Modal
          visible={showFilters}
          onDismiss={() => setShowFilters(false)}
          contentContainerStyle={styles.modalContent}
        >
          <FilterModal
            filters={filters}
            onFilterChange={onFilterChange}
            onClose={() => setShowFilters(false)}
            onClear={clearFilters}
          />
        </Modal>
      </Portal>
    </View>
  );
}

// Filtre Modal Bileşeni
function FilterModal({ filters, onFilterChange, onClose, onClear }) {
  const [localFilters, setLocalFilters] = useState(filters);

  const categories = [
    { id: 'cerceveler', name: 'Çerçeveler' },
    { id: 'paspartolar', name: 'Paspartolar' },
    { id: 'aksesuarlar', name: 'Aksesuarlar' }
  ];

  const colors = ['beyaz', 'siyah', 'kahverengi', 'yeşil', 'mavi', 'kırmızı'];
  const materials = ['ahşap', 'metal', 'plastik', 'cam', 'karton'];

  const handleApplyFilters = () => {
    onFilterChange(localFilters);
    onClose();
  };

  const toggleFilter = (type, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [type]: prev[type] === value ? undefined : value
    }));
  };

  return (
    <View style={styles.filterContent}>
      <Text variant="headlineSmall" style={styles.filterTitle}>
        Filtreler
      </Text>

      {/* Kategori Filtreleri */}
      <Text variant="titleMedium" style={styles.filterSectionTitle}>
        Kategori
      </Text>
      <View style={styles.filterChipsContainer}>
        {categories.map((category) => (
          <Chip
            key={category.id}
            mode={localFilters.category === category.id ? 'flat' : 'outlined'}
            selected={localFilters.category === category.id}
            onPress={() => toggleFilter('category', category.id)}
            style={styles.filterChip}
          >
            {category.name}
          </Chip>
        ))}
      </View>

      {/* Renk Filtreleri */}
      <Text variant="titleMedium" style={styles.filterSectionTitle}>
        Renk
      </Text>
      <View style={styles.filterChipsContainer}>
        {colors.map((color) => (
          <Chip
            key={color}
            mode={localFilters.color === color ? 'flat' : 'outlined'}
            selected={localFilters.color === color}
            onPress={() => toggleFilter('color', color)}
            style={styles.filterChip}
          >
            {color}
          </Chip>
        ))}
      </View>

      {/* Malzeme Filtreleri */}
      <Text variant="titleMedium" style={styles.filterSectionTitle}>
        Malzeme
      </Text>
      <View style={styles.filterChipsContainer}>
        {materials.map((material) => (
          <Chip
            key={material}
            mode={localFilters.material === material ? 'flat' : 'outlined'}
            selected={localFilters.material === material}
            onPress={() => toggleFilter('material', material)}
            style={styles.filterChip}
          >
            {material}
          </Chip>
        ))}
      </View>

      {/* Diğer Filtreler */}
      <Text variant="titleMedium" style={styles.filterSectionTitle}>
        Diğer
      </Text>
      <View style={styles.filterChipsContainer}>
        <Chip
          mode={localFilters.featured ? 'flat' : 'outlined'}
          selected={localFilters.featured}
          onPress={() => toggleFilter('featured', !localFilters.featured)}
          style={styles.filterChip}
        >
          Öne Çıkanlar
        </Chip>
        <Chip
          mode={localFilters.availability ? 'flat' : 'outlined'}
          selected={localFilters.availability}
          onPress={() => toggleFilter('availability', !localFilters.availability)}
          style={styles.filterChip}
        >
          Stokta Var
        </Chip>
      </View>

      {/* Butonlar */}
      <View style={styles.filterButtons}>
        <Button
          mode="outlined"
          onPress={() => {
            setLocalFilters({});
            onClear();
          }}
          style={styles.filterButton}
        >
          Temizle
        </Button>
        <Button
          mode="contained"
          onPress={handleApplyFilters}
          style={styles.filterButton}
        >
          Uygula
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  searchbar: {
    flex: 1,
    marginRight: theme.spacing.sm,
    elevation: 2,
  },
  filterButton: {
    height: 56,
  },
  filterButtonContent: {
    height: 56,
  },
  tagsContainer: {
    marginTop: theme.spacing.sm,
  },
  tagsLabel: {
    marginBottom: theme.spacing.xs,
    color: theme.colors.onSurface,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
  },
  tag: {
    marginRight: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    margin: theme.spacing.lg,
    borderRadius: 8,
    maxHeight: '80%',
  },
  filterContent: {
    padding: theme.spacing.lg,
  },
  filterTitle: {
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
    color: theme.colors.primary,
  },
  filterSectionTitle: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    color: theme.colors.onSurface,
  },
  filterChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  filterChip: {
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  filterButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  filterButton: {
    flex: 1,
  },
});