// src/screens/HomeScreen/HomeScreen.js - Çalışan hızlı erişim
import React from 'react';
import { View, StyleSheet, ScrollView, Dimensions, Linking, Alert } from 'react-native';
import { Card, Text, Button, Chip, Divider } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const categories = [
    {
      id: 'cerceveler',
      name: 'Çerçeveler',
      description: 'Modern ve klasik çerçeve çeşitleri',
      icon: 'image-outline',
      color: '#2E7D32',
      productCount: 150
    },
    {
      id: 'paspartolar',
      name: 'Paspartolar',
      description: 'Rengarenk paspartu çeşitleri',
      icon: 'layers-outline',
      color: '#8D6E63',
      productCount: 200
    },
    {
      id: 'aksesuarlar',
      name: 'Aksesuarlar',
      description: 'Dekoratif aksesuarlar ve yedek parçalar',
      icon: 'construct-outline',
      color: '#5D4037',
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

  // Öne çıkanlar - featured = true olan ürünler
  const handleFeaturedPress = () => {
    console.log('🌟 Öne çıkanlar aranıyor...');
    navigation.navigate('Search', { 
      initialQuery: '',
      filterType: 'featured'
    });
  };

  // Popüler ürünler - şimdilik en çok tag'e sahip olanlar
  const handlePopularPress = () => {
    console.log('🔥 Popüler ürünler aranıyor...');
    navigation.navigate('Search', { 
      initialQuery: '',
      filterType: 'popular'
    });
  };

  // WhatsApp ile iletişim
  const handleContactPress = () => {
    const phoneNumber = '905551234567'; // Telefon numaranız
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

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Section */}
      <LinearGradient
        colors={['#2E7D32', '#4CAF50']}
        style={styles.header}
      >
        <Text variant="headlineLarge" style={styles.headerTitle}>
          Kakule Katalog
        </Text>
        <Text variant="bodyLarge" style={styles.headerSubtitle}>
          500+ ürünle zengin koleksiyonumuz
        </Text>
      </LinearGradient>

      {/* Categories Section */}
      <View style={styles.section}>
        <Text variant="headlineSmall" style={styles.sectionTitle}>
          Kategoriler
        </Text>

        {categories.map((category) => (
          <Card key={category.id} style={styles.categoryCard}>
            <Card.Content>
              <View style={styles.categoryHeader}>
                <View style={styles.categoryInfo}>
                  <View style={styles.categoryIconContainer}>
                    <Ionicons
                      name={category.icon}
                      size={32}
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
                      textStyle={{ color: category.color }}
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
              >
                Ürünleri Gör
              </Button>
            </Card.Actions>
          </Card>
        ))}
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
              icon={() => <Ionicons name="search-outline" size={16} color={theme.colors.primary} />}
            >
              {tag}
            </Chip>
          ))}
        </View>
      </View>

      {/* Quick Actions - ÇALIŞAN */}
      <View style={styles.section}>
        <Text variant="headlineSmall" style={styles.sectionTitle}>
          Hızlı Erişim
        </Text>

        <View style={styles.quickActionsContainer}>
          <Card style={styles.quickActionCard} onPress={handleFeaturedPress}>
            <Card.Content style={styles.quickActionContent}>
              <Ionicons name="star" size={32} color="#FFD700" />
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
              <Ionicons name="trending-up" size={32} color="#FF5722" />
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

      {/* Contact Section - ÇALIŞAN WhatsApp */}
      <Card style={styles.contactCard}>
        <Card.Content>
          <View style={styles.contactContent}>
            <Ionicons name="chatbubble-ellipses" size={40} color="#25D366" />
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
            icon={() => <Ionicons name="chatbubble-ellipses" size={20} color="white" />}
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
  header: {
    padding: theme.spacing.xl,
    paddingTop: theme.spacing.lg,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  headerSubtitle: {
    color: 'white',
    textAlign: 'center',
    opacity: 0.9,
  },
  section: {
    padding: theme.spacing.md,
  },
  sectionTitle: {
    color: theme.colors.onBackground,
    marginBottom: theme.spacing.sm,
    fontWeight: '600',
  },
  sectionSubtitle: {
    color: theme.colors.onBackground,
    opacity: 0.7,
    marginBottom: theme.spacing.md,
  },
  categoryCard: {
    marginBottom: theme.spacing.md,
    elevation: 4,
    borderRadius: 12,
  },
  categoryHeader: {
    marginBottom: theme.spacing.sm,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  categoryIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  categoryText: {
    flex: 1,
  },
  categoryName: {
    color: theme.colors.onSurface,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  categoryDescription: {
    color: theme.colors.onSurface,
    opacity: 0.7,
    marginBottom: theme.spacing.sm,
  },
  productCountChip: {
    alignSelf: 'flex-start',
  },
  categoryButton: {
    borderRadius: 8,
  },
  categoryButtonContent: {
    paddingVertical: theme.spacing.xs,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  popularTag: {
    marginBottom: theme.spacing.sm,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  quickActionCard: {
    flex: 1,
    elevation: 2,
    borderRadius: 12,
  },
  quickActionContent: {
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  quickActionTitle: {
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
    fontWeight: '600',
  },
  quickActionDescription: {
    textAlign: 'center',
    opacity: 0.7,
  },
  contactCard: {
    margin: theme.spacing.md,
    elevation: 4,
    borderRadius: 12,
    backgroundColor: theme.colors.primaryContainer,
  },
  contactContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactText: {
    marginLeft: theme.spacing.md,
    flex: 1,
  },
  contactTitle: {
    color: theme.colors.primary,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  contactDescription: {
    color: theme.colors.onSurface,
    opacity: 0.8,
  },
  contactButton: {
    backgroundColor: '#25D366', // WhatsApp yeşili
  },
  bottomSpacer: {
    height: theme.spacing.lg,
  },
});