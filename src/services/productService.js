// src/services/productService.js - Debug versiyonu
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy
} from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from './fireBaseConfig';
import { sampleProducts } from '../data/sampleProducts';

class ProductService {
  constructor() {
    this.cacheKey = 'kakule_products';
    this.cacheExpiry = 30 * 60 * 1000;
  }

  // Cache functions (aynı)
  async getCachedData(key) {
    try {
      const cached = await AsyncStorage.getItem(key);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < this.cacheExpiry) {
          console.log('Data loaded from cache');
          return data;
        }
      }
      return null;
    } catch (error) {
      console.error('Cache read error:', error);
      return null;
    }
  }

  async setCachedData(key, data) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
      console.log('Data cached successfully');
    } catch (error) {
      console.error('Cache write error:', error);
    }
  }

  // DEBUG: Tüm ürünleri çek ve logla
  async getAllProducts() {
    try {
      console.log('🔍 Fetching ALL products from Firestore...');
      
      const productsRef = collection(db, 'products');
      const snapshot = await getDocs(productsRef);
      
      console.log(`📊 Total documents in products collection: ${snapshot.size}`);
      
      const products = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        console.log(`📄 Document ID: ${doc.id}`, data);
        products.push({
          id: doc.id,
          ...data
        });
      });

      console.log(`✅ Loaded ${products.length} products total`);
      return products;

    } catch (error) {
      console.error('❌ Firestore getAllProducts error:', error);
      return sampleProducts;
    }
  }

  // DEBUG: Kategori sorgusu
  async getProductsByCategory(categoryId) {
    try {
      console.log(`🔍 Fetching products for category: ${categoryId}`);
      
      // Önce tüm ürünleri kontrol et
      const allProducts = await this.getAllProducts();
      console.log('🔍 All products:', allProducts);
      
      // Manuel filtreleme yap
      const filtered = allProducts.filter(product => {
        console.log(`🔍 Checking product ${product.id}: category="${product.category}" vs "${categoryId}"`);
        return product.category === categoryId;
      });
      
      console.log(`✅ Found ${filtered.length} products in category ${categoryId}:`, filtered);
      return filtered;

    } catch (error) {
      console.error('❌ Category fetch error:', error);
      return sampleProducts.filter(product => product.category === categoryId);
    }
  }

  // Diğer metodlar aynı...
  async getProductById(productId) {
    const allProducts = await this.getAllProducts();
    return allProducts.find(product => product.id === productId);
  }

  async getFeaturedProducts() {
    const allProducts = await this.getAllProducts();
    return allProducts.filter(product => product.featured);
  }

  async clearCache() {
    try {
      await AsyncStorage.removeItem(this.cacheKey);
      console.log('Cache cleared');
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  }

  async checkConnectivity() {
    try {
      const testRef = doc(db, 'test', 'connectivity');
      await getDoc(testRef);
      return true;
    } catch (error) {
      console.log('Offline mode');
      return false;
    }
  }
}

export default new ProductService();