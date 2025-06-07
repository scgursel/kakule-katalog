// src/services/productService.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sampleProducts } from '../data/sampleProducts';

class ProductService {
  constructor() {
    this.storageKey = 'kakule_products';
    this.cacheExpiry = 24 * 60 * 60 * 1000; // 24 saat
  }
    // Kategori bazında ürünler
  async getProductsByCategory(categoryId) {
    const allProducts = await this.getAllProducts();
    return allProducts.filter(product => product.category === categoryId);
  }

  // Tüm ürünleri getir
  async getAllProducts() {
    try {
      // Önce cache'den kontrol et
      const cachedData = await AsyncStorage.getItem(this.storageKey);
      
      if (cachedData) {
        const { products, timestamp } = JSON.parse(cachedData);
        const now = Date.now();
        
        // Cache hala geçerli mi?
        if (now - timestamp < this.cacheExpiry) {
          return products;
        }
      }
      
      // Cache yoksa veya eskiyse, sample data kullan
      // Gerçek uygulamada burada API çağrısı yapılır
      const products = sampleProducts;
      
      // Cache'e kaydet
      await AsyncStorage.setItem(this.storageKey, JSON.stringify({
        products,
        timestamp: Date.now()
      }));
      
      return products;
    } catch (error) {
      console.error('Ürünler alınırken hata:', error);
      return sampleProducts; // Fallback
    }
  }



  // ID ile ürün getir
  async getProductById(productId) {
    const allProducts = await this.getAllProducts();
    return allProducts.find(product => product.id === productId);
  }

  // Öne çıkan ürünler
  async getFeaturedProducts() {
    const allProducts = await this.getAllProducts();
    return allProducts.filter(product => product.featured);
  }

  // Cache temizle
  async clearCache() {
    await AsyncStorage.removeItem(this.storageKey);
  }
}

export default new ProductService();