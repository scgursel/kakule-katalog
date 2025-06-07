// src/services/productService.js - Rowy uyumlu versiyon
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

  // Firebase'den gelen veriyi normalize et (Rowy sonrası)
  normalizeFirebaseData(rawData) {
    try {
      console.log('🔄 Normalizing Firebase document:', Object.keys(rawData));
      
      // Firebase'den gelen veriler zaten doğru formatta
      const normalized = {
        id: rawData.productCode || rawData.name?.replace(/\s+/g, '-') || `product-${Date.now()}`,
        name: rawData.name || '',
        productCode: rawData.productCode || '',
        category: rawData.category || '',
        description: rawData.description || '',
        shortDescription: rawData.shortDescription || '',
        tags: rawData.tags || [], // Firebase'de zaten array
        images: rawData.images || [], // Firebase'de zaten array
        specs: {
          color: rawData.color || '',
          width: rawData.width || '',
          material: this.extractMaterial(rawData),
          profileType: this.extractProfileType(rawData)
        },
        availability: rawData.availability || false, // Firebase'de zaten boolean
        featured: rawData.featured || false, // Firebase'de zaten boolean
        unitType: rawData.unitType || 'adet',
        customSizing: rawData.unitType === 'metre',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      console.log('✅ Normalized Firebase product:', {
        id: normalized.id,
        name: normalized.name,
        category: normalized.category,
        tags: normalized.tags
      });

      return normalized;
    } catch (error) {
      console.error('❌ Firebase normalize error:', error, 'rawData:', rawData);
      return null;
    }
  }

  // Malzeme tipini çıkar (tags'den veya description'dan)
  extractMaterial(rawData) {
    const text = `${rawData.description || ''} ${(rawData.tags || []).join(' ')}`.toLowerCase();
    
    if (text.includes('ahşap') || text.includes('masif')) return 'ahşap';
    if (text.includes('metal') || text.includes('çelik')) return 'metal';
    if (text.includes('plastik') || text.includes('pvc')) return 'plastik';
    if (text.includes('mdf')) return 'mdf';
    
    return 'diğer';
  }

  // Profil tipini çıkar (tags'den veya description'dan)
  extractProfileType(rawData) {
    const text = `${rawData.description || ''} ${(rawData.tags || []).join(' ')}`.toLowerCase();
    
    if (text.includes(' b ') || text.includes('b profil')) return 'B';
    if (text.includes(' g ') || text.includes('g profil')) return 'G';
    if (text.includes(' a ') || text.includes('a profil')) return 'A';
    if (text.includes(' c ') || text.includes('c profil')) return 'C';
    
    return '';
  }

  // Cache functions
  async getCachedData(key) {
    try {
      const cached = await AsyncStorage.getItem(key);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < this.cacheExpiry) {
          console.log('✅ Data loaded from cache');
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
      console.log('✅ Data cached successfully');
    } catch (error) {
      console.error('Cache write error:', error);
    }
  }

  // Tüm ürünleri çek ve normalize et
  async getAllProducts() {
    try {
      console.log('🔍 Fetching ALL products from Firestore...');
      
      const productsRef = collection(db, 'products');
      const snapshot = await getDocs(productsRef);
      
      console.log(`📊 Total documents in products collection: ${snapshot.size}`);
      
      const products = [];
      snapshot.forEach((doc) => {
        const rawData = doc.data();
        
        console.log(`📄 Firebase document ID: ${doc.id}`);
        console.log('🔍 Document fields:', Object.keys(rawData));
        
        // Firebase verisini normalize et
        const normalized = this.normalizeFirebaseData(rawData);
        if (normalized) {
          products.push(normalized);
          console.log(`✅ Added product: ${normalized.name} | Category: ${normalized.category}`);
        } else {
          console.log(`❌ Failed to normalize: ${doc.id}`);
        }
      });

      console.log(`✅ Normalized ${products.length} products total`);
      
      return products;

    } catch (error) {
      console.error('❌ Firestore getAllProducts error:', error);
      return sampleProducts;
    }
  }

  // Kategori bazında ürünler - Debug eklenmiş
  async getProductsByCategory(categoryId) {
    try {
      console.log(`🔍 Fetching products for category: ${categoryId}`);
      
      const allProducts = await this.getAllProducts();
      console.log(`📊 Total products loaded: ${allProducts.length}`);
      
      // Her ürünün kategorisini kontrol et
      allProducts.forEach(product => {
        console.log(`📄 Product: ${product.name} | Category: "${product.category}" | ID: ${product.id}`);
      });
      
      const filtered = allProducts.filter(product => {
        const match = product.category === categoryId;
        console.log(`🔍 "${product.name}": category="${product.category}" === "${categoryId}" ? ${match}`);
        return match;
      });
      
      console.log(`✅ Found ${filtered.length} products in category "${categoryId}"`);
      console.log('🔍 Filtered products:', filtered.map(p => ({ name: p.name, category: p.category })));
      
      return filtered;

    } catch (error) {
      console.error('❌ Category fetch error:', error);
      return sampleProducts.filter(product => product.category === categoryId);
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
    try {
      await AsyncStorage.removeItem(this.cacheKey);
      console.log('✅ Cache cleared');
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  }

  // Debug: Veri yapısını kontrol et
  async debugDataStructure() {
    try {
      console.log('🔍 DEBUGGING DATA STRUCTURE...');
      
      const allProducts = await this.getAllProducts();
      
      if (allProducts.length > 0) {
        const firstProduct = allProducts[0];
        console.log('📄 SAMPLE NORMALIZED PRODUCT:');
        console.log(JSON.stringify(firstProduct, null, 2));
        
        console.log('🔍 CHECKING NORMALIZED FIELDS:');
        console.log('- ID:', firstProduct.id);
        console.log('- Name:', firstProduct.name);
        console.log('- Category:', firstProduct.category);
        console.log('- Tags:', firstProduct.tags);
        console.log('- Tags type:', typeof firstProduct.tags);
        console.log('- Tags is array:', Array.isArray(firstProduct.tags));
        console.log('- Images:', firstProduct.images);
        console.log('- Specs:', firstProduct.specs);
        
        // Tags kontrolü
        if (firstProduct.tags && Array.isArray(firstProduct.tags)) {
          console.log('🏷️ INDIVIDUAL TAGS:');
          firstProduct.tags.forEach((tag, index) => {
            console.log(`  ${index}: "${tag}" (type: ${typeof tag})`);
          });
        }
        
        return firstProduct;
      } else {
        console.log('❌ No products found');
        return null;
      }
    } catch (error) {
      console.error('❌ Debug error:', error);
      return null;
    }
  }

  // Bağlantı kontrolü
  async checkConnectivity() {
    try {
      const testRef = doc(db, 'test', 'connectivity');
      await getDoc(testRef);
      return true;
    } catch (error) {
      console.log('📱 Offline mode');
      return false;
    }
  }
}

export default new ProductService();