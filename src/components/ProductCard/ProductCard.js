// src/components/ProductCard/ProductCard.js
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
          <Text variant="titleMedium" style={styles.title} numberOfLines={2}>
            {product.name}
          </Text>
          
          <Text variant="bodySmall" style={styles.description} numberOfLines={2}>
            {product.shortDescription || product.description}
          </Text>

          {/* Specs */}
          <View style={styles.specsContainer}>
            {product.specs?.color && (
              <Chip mode="outlined" compact style={styles.specChip}>
                {product.specs.color}
              </Chip>
            )}
            {product.specs?.material && (
              <Chip mode="outlined" compact style={styles.specChip}>
                {product.specs.material}
              </Chip>
            )}
          </View>

          {/* Tags (ilk 3 tanesi) */}
          {product.tags && product.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {product.tags.slice(0, 3).map((tag, index) => (
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
              {product.tags.length > 3 && (
                <Text style={styles.moreTagsText}>+{product.tags.length - 3}</Text>
              )}
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
  },
  title: {
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: theme.spacing.xs,
  },
  description: {
    color: theme.colors.onSurface,
    opacity: 0.7,
    marginBottom: theme.spacing.sm,
  },
  specsContainer: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  },
  specChip: {
    height: 24,
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
});