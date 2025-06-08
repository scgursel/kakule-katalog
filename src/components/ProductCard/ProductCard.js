// src/components/ProductCard/ProductCard.js - Düzeltilmiş versiyon
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Card, Text, Chip, Badge } from 'react-native-paper';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';

const { width } = Dimensions.get('window');

export default function ProductCard({ 
  product, 
  onPress, 
  showRelevanceScore = false,
  style,
  width: cardWidth 
}) {
  // Güvenlik kontrolü
  if (!product) {
    console.warn('ProductCard: product is undefined');
    return null;
  }

  const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0];
  
  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, style]}>
      <Card style={[styles.card, cardWidth && { width: cardWidth }]}>
        {/* Görsel */}
        <View style={styles.imageContainer}>
          {primaryImage ? (
            <Image
              source={{ uri: primaryImage.thumbnail || primaryImage.url }}
              style={styles.image}
              contentFit="cover"
              transition={200}
            />
          ) : (
            <View style={styles.placeholderImage}>
              <Ionicons 
                name="image-outline" 
                size={40} 
                color={theme.colors.disabled} 
              />
            </View>
          )}
          
          {/* Badges */}
          <View style={styles.badgeContainer}>
            {product.featured && (
              <Badge style={styles.featuredBadge}>⭐</Badge>
            )}
            {!product.availability && (
              <Badge style={styles.unavailableBadge}>Stokta Yok</Badge>
            )}
            {showRelevanceScore && product.relevanceScore && (
              <Badge style={styles.scoreBadge}>
                {product.relevanceScore}
              </Badge>
            )}
          </View>
        </View>

        {/* İçerik */}
        <Card.Content style={styles.content}>
          <Text variant="titleSmall" style={styles.title} numberOfLines={2}>
            {product.name}
          </Text>
          
          <Text variant="bodySmall" style={styles.description} numberOfLines={1}>
            {product.shortDescription || product.description}
          </Text>

          {/* Sadece Tags - Kompakt */}
          {product.tags && product.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              <View style={styles.tagsRow}>
                {product.tags.slice(0, 4).map((tag, index) => (
                  <Chip 
                    key={index}
                    mode="outlined" 
                    compact 
                    style={styles.tagChip}
                    textStyle={styles.tagText}
                    contentStyle={styles.tagContent}
                  >
                    {tag}
                  </Chip>
                ))}
                {product.tags.length > 4 && (
                  <Text style={styles.moreTagsText}>+{product.tags.length - 4}</Text>
                )}
              </View>
            </View>
          )}
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    elevation: 4,
    backgroundColor: theme.colors.surface,
  },
  imageContainer: {
    position: 'relative',
    height: 150,
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.background,
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeContainer: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    flexDirection: 'column',
    gap: theme.spacing.xs,
  },
  featuredBadge: {
    backgroundColor: '#FFD700',
  },
  unavailableBadge: {
    backgroundColor: theme.colors.error,
  },
  scoreBadge: {
    backgroundColor: theme.colors.primary,
  },
  content: {
    padding: theme.spacing.sm,
    paddingBottom: theme.spacing.xs, // Alt padding azaltıldı
  },
  title: {
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: theme.spacing.xs,
    lineHeight: 18, // Satır yüksekliği optimize edildi
  },
  description: {
    color: theme.colors.onSurface,
    opacity: 0.7,
    marginBottom: theme.spacing.xs, // Margin azaltıldı
    lineHeight: 16,
  },
  tagsContainer: {
    marginBottom: theme.spacing.xs, // Margin azaltıldı
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
    height: 26,
    backgroundColor: theme.colors.primaryContainer,
    paddingHorizontal: 4,
    marginVertical: 1,
    marginHorizontal: 1,
    minWidth: 30,
  },
  tagText: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: '500',
    lineHeight: 12,
  },
  tagContent: {
    paddingHorizontal: 2,
    paddingVertical: 2,
    marginHorizontal: 0,
    marginVertical: 0,
  },
  moreTagsText: {
    fontSize: 9,
    color: theme.colors.primary,
    fontWeight: '500',
    marginLeft: 2,
  },
});