// src/data/sampleProducts.js - Profil çerçeve verisi
export const sampleProducts = [
  // Çerçeve Profilleri
  {
    id: "20G-CEVIZ",
    productCode: "20G CEVİZ",
    name: "20mm Ceviz Çerçeve Profili", 
    category: "cerceveler",
    description: "20mm genişliğinde ceviz renkli ahşap çerçeve profili. Müşteri tarafından istenilen boyutlarda üretilebilir. Klasik ve şık görünümü ile her tür fotoğraf ve tablo için uygundur.",
    shortDescription: "20mm ceviz ahşap profil",
    tags: ["20mm", "ceviz", "ahşap", "klasik", "G-profil", "doğal"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800", // Gerçek fotoğrafınızla değiştirilecek
        thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300",
        alt: "20G Ceviz çerçeve profili",
        isPrimary: true
      },
      {
        url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800",
        thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300", 
        alt: "20G Ceviz profil kesit görünümü",
        isPrimary: false
      }
    ],
    specs: {
      width: "20mm",          // Genişlik
      profileType: "G",       // Profil tipi
      material: "ahşap",      // Malzeme
      color: "ceviz",        // Renk
      finish: "mat",         // Yüzey
      thickness: "15mm"      // Kalınlık (varsa)
    },
    availability: true,
    featured: true,
    unitType: "metre",        // Satış birimi
    customSizing: true,       // Özel boyut yapılır mı?
    createdAt: "2024-01-15T10:30:00Z"
  },
  {
    id: "47C-YESIL",
    productCode: "47C YEŞİL",
    name: "47mm Yeşil Çerçeve Profili",
    category: "cerceveler", 
    description: "47mm genişliğinde yeşil renkli çerçeve profili. Geniş profil yapısı ile büyük tablolar ve posterlere ideal. Modern ve canlı görünümü ile dekoratif etkisi yüksek.",
    shortDescription: "47mm yeşil geniş profil",
    tags: ["47mm", "yeşil", "geniş", "modern", "C-profil", "dekoratif"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800", // Gerçek fotoğrafınızla değiştirilecek
        thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300",
        alt: "47C Yeşil çerçeve profili", 
        isPrimary: true
      }
    ],
    specs: {
      width: "47mm",
      profileType: "C", 
      material: "mdf",      // veya ahşap
      color: "yeşil",
      finish: "parlak",     // veya mat
      thickness: "20mm"
    },
    availability: true,
    featured: false,
    unitType: "metre",
    customSizing: true,
    createdAt: "2024-01-16T11:45:00Z"
  },
  {
    id: "15A-BEYAZ",
    productCode: "15A BEYAZ", 
    name: "15mm Beyaz İnce Çerçeve Profili",
    category: "cerceveler",
    description: "15mm genişliğinde beyaz renkli ince çerçeve profili. Minimalist tasarımlar için ideal. Küçük fotoğraflar ve sertifikalar için uygundur.",
    shortDescription: "15mm beyaz ince profil",
    tags: ["15mm", "beyaz", "ince", "minimalist", "A-profil", "küçük"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800",
        thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300",
        alt: "15A Beyaz ince çerçeve profili",
        isPrimary: true
      }
    ],
    specs: {
      width: "15mm",
      profileType: "A",
      material: "plastik",
      color: "beyaz", 
      finish: "mat",
      thickness: "8mm"
    },
    availability: true,
    featured: false,
    unitType: "metre",
    customSizing: true,
    createdAt: "2024-01-17T09:20:00Z"
  },

  // Paspartolar - Bu kısım değişmez, çünkü zaten özel boyut yapılıyor
  {
    id: "pasp-beyaz-mat",
    productCode: "PASP-BEYAZ-MAT",
    name: "Beyaz Mat Paspartu",
    category: "paspartolar",
    description: "Premium kalitede beyaz mat paspartu. İstenilen boyutlarda kesilir. Fotoğraf ve sanat eserlerinizi öne çıkarır.",
    shortDescription: "Beyaz mat paspartu kartonu",
    tags: ["beyaz", "mat", "premium", "kesim", "özel-boyut"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800",
        thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300",
        alt: "Beyaz mat paspartu",
        isPrimary: true
      }
    ],
    specs: {
      thickness: "2mm",
      material: "karton",
      color: "beyaz",
      finish: "mat",
      acidFree: true        // Asitsiz
    },
    availability: true,
    featured: true,
    unitType: "adet",       // Özel boyut kesim
    customSizing: true,
    createdAt: "2024-01-17T09:20:00Z"
  },

  // Aksesuarlar
  {
    id: "ask-sistem-001",
    productCode: "ASK-DUVAR-METAL",
    name: "Metal Duvar Askı Sistemi",
    category: "aksesuarlar",
    description: "Dayanıklı metal duvar askı sistemi. Farklı boyutlardaki çerçeveler için uygun.",
    shortDescription: "Metal duvar askı sistemi",
    tags: ["askı", "duvar", "metal", "güvenli", "montaj"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800",
        thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300",
        alt: "Metal duvar askı sistemi",
        isPrimary: true
      }
    ],
    specs: {
      material: "metal",
      color: "gümüş",
      weightCapacity: "5kg",  // Taşıma kapasitesi
      mounting: "duvar"       // Montaj tipi
    },
    availability: true,
    featured: false,
    unitType: "takım",
    customSizing: false,    // Aksesuar için sabit boyut
    createdAt: "2024-01-18T14:10:00Z"
  }
];

// Genişlik bazında filtreleme
export const getProductsByWidth = (width) => {
  return sampleProducts.filter(product => 
    product.specs?.width === `${width}mm`
  );
};

// Profil tipi bazında filtreleme  
export const getProductsByProfileType = (profileType) => {
  return sampleProducts.filter(product => 
    product.specs?.profileType === profileType
  );
};

// Renk bazında filtreleme
export const getProductsByColor = (color) => {
  return sampleProducts.filter(product => 
    product.specs?.color?.toLowerCase() === color.toLowerCase()
  );
};

// Ürün kodu ile arama
export const getProductByCode = (productCode) => {
  return sampleProducts.find(product => 
    product.productCode === productCode
  );
};