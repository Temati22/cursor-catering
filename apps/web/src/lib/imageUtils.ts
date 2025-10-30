/**
 * Утилиты для работы с изображениями в проекте Hi-catering
 */

// Helper function to get absolute URL for images
export const getImageUrl = (url: string): string => {
  if (!url) return '';
  
  if (url.startsWith('http')) {
    return url;
  }
  
  // В продакшене замените на ваш реальный API URL
  return `http://localhost:1337${url}`;
};

// Интерфейс для изображений Strapi
export interface StrapiImageData {
  url: string;
  alternativeText?: string;
  width?: number;
  height?: number;
  formats?: {
    thumbnail?: { url: string; width: number; height: number };
    small?: { url: string; width: number; height: number };
    medium?: { url: string; width: number; height: number };
    large?: { url: string; width: number; height: number };
  };
}

// Функция для получения оптимального размера изображения
export const getOptimalImageUrl = (
  imageData: StrapiImageData | undefined | null,
  preferredSize: 'thumbnail' | 'small' | 'medium' | 'large' | 'original' = 'medium'
): string => {
  if (!imageData?.url) return '';

  // Если запросили оригинал или нет форматов
  if (preferredSize === 'original' || !imageData.formats) {
    return getImageUrl(imageData.url);
  }

  // Попробуем найти нужный размер
  const format = imageData.formats[preferredSize];
  if (format?.url) {
    return getImageUrl(format.url);
  }

  // Fallback к оригиналу если размер не найден
  return getImageUrl(imageData.url);
};

// Функция для проверки существования изображения
export const hasValidImage = (imageData: StrapiImageData | undefined | null): boolean => {
  return !!(imageData?.url);
};

// Получение alt текста для изображения
export const getImageAlt = (imageData: StrapiImageData | undefined | null, fallback = 'Изображение'): string => {
  return imageData?.alternativeText || fallback;
};

// Тип для fallback изображений
export type FallbackImage = {
  url: string;
  alt: string;
};

// Предустановленные fallback изображения проекта
export const FALLBACK_IMAGES: Record<string, FallbackImage> = {
  hero: { url: '/Image (1).png', alt: 'Десерты и кейтеринг' },
  dish: { url: '/placeholder.svg', alt: 'Блюдо' },
  default: { url: '/placeholder.svg', alt: 'Изображение' },
};

// Функция для получения изображения с fallback
export const getImageWithFallback = (
  imageData: StrapiImageData | undefined | null,
  fallbackType: keyof typeof FALLBACK_IMAGES = 'default',
  preferredSize: 'thumbnail' | 'small' | 'medium' | 'large' | 'original' = 'medium'
): { url: string; alt: string } => {
  
  if (hasValidImage(imageData)) {
    return {
      url: getOptimalImageUrl(imageData, preferredSize),
      alt: getImageAlt(imageData)
    };
  }

  const fallback = FALLBACK_IMAGES[fallbackType];
  return fallback;
};

// Функция для создания CSS background с оверлеем
export const createBackgroundWithOverlay = (
  imageUrl: string,
  overlayColor: string = 'rgba(0, 0, 0, 0.4)'
): string => {
  return `linear-gradient(${overlayColor}, ${overlayColor}), url(${imageUrl})`;
};

// Функция для создания градиентного оверлея
export const createGradientOverlay = (
  imageUrl: string,
  gradientDirection: 'to bottom' | 'to top' | 'to right' | 'to left' | string = 'to bottom',
  startColor: string = 'transparent',
  endColor: string = 'rgba(0, 0, 0, 0.7)',
  gradientStop: number = 50
): string => {
  return `linear-gradient(${gradientDirection}, ${startColor} 0%, ${startColor} ${gradientStop}%, ${endColor} 100%), url(${imageUrl})`;
};

// Функция для радиального градиента
export const createRadialOverlay = (
  imageUrl: string,
  centerColor: string = 'transparent',
  edgeColor: string = 'rgba(0, 0, 0, 0.7)',
  centerSize: number = 30
): string => {
  return `radial-gradient(circle at center, ${centerColor} ${centerSize}%, ${edgeColor} 70%), url(${imageUrl})`;
};

// Функция для создания background с цветом как дополнением (не наложением)
export const createBackgroundWithColor = (
  imageUrl: string,
  backgroundColor: string
): string => {
  return `url(${imageUrl}), ${backgroundColor}`;
};

// Удобная функция для создания background из Strapi изображения
export const createStrapiBackground = (
  imageData: StrapiImageData | undefined | null,
  options: {
    fallbackType?: keyof typeof FALLBACK_IMAGES;
    preferredSize?: 'thumbnail' | 'small' | 'medium' | 'large' | 'original';
    overlayColor?: string;
    overlayType?: 'solid' | 'gradient' | 'radial' | 'none' | 'complement';
    gradientDirection?: 'to bottom' | 'to top' | 'to right' | 'to left' | string;
    gradientStop?: number;
  } = {}
): string => {
  const {
    fallbackType = 'default',
    preferredSize = 'medium',
    overlayColor = 'rgba(0, 0, 0, 0.4)',
    overlayType = 'solid',
    gradientDirection = 'to bottom',
    gradientStop = 50
  } = options;

  const image = getImageWithFallback(imageData, fallbackType, preferredSize);

  switch (overlayType) {
    case 'solid':
      return createBackgroundWithOverlay(image.url, overlayColor);
    case 'gradient':
      return createGradientOverlay(image.url, gradientDirection, 'transparent', overlayColor, gradientStop);
    case 'radial':
      return createRadialOverlay(image.url, 'transparent', overlayColor);
    case 'complement':
      return createBackgroundWithColor(image.url, overlayColor);
    case 'none':
    default:
      return `url(${image.url})`;
  }
};

// Функция для создания полного background с позицией, размером и повтором
export const createFullBackground = (
  imageData: StrapiImageData | undefined | null,
  options: {
    fallbackType?: keyof typeof FALLBACK_IMAGES;
    preferredSize?: 'thumbnail' | 'small' | 'medium' | 'large' | 'original';
    overlayColor?: string;
    overlayType?: 'solid' | 'gradient' | 'radial' | 'none' | 'complement';
    position?: string;
    size?: string;
    repeat?: string;
    gradientDirection?: 'to bottom' | 'to top' | 'to right' | 'to left' | string;
    gradientStop?: number;
  } = {}
): string => {
  const {
    position = 'center',
    size = 'cover',
    repeat = 'no-repeat',
    overlayType = 'complement',
    overlayColor,
    ...backgroundOptions
  } = options;

  const image = getImageWithFallback(imageData, options.fallbackType || 'default', options.preferredSize || 'medium');
  
  // Создаём правильный CSS background shorthand
  if (overlayType === 'complement') {
    // Для complement: изображение + цвет в правильном порядке
    const bgParts = [];
    bgParts.push(`url(${image.url}) ${repeat} ${position} / ${size}`);
    if (overlayColor) {
      bgParts.push(overlayColor);
    }
    return bgParts.join(', ');
  } else {
    // Для overlay типов используем существующую логику
    const backgroundImage = createStrapiBackground(imageData, { ...backgroundOptions, overlayType, overlayColor });
    
    // Если это простой url или градиент, добавляем позицию и размер
    if (backgroundImage.startsWith('url(') || backgroundImage.startsWith('linear-gradient(') || backgroundImage.startsWith('radial-gradient(')) {
      return `${backgroundImage} ${repeat} ${position} / ${size}`;
    }
    
    // Для сложных background (несколько слоев) возвращаем как есть
    return backgroundImage;
  }
};
