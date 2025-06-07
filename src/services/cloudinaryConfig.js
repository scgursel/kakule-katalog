// src/services/cloudinaryConfig.js
import { Cloudinary } from 'cloudinary-react-native';

// Cloudinary yapılandırması
export const cloudinary = new Cloudinary({
  cloud: {
    cloudName: 'YOUR_CLOUD_NAME' // Dashboard'dan alın
  }
});

// Görsel URL oluşturma fonksiyonları
export const getImageUrl = (publicId, transformations = {}) => {
  const {
    width = 800,
    height = 600,
    quality = 'auto',
    format = 'auto'
  } = transformations;
  
  return cloudinary.url(publicId, {
    transformation: [
      { width, height, crop: 'fill' },
      { quality, fetch_format: format }
    ]
  });
};

export const getThumbnailUrl = (publicId) => {
  return cloudinary.url(publicId, {
    transformation: [
      { width: 300, height: 200, crop: 'fill' },
      { quality: 'auto', fetch_format: 'auto' }
    ]
  });
};

// Kategori bazında URL helper'ları
export const getProductImageUrl = (category, productId, imageName, size = 'normal') => {
  const publicId = `products/${category}/${productId}/${imageName}`;
  
  if (size === 'thumbnail') {
    return getThumbnailUrl(publicId);
  }
  
  return getImageUrl(publicId, { width: 800, height: 600 });
};