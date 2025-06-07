// src/services/searchService.js - Geliştirilmiş versiyon
class SearchService {
  constructor() {
    this.searchFields = [
      'name',           // Ürün adı
      'productCode',    // Ürün kodu
      'tags',          // Etiketler (en önemli)
      'description',   // Açıklama
      'specs.color',   // Renk bilgisi
      'specs.material', // Malzeme bilgisi
      'specs.width'    // Genişlik bilgisi
    ];
  }

  // Ana arama fonksiyonu
  searchProducts(products, query, filters = {}) {
    console.log('🔍 SearchService: Searching with query:', query, 'filters:', filters);
    
    if (!query || query.length < 1) {
      const filtered = this.applyFilters(products, filters);
      console.log('✅ No query, returning filtered products:', filtered.length);
      return filtered;
    }

    const searchTerms = this.normalizeQuery(query);
    console.log('🔍 Normalized search terms:', searchTerms);
    
    const results = [];

    products.forEach(product => {
      const score = this.calculateRelevanceScore(product, searchTerms);
      if (score > 0) {
        results.push({ ...product, relevanceScore: score });
      }
    });

    console.log('🔍 Found', results.length, 'products with scores');

    // Relevance skoruna göre sırala
    const sortedResults = results.sort((a, b) => b.relevanceScore - a.relevanceScore);
    
    // Filtreleri uygula
    const finalResults = this.applyFilters(sortedResults, filters);
    console.log('✅ Final results after filters:', finalResults.length);
    
    return finalResults;
  }

  // Arama terimlerini normalize et
  normalizeQuery(query) {
    return query
      .toLowerCase()
      .trim()
      .split(/\s+/)
      .filter(term => term.length > 0); // En az 1 karakter
  }

  // Gelişmiş relevance skoru hesapla
  calculateRelevanceScore(product, searchTerms) {
    let score = 0;

    searchTerms.forEach(term => {
      // 1. Etiketlerde tam eşleşme (en yüksek skor)
      if (product.tags?.some(tag => tag.toLowerCase() === term)) {
        score += 15; // Tam eşleşme
      } else if (product.tags?.some(tag => tag.toLowerCase().includes(term))) {
        score += 10; // Kısmi eşleşme
      }

      // 2. Ürün adında eşleşme
      if (product.name?.toLowerCase().includes(term)) {
        score += 8;
      }

      // 3. Ürün kodunda eşleşme (yeni)
      if (product.productCode?.toLowerCase().includes(term)) {
        score += 12;
      }

      // 4. Specs içinde eşleşmeler
      if (product.specs?.color?.toLowerCase().includes(term)) {
        score += 7;
      }
      if (product.specs?.material?.toLowerCase().includes(term)) {
        score += 6;
      }
      if (product.specs?.width?.toLowerCase().includes(term)) {
        score += 9; // Genişlik önemli (20mm gibi)
      }

      // 5. Açıklamalarda eşleşme
      if (product.description?.toLowerCase().includes(term)) {
        score += 3;
      }
      if (product.shortDescription?.toLowerCase().includes(term)) {
        score += 4;
      }

      // 6. Özel kelime eşleştirmeleri
      this.handleSpecialMatches(product, term, (points) => {
        score += points;
      });
    });

    return score;
  }

  // Özel kelime eşleştirmeleri (ceviz -> ezmeli ceviz gibi)
  handleSpecialMatches(product, term, addScore) {
    const specialMatches = {
      'ceviz': ['ezmeli ceviz', 'ezmeli̇ cevi̇z', 'ceviz', 'ceviz rengi'],
      'yeşil': ['yeşil', 'koyu yeşil', 'açık yeşil', 'çimen yeşil'],
      'ahşap': ['ahşap', 'doğal ahşap', 'masif ahşap'],
      'metal': ['metal', 'çelik', 'alüminyum', 'demir'],
      'altin': ['altin', 'altın', 'parlak altin', 'parlak altın'],
      'mm': ['mm', 'milimetre']
    };

    Object.entries(specialMatches).forEach(([key, variants]) => {
      if (term.includes(key) || key.includes(term)) {
        variants.forEach(variant => {
          if (product.tags?.some(tag => tag.toLowerCase().includes(variant.toLowerCase()))) {
            addScore(5); // Özel eşleşme bonusu
          }
        });
      }
    });

    // Sayısal eşleştirmeler (20 -> 20mm)
    if (/^\d+$/.test(term)) {
      const number = term;
      if (product.tags?.some(tag => tag.includes(`${number}mm`)) ||
          product.specs?.width?.includes(`${number}mm`)) {
        addScore(8);
      }
    }
  }

  // Filtreleri uygula
  applyFilters(products, filters) {
    let filtered = [...products];

    // Kategori filtresi
    if (filters.category) {
      filtered = filtered.filter(p => p.category === filters.category);
    }

    // Renk filtresi
    if (filters.color) {
      filtered = filtered.filter(p => 
        p.specs?.color?.toLowerCase() === filters.color.toLowerCase()
      );
    }

    // Malzeme filtresi
    if (filters.material) {
      filtered = filtered.filter(p => 
        p.specs?.material?.toLowerCase() === filters.material.toLowerCase()
      );
    }

    // Stok durumu filtresi
    if (filters.availability !== undefined) {
      filtered = filtered.filter(p => p.availability === filters.availability);
    }

    // Öne çıkan ürünler filtresi
    if (filters.featured) {
      filtered = filtered.filter(p => p.featured === true);
    }

    return filtered;
  }

  // Etiket önerileri getir
  getTagSuggestions(products, query) {
    if (!query || query.length < 2) return [];

    const allTags = new Set();
    products.forEach(product => {
      product.tags?.forEach(tag => allTags.add(tag));
    });

    const normalizedQuery = query.toLowerCase();
    return Array.from(allTags)
      .filter(tag => tag.toLowerCase().includes(normalizedQuery))
      .slice(0, 5); // En fazla 5 öneri
  }

  // Popüler etiketler
  getPopularTags(products, limit = 10) {
    const tagCount = {};
    
    products.forEach(product => {
      product.tags?.forEach(tag => {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      });
    });

    return Object.entries(tagCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .map(([tag]) => tag);
  }

  // Debug: Hangi alanların eşleştiğini göster
  debugSearch(product, searchTerms) {
    const matches = [];
    
    searchTerms.forEach(term => {
      if (product.tags?.some(tag => tag.toLowerCase().includes(term))) {
        matches.push(`tag: ${term}`);
      }
      if (product.name?.toLowerCase().includes(term)) {
        matches.push(`name: ${term}`);
      }
      if (product.productCode?.toLowerCase().includes(term)) {
        matches.push(`code: ${term}`);
      }
      if (product.specs?.color?.toLowerCase().includes(term)) {
        matches.push(`color: ${term}`);
      }
      if (product.specs?.material?.toLowerCase().includes(term)) {
        matches.push(`material: ${term}`);
      }
      if (product.specs?.width?.toLowerCase().includes(term)) {
        matches.push(`width: ${term}`);
      }
    });

    return matches;
  }
}

export default new SearchService();