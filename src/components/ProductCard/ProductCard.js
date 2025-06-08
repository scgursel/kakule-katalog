// src/components/ProductCard/ProductCard.js
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Card, Text, Chip, Badge } from 'react-native-paper';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import { 
  responsiveValue, 
  fontSize, 
  spacing,
  getShadow,
  isTablet
} from '../../utils/responsive';

const { width } = Dimensions.get('window');

export default function ProductCard({ 
  product, 
  onPress, 
  showRelevanceScore = false,
  style,
  width: cardWidth,
  compact = false 
}) {
  // Güvenlik kontrolü
  if (!product) {
    console.warn('ProductCard: product is undefined');
    return null;
  }

  const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0];
  const imageHeight = compact ? responsiveValue(120, 140, 160) : responsiveValue(140, 160, 180);
  
  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, style]}>
      <Card style={[styles.card, cardWidth && { width: cardWidth }]}>
        {/* Görsel */}
        <View style={[styles.imageContainer, { height: imageHeight }]}>
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
                size={responsiveValue(32, 36, 40)} 
                color={theme.colors.disabled} 
              />
            </View>
          )}
          
          {/* Badges */}
          <View style={styles.badgeContainer}>
            {product.featured && (
              <Badge style={styles.featuredBadge} size={responsiveValue(20, 22, 24)}>
                ⭐
              </Badge>
            )}
            {!product.availability && (
              <Badge style={styles.unavailableBadge} size={responsiveValue(20, 22, 24)}>
                Stokta Yok
              </Badge>
            )}
            {showRelevanceScore && product.relevanceScore && (
              <Badge style={styles.scoreBadge} size={responsiveValue(20, 22, 24)}>
                {product.relevanceScore}
              </Badge>
            )}
          </View>
        </View>

        {/* İçerik */}
        <Card.Content style={styles.content}>
          <Text 
            variant="titleSmall" 
            style={[styles.title, { fontSize: fontSize.md }]} 
            numberOfLines={2}
          >
            {product.name}
          </Text>
          
          {!compact && (
            <Text 
              variant="bodySmall" 
              style={[styles.description, { fontSize: fontSize.sm }]} 
              numberOfLines={1}
            >
              {product.shortDescription || product.description}
            </Text>
          )}

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              <View style={styles.tagsRow}>
                {product.tags.slice(0, compact ? 3 : 4).map((tag, index) => (
                  <Chip 
                    key={index}
                    mode="outlined" 
                    compact 
                    style={styles.tagChip}
                    textStyle={[styles.tagText, { fontSize: fontSize.xs }]}
                    contentStyle={styles.tagContent}
                  >
                    {tag}
                  </Chip>
                ))}
                {product.tags.length > (compact ? 3 : 4) && (
                  <Text style={[styles.moreTagsText, { fontSize: fontSize.xs }]}>
                    +{product.tags.length - (compact ? 3 : 4)}
                  </Text>
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
    ...getShadow(3),
    backgroundColor: theme.colors.surface,
    borderRadius: responsiveValue(8, 10, 12),
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
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
    top: spacing.sm,
    right: spacing.sm,
    flexDirection: 'column',
    gap: spacing.xs,
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
    padding: spacing.sm,
    paddingBottom: spacing.xs,
  },
  title: {
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: spacing.xs,
    lineHeight: fontSize.md * 1.3,
  },
  description: {
    color: theme.colors.textSecondary,
    marginBottom: spacing.xs,
    lineHeight: fontSize.sm * 1.3,
  },
  tagsContainer: {
    marginBottom: spacing.xs,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: responsiveValue(2, 3, 4),
    alignItems: 'center',
  },
  tagChip: {
    height: responsiveValue(24, 26, 28),
    backgroundColor: theme.colors.primaryContainer,
    paddingHorizontal: responsiveValue(3, 4, 5),
    marginVertical: 1,
    marginHorizontal: 1,
    minWidth: responsiveValue(28, 30, 32),
  },
  tagText: {
    color: theme.colors.primary,
    fontWeight: '500',
    lineHeight: fontSize.xs * 1.2,
  },
  tagContent: {
    paddingHorizontal: responsiveValue(2, 2, 3),
    paddingVertical: responsiveValue(1, 2, 2),
    marginHorizontal: 0,
    marginVertical: 0,
  },
  moreTagsText: {
    color: theme.colors.primary,
    fontWeight: '500',
    marginLeft: responsiveValue(2, 2, 3),
  },
});