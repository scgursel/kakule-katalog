// src/screens/HomeScreen/HomeScreen.js
import React from 'react';
import { View, StyleSheet, ScrollView, Linking, Alert } from 'react-native';
import { Card, Text, Button, Chip } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import Logo from '../../components/Logo/logo';
import { 
  responsiveValue, 
  fontSize, 
  spacing, 
  getPadding,
  getShadow,
  isTablet,
  getColumns
} from '../../utils/responsive';

export default function HomeScreen({ navigation }) {
  const categories = [
    {
      id: 'cerceveler',
      name: 'Çerçeveler',
      description: 'Modern ve klasik çerçeve çeşitleri',
      icon: 'image-outline',
      color: theme.colors.primary,
      productCount: 150
    },
    {
      id: 'paspartolar',
      name: 'Paspartolar',
      description: 'Rengarenk paspartu çeşitleri',
      icon: 'layers-outline',
      color: theme.colors.primaryDark,
      productCount: 200
    },
    {
      id: 'aksesuarlar',
      name: 'Aksesuarlar',
      description: 'Dekoratif aksesuarlar ve yedek parçalar',
      icon: 'construct-outline',
      color: theme.colors.accent,
      productCount: 100
    },
  ];

  const popularTags = ['vintage', 'modern', 'ahşap', 'metal', 'yeşil', 'beyaz'];

  const handleCategoryPress = (category) => {
    navigation.navigate('Category', { category });
  };

  const handleTagPress = (tag) => {
    navigation.navigate('Search', { initialQuery: tag });
  };

  const handleFeaturedPress = () => {
    navigation.navigate('Search', { 
      initialQuery: '',
      filterType: 'featured'
    });
  };

  const handlePopularPress = () => {
    navigation.navigate('Search', { 
      initialQuery: '',
      filterType: 'popular'
    });
  };

  const handleContactPress = () => {
    const phoneNumber = '905551234567';
    const message = 'Merhaba! Ürünleriniz hakkında bilgi almak istiyorum.';
    const whatsappUrl = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    
    Linking.canOpenURL(whatsappUrl)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(whatsappUrl);
        } else {
          Alert.alert(
            'WhatsApp Bulunamadı',
            'WhatsApp uygulaması yüklü değil. Telefon numaramız: +90 555 123 45 67',
            [
              { text: 'Tamam', style: 'default' },
              { 
                text: 'Aramak İçin Tıkla', 
                onPress: () => Linking.openURL(`tel:${phoneNumber}`)
              }
            ]
          );
        }
      })
      .catch((err) => {
        console.error('WhatsApp açılamadı:', err);
        Alert.alert('Hata', 'İletişim başlatılamadı. Lütfen manuel olarak arayın: +90 555 123 45 67');
      });
  };

  const renderCategoryCard = (category) => (
    <Card key={category.id} style={styles.categoryCard}>
      <Card.Content>
        <View style={styles.categoryHeader}>
          <View style={styles.categoryInfo}>
            <View style={[styles.categoryIconContainer, { backgroundColor: `${category.color}20` }]}>
              <Ionicons
                name={category.icon}
                size={responsiveValue(28, 32, 36)}
                color={category.color}
              />
            </View>
            <View style={styles.categoryText}>
              <Text variant="titleLarge" style={styles.categoryName}>
                {category.name}
              </Text>
              <Text variant="bodyMedium" style={styles.categoryDescription}>
                {category.description}
              </Text>
              <Chip
                mode="outlined"
                compact
                style={[styles.productCountChip, { borderColor: category.color }]}
                textStyle={{ color: category.color, fontSize: fontSize.sm }}
              >
                {category.productCount} ürün
              </Chip>
            </View>
          </View>
        </View>
      </Card.Content>
      <Card.Actions>
        <Button
          mode="contained"
          onPress={() => handleCategoryPress(category)}
          style={[styles.categoryButton, { backgroundColor: category.color }]}
          contentStyle={styles.categoryButtonContent}
          labelStyle={{ fontSize: fontSize.md }}
        >
          Ürünleri Gör
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Header Section with Logo */}
      <LinearGradient
        colors={theme.colors.headerGradient}
        style={styles.header}
      >
        <Logo 
          size="medium" 
          showText={true}
          textStyle={{ color: 'white' }}
        />
        <Text variant="bodyLarge" style={styles.headerSubtitle}>
          500+ ürünle zengin koleksiyonumuz
        </Text>
      </LinearGradient>

      {/* Categories Section */}
      <View style={styles.section}>
        <Text variant="headlineSmall" style={styles.sectionTitle}>
          Kategoriler
        </Text>

        {isTablet() ? (
          <View style={styles.categoriesGrid}>
            {categories.map(renderCategoryCard)}
          </View>
        ) : (
          categories.map(renderCategoryCard)
        )}
      </View>

      {/* Popular Tags Section */}
      <View style={styles.section}>
        <Text variant="headlineSmall" style={styles.sectionTitle}>
          Popüler Aramalar
        </Text>
        <Text variant="bodyMedium" style={styles.sectionSubtitle}>
          En çok aranan özellikler
        </Text>

        <View style={styles.tagsContainer}>
          {popularTags.map((tag) => (
            <Chip
              key={tag}
              mode="outlined"
              onPress={() => handleTagPress(tag)}
              style={styles.popularTag}
              textStyle={{ fontSize: fontSize.sm }}
              icon={() => <Ionicons name="search-outline" size={fontSize.md} color={theme.colors.primary} />}
            >
              {tag}
            </Chip>
          ))}
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text variant="headlineSmall" style={styles.sectionTitle}>
          Hızlı Erişim
        </Text>

        <View style={styles.quickActionsContainer}>
          <Card style={styles.quickActionCard} onPress={handleFeaturedPress}>
            <Card.Content style={styles.quickActionContent}>
              <Ionicons name="star" size={responsiveValue(28, 32, 36)} color="#FFD700" />
              <Text variant="titleMedium" style={styles.quickActionTitle}>
                Öne Çıkanlar
              </Text>
              <Text variant="bodySmall" style={styles.quickActionDescription}>
                Seçili ürünlerimiz
              </Text>
            </Card.Content>
          </Card>

          <Card style={styles.quickActionCard} onPress={handlePopularPress}>
            <Card.Content style={styles.quickActionContent}>
              <Ionicons name="trending-up" size={responsiveValue(28, 32, 36)} color={theme.colors.primary} />
              <Text variant="titleMedium" style={styles.quickActionTitle}>
                En Popülerler
              </Text>
              <Text variant="bodySmall" style={styles.quickActionDescription}>
                Çok tercih edilenler
              </Text>
            </Card.Content>
          </Card>
        </View>
      </View>

      {/* Contact Section */}
      <Card style={styles.contactCard}>
        <Card.Content>
          <View style={styles.contactContent}>
            <Ionicons name="chatbubble-ellipses" size={responsiveValue(36, 40, 44)} color="#25D366" />
            <View style={styles.contactText}>
              <Text variant="titleLarge" style={styles.contactTitle}>
                Teklif Almak İster misiniz?
              </Text>
              <Text variant="bodyMedium" style={styles.contactDescription}>
                WhatsApp üzerinden hızlıca iletişime geçin
              </Text>
            </View>
          </View>
        </Card.Content>
        <Card.Actions>
          <Button
            mode="contained"
            style={styles.contactButton}
            contentStyle={styles.contactButtonContent}
            labelStyle={{ fontSize: fontSize.md }}
            icon={() => <Ionicons name="chatbubble-ellipses" size={fontSize.lg} color="white" />}
            onPress={handleContactPress}
          >
            WhatsApp ile İletişim
          </Button>
        </Card.Actions>
      </Card>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    ...getPadding('xl'),
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    borderBottomLeftRadius: responsiveValue(20, 24, 28),
    borderBottomRightRadius: responsiveValue(20, 24, 28),
    alignItems: 'center',
  },
  headerSubtitle: {
    color: 'white',
    textAlign: 'center',
    opacity: 0.9,
    fontSize: fontSize.md,
    marginTop: spacing.sm,
  },
  section: {
    ...getPadding('md'),
  },
  sectionTitle: {
    color: theme.colors.onBackground,
    marginBottom: spacing.sm,
    fontWeight: '600',
    fontSize: fontSize.xl,
  },
  sectionSubtitle: {
    color: theme.colors.textSecondary,
    marginBottom: spacing.md,
    fontSize: fontSize.md,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.sm,
  },
  categoryCard: {
    marginBottom: spacing.md,
    borderRadius: responsiveValue(8, 10, 12),
    ...getShadow(4),
    width: isTablet() ? '48%' : 'auto',
    marginHorizontal: isTablet() ? '1%' : 0,
  },
  categoryHeader: {
    marginBottom: spacing.sm,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  categoryIconContainer: {
    width: responsiveValue(48, 56, 64),
    height: responsiveValue(48, 56, 64),
    borderRadius: responsiveValue(24, 28, 32),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  categoryText: {
    flex: 1,
  },
  categoryName: {
    color: theme.colors.onSurface,
    fontWeight: '600',
    marginBottom: spacing.xs,
    fontSize: fontSize.lg,
  },
  categoryDescription: {
    color: theme.colors.textSecondary,
    marginBottom: spacing.sm,
    fontSize: fontSize.sm,
  },
  productCountChip: {
    alignSelf: 'flex-start',
  },
  categoryButton: {
    borderRadius: responsiveValue(6, 8, 10),
  },
  categoryButtonContent: {
    paddingVertical: spacing.xs,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  popularTag: {
    marginBottom: spacing.sm,
    backgroundColor: theme.colors.primaryContainer,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  quickActionCard: {
    flex: 1,
    ...getShadow(2),
    borderRadius: responsiveValue(8, 10, 12),
  },
  quickActionContent: {
    alignItems: 'center',
    padding: spacing.md,
  },
  quickActionTitle: {
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
    textAlign: 'center',
    fontWeight: '600',
    fontSize: fontSize.md,
  },
  quickActionDescription: {
    textAlign: 'center',
    color: theme.colors.textSecondary,
    fontSize: fontSize.sm,
  },
  contactCard: {
    margin: spacing.md,
    ...getShadow(4),
    borderRadius: responsiveValue(8, 10, 12),
    backgroundColor: theme.colors.primaryContainer,
  },
  contactContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactText: {
    marginLeft: spacing.md,
    flex: 1,
  },
  contactTitle: {
    color: theme.colors.primary,
    fontWeight: '600',
    marginBottom: spacing.xs,
    fontSize: fontSize.lg,
  },
  contactDescription: {
    color: theme.colors.onSurface,
    fontSize: fontSize.md,
  },
  contactButton: {
    backgroundColor: '#25D366',
    borderRadius: responsiveValue(6, 8, 10),
  },
  contactButtonContent: {
    paddingVertical: spacing.xs,
  },
  bottomSpacer: {
    height: spacing.lg,
  },
});