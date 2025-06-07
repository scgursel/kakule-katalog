
// src/constants/dataSchema.js
export const productSchema = {
  id: "string",           // Benzersiz ürün ID'si
  name: "string",         // Ürün adı
  category: "string",     // "cerceveler" | "paspartolar" | "aksesuarlar"
  description: "string",  // Detaylı açıklama
  shortDescription: "string", // Kısa açıklama (liste görünümü için)
  tags: ["string"],       // Aranabilir etiketler ["yeşil", "ahşap", "modern"]
  images: [{
    url: "string",        // CDN/bulut URL'si
    thumbnail: "string",  // Küçük boyutlu önizleme URL'si
    alt: "string",        // Erişilebilirlik için açıklama
    isPrimary: "boolean"  // Ana görsel mi?
  }],
  specs: {               // Teknik özellikler
    material: "string",   // "ahşap", "metal", "plastik"
    color: "string",      // Ana renk
    dimensions: "string", // Boyutlar
    weight: "string"      // Ağırlık (isteğe bağlı)
  },
  availability: "boolean", // Stokta var mı?
  featured: "boolean",     // Öne çıkan ürün mü?
  createdAt: "string",     // ISO date
  updatedAt: "string"      // ISO date
};

// Örnek veri:
export const sampleProduct = {
  id: "cerc-001",
  name: "Vintage Ahşap Çerçeve",
  category: "cerceveler",
  description: "El yapımı vintage ahşap çerçeve. Klasik tasarımı ile her ortama uyum sağlar.",
  shortDescription: "El yapımı vintage ahşap çerçeve",
  tags: ["vintage", "ahşap", "kahverengi", "klasik", "el-yapımı"],
  images: [
    {
      url: "https://cdn.kakule.com/products/cerc-001/main.jpg",
      thumbnail: "https://cdn.kakule.com/products/cerc-001/thumb.jpg",
      alt: "Vintage ahşap çerçeve ön görünüm",
      isPrimary: true
    },
    {
      url: "https://cdn.kakule.com/products/cerc-001/side.jpg",
      thumbnail: "https://cdn.kakule.com/products/cerc-001/side-thumb.jpg",
      alt: "Vintage ahşap çerçeve yan görünüm",
      isPrimary: false
    }
  ],
  specs: {
    material: "ahşap",
    color: "kahverengi",
    dimensions: "20x30 cm",
    weight: "500g"
  },
  availability: true,
  featured: true,
  createdAt: "2024-01-15T10:30:00Z",
  updatedAt: "2024-01-15T10:30:00Z"
};