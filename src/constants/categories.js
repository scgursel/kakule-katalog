// src/constants/categories.js
export const categories = {
  cerceveler: {
    id: "cerceveler",
    name: "Çerçeveler",
    description: "Modern ve klasik çerçeve çeşitleri",
    icon: "image-outline",
    color: "#2E7D32",
    subcategories: [
      { id: "ahşap", name: "Ahşap Çerçeveler" },
      { id: "metal", name: "Metal Çerçeveler" },
      { id: "plastik", name: "Plastik Çerçeveler" }
    ]
  },
  paspartolar: {
    id: "paspartolar",
    name: "Paspartolar", 
    description: "Rengarenk paspartu çeşitleri",
    icon: "layers-outline",
    color: "#8D6E63",
    subcategories: [
      { id: "renkli", name: "Renkli Paspartolar" },
      { id: "beyaz", name: "Beyaz Paspartolar" },
      { id: "tekstürlu", name: "Tekstürlü Paspartolar" }
    ]
  },
  aksesuarlar: {
    id: "aksesuarlar",
    name: "Aksesuarlar",
    description: "Dekoratif aksesuarlar ve yedek parçalar",
    icon: "construct-outline", 
    color: "#5D4037",
    subcategories: [
      { id: "askı", name: "Askı Sistemleri" },
      { id: "köşe", name: "Köşe Koruyucular" },
      { id: "cam", name: "Camlar" }
    ]
  }
};