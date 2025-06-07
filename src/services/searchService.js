// src/services/searchService.js
class SearchService {
  constructor() {
    this.searchFields = [
      'name',           // Ürün adı
      'tags',          // Etiketler (en önemli)
      'description',   // Açıklama
      'specs.color',   // Renk bilgisi
      'specs.material' // Malzeme bilgisi
    ];
  }

  // Ana arama fonksiyonu
  searchProducts(products, query, filters = {}) {
    if (!query || query.length < 2) {
      return this.applyFilters(products, filters);
    }

    const searchTerms = this.normalizeQuery(query);
    const results = [];

    products.forEach(product => {
      const score = this.calculateRelevanceScore(product, searchTerms);
      if (score > 0) {
        results.push({ ...product, relevanceScore: score });
      }
    });

    // Relevance skoruna göre sırala
    const sortedResults = results.sort((a, b) => b.relevanceScore - a.relevanceScore);
    
    // Filtreleri uygula
    return this.applyFilters(sortedResults, filters);
  }

  // Arama terimlerini normalize et
  normalizeQuery(query) {
    return query
      .toLowerCase()
      .trim()
      .split(/\s+/)
      .filter(term => term.length > 1);
  }

  // Relevance skoru hesapla
  calculateRelevanceScore(product, searchTerms) {
    let score = 0;

    searchTerms.forEach(term => {
      // Etiketlerde tam eşleşme (en yüksek skor)
      if (product.tags?.some(tag => tag.toLowerCase().includes(term))) {
        score += 10;
      }

      // Ürün adında eşleşme
      if (product.name?.toLowerCase().includes(term)) {
        score += 8;
      }

      // Renk eşleşmesi
      if (product.specs?.color?.toLowerCase().includes(term)) {
        score += 7;
      }

      // Malzeme eşleşmesi
      if (product.specs?.material?.toLowerCase().includes(term)) {
        score += 6;
      }

      // Açıklamada eşleşme
      if (product.description?.toLowerCase().includes(term)) {
        score += 3;
      }

      // Kısa açıklamada eşleşme
      if (product.shortDescription?.toLowerCase().includes(term)) {
        score += 4;
      }
    });

    return score;
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
}

export default new SearchService();