import axios from 'axios';

const stripTrailingSlash = (url: string) => url.replace(/\/+$/, '');

const ensureApiPath = (baseUrl: string) => {
  const normalized = stripTrailingSlash(baseUrl);
  return normalized.endsWith('/api') ? normalized : `${normalized}/api`;
};

const getPublicApiUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return stripTrailingSlash(process.env.NEXT_PUBLIC_API_URL);
  }

  if (process.env.NEXT_PUBLIC_STRAPI_URL) {
    return ensureApiPath(process.env.NEXT_PUBLIC_STRAPI_URL);
  }

  return 'http://localhost:1337/api';
};

const getInternalApiUrl = () => {
  const internalBase = process.env.STRAPI_INTERNAL_URL;
  if (!internalBase) {
    return null;
  }
  return ensureApiPath(internalBase);
};

// Get API URL with fallback
const getApiUrl = () => {
  const publicUrl = getPublicApiUrl();

  if (typeof window === 'undefined') {
    return getInternalApiUrl() || publicUrl;
  }

  return publicUrl;
};

const API_BASE_URL = getApiUrl();
const STRAPI_URL = (() => {
  const publicBase =
    process.env.NEXT_PUBLIC_STRAPI_URL ||
    API_BASE_URL.replace(/\/api$/, '');

  if (typeof window === 'undefined') {
    const internalBase = process.env.STRAPI_INTERNAL_URL;
    if (internalBase) {
      return stripTrailingSlash(internalBase);
    }
  }

  return stripTrailingSlash(publicBase);
})();


const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout (increased for large data requests)
  withCredentials: false, // Disable credentials for CORS
});

// Add request interceptor for error handling
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Don't log 404 errors for /contacts endpoint as it's optional
    // (contacts data might be in global instead)
    const isContacts404 = error?.response?.status === 404 && 
                          error?.config?.url?.includes('/contacts');
    
    if (!isContacts404) {
      // Build error info object with comprehensive error handling
      const errorInfo: Record<string, any> = {};
      
      // Basic error properties
      if (error?.message) errorInfo.message = error.message;
      if (error?.code) errorInfo.code = error.code;
      if (error?.name) errorInfo.name = error.name;
      
      // Response properties (if available)
      if (error?.response) {
        if (error.response.status) errorInfo.status = error.response.status;
        if (error.response.statusText) errorInfo.statusText = error.response.statusText;
        if (error.response.data) errorInfo.data = error.response.data;
        if (error.response.headers) errorInfo.headers = error.response.headers;
      }
      
      // Request config properties
      if (error?.config) {
        if (error.config.url) errorInfo.url = error.config.url;
        if (error.config.baseURL) errorInfo.baseURL = error.config.baseURL;
        if (error.config.method) errorInfo.method = error.config.method;
        if (error.config.timeout) errorInfo.timeout = error.config.timeout;
      }
      
      // Network error properties
      if (error?.request) {
        errorInfo.request = {
          readyState: error.request.readyState,
          status: error.request.status,
          statusText: error.request.statusText
        };
      }
      
      // Stack trace for debugging
      if (error?.stack) errorInfo.stack = error.stack;
      
      // Log error with all available information
      if (Object.keys(errorInfo).length > 0) {
        console.error('API response error:', errorInfo);
      } else {
        // If error object is completely empty, try to stringify it
        try {
          const errorString = JSON.stringify(error, Object.getOwnPropertyNames(error));
          console.error('API response error (stringified):', errorString);
        } catch {
          // If stringification fails, log the error type and constructor
          console.error('API response error (unknown format):', {
            type: typeof error,
            constructor: error?.constructor?.name,
            keys: error ? Object.keys(error) : [],
            error: error
          });
        }
      }
    }
    return Promise.reject(error);
  }
);

// Helper function to convert relative URLs to absolute URLs
// Always use public URL to avoid hydration mismatch between server and client
const getAbsoluteUrl = (url: string): string => {
  if (url.startsWith('http')) {
    // Replace internal URL with public URL to avoid hydration mismatch
    if (url.includes('://backend:')) {
      return url.replace('://backend:', '://localhost:');
    }
    return url;
  }
  
  // Always use public URL for consistency between SSR and client
  const publicUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
  return `${publicUrl}${url}`;
};

// Types
export type DishType = 'cold' | 'hot' | 'side' | 'baked' | 'drink' | 'sweet' | 'other';

// Mapping dish types to Russian labels
export const DISH_TYPE_LABELS: Record<DishType, string> = {
  hot: 'Горячее',
  cold: 'Холодное', 
  side: 'Гарнир',
  baked: 'Выпечка',
  drink: 'Напиток',
  sweet: 'Сладкое',
  other: 'Другое'
};

export interface Advantage {
  id: number;
  documentId: string;
  Title: string;
  slug: string;
  Description?: string;
  image?: {
    id: number;
    documentId: string;
    name: string;
    url: string;
    alternativeText?: string;
    caption?: string;
    width: number;
    height: number;
    formats?: {
      thumbnail?: { url: string; width: number; height: number };
      small?: { url: string; width: number; height: number };
      medium?: { url: string; width: number; height: number };
      large?: { url: string; width: number; height: number };
    };
    hash: string;
    ext: string;
    mime: string;
    size: number;
    previewUrl?: string;
    provider: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface Dish {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  currency: string;
  images?: Array<{
    id: number;
    documentId: string;
    name: string;
    url: string;
    alternativeText?: string;
    caption?: string;
    width: number;
    height: number;
    formats?: {
      thumbnail?: { url: string; width: number; height: number };
      small?: { url: string; width: number; height: number };
      medium?: { url: string; width: number; height: number };
      large?: { url: string; width: number; height: number };
    };
    hash: string;
    ext: string;
    mime: string;
    size: number;
    previewUrl?: string;
    provider: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  }>;
  ingredients?: string;
  allergens?: string;
  nutritionalInfo?: any;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  isSpicy: boolean;
  preparationTime?: number;
  servingSize?: string;
  type?: DishType;
  category?: {
    id: number;
    documentId: string;
    name: string;
    slug: string;
    description?: string;
  };
  menu?: {
    id: number;
    documentId: string;
    name: string;
    slug: string;
  };
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface Menu {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description?: string;
  smallDescription?: string;
  type: 'gastrobox' | 'coffee-break' | 'buffet' | 'banquet' | 'barbecue-banquet' | 'kids-menu' | 'mobile-bar' | 'hookah-catering' | 'boat-sets';
  occasion: 'wedding' | 'corporate' | 'birthday' | 'anniversary' | 'holiday' | 'casual' | 'formal' | 'buffet';
  servingSize?: number;
  pricePerPerson?: number;
  currency: string;
  image?: Array<{
    id: number;
    documentId: string;
    name: string;
    url: string;
    alternativeText?: string;
    caption?: string;
    width: number;
    height: number;
    formats?: {
      thumbnail?: { url: string; width: number; height: number };
      small?: { url: string; width: number; height: number };
      medium?: { url: string; width: number; height: number };
      large?: { url: string; width: number; height: number };
    };
    hash: string;
    ext: string;
    mime: string;
    size: number;
    previewUrl?: string;
    provider: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  }>;
  dishes?: Dish[];
  isActive: boolean;
  validFrom?: string;
  validUntil?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface Global {
  id: number;
  documentId: string;
  siteName: string;
  siteDescription: string;
  favicon?: {
    id: number;
    name: string;
    url: string;
  };
  heroImage?: {
    id: number;
    documentId: string;
    name: string;
    url: string;
    alternativeText?: string;
    caption?: string;
    width: number;
    height: number;
    formats?: {
      thumbnail?: { url: string; width: number; height: number };
      small?: { url: string; width: number; height: number };
      medium?: { url: string; width: number; height: number };
      large?: { url: string; width: number; height: number };
    };
    hash: string;
    ext: string;
    mime: string;
    size: number;
    previewUrl?: string;
    provider: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
  heroTitle?: string;
  heroSubtitle?: string;
  heroDescription?: string;
  featuresImage?: {
    id: number;
    documentId: string;
    name: string;
    url: string;
    alternativeText?: string;
    caption?: string;
    width: number;
    height: number;
    formats?: {
      thumbnail?: { url: string; width: number; height: number };
      small?: { url: string; width: number; height: number };
      medium?: { url: string; width: number; height: number };
      large?: { url: string; width: number; height: number };
    };
    hash: string;
    ext: string;
    mime: string;
    size: number;
    previewUrl?: string;
    provider: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
  ctaImage?: {
    id: number;
    documentId: string;
    name: string;
    url: string;
    alternativeText?: string;
    caption?: string;
    width: number;
    height: number;
    formats?: {
      thumbnail?: { url: string; width: number; height: number };
      small?: { url: string; width: number; height: number };
      medium?: { url: string; width: number; height: number };
      large?: { url: string; width: number; height: number };
    };
    hash: string;
    ext: string;
    mime: string;
    size: number;
    previewUrl?: string;
    provider: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
  defaultSeo?: any;
  socialLinks?: {
    vk?: string;
    instagram?: string;
    telegram?: string;
    whatsapp?: string;
  };
  contactInfo?: {
    phone1?: string;
    phone2?: string;
    email?: string;
    address?: string;
  };
  aboutImage?: Array<{
    id: number;
    documentId: string;
    name: string;
    url: string;
    alternativeText?: string;
    caption?: string;
    width: number;
    height: number;
    formats?: {
      thumbnail?: { url: string; width: number; height: number };
      small?: { url: string; width: number; height: number };
      medium?: { url: string; width: number; height: number };
      large?: { url: string; width: number; height: number };
    };
    hash: string;
    ext: string;
    mime: string;
    size: number;
    previewUrl?: string;
    provider: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  }>;
  aboutText1?: string;
  aboutText2?: string;
  imgLogo?: {
    id: number;
    documentId: string;
    name: string;
    url: string;
    alternativeText?: string;
    caption?: string;
    width: number;
    height: number;
    formats?: {
      thumbnail?: { url: string; width: number; height: number };
      small?: { url: string; width: number; height: number };
      medium?: { url: string; width: number; height: number };
      large?: { url: string; width: number; height: number };
    };
    hash: string;
    ext: string;
    mime: string;
    size: number;
    previewUrl?: string;
    provider: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface Contacts {
  id: number;
  documentId: string;
  title: string;
  description?: string;
  phone1: string;
  phone2?: string;
  email: string;
  address: string;
  workingHours?: string;
  vk?: string;
  instagram?: string;
  telegram?: string;
  whatsapp?: string;
  mapEmbed?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface AboutBlock {
  id: number;
  __component: 'shared.media' | 'shared.quote' | 'shared.rich-text' | 'shared.slider';
  // Media component
  file?: {
    id: number;
    documentId: string;
    name: string;
    url: string;
    alternativeText?: string;
    caption?: string;
    width: number;
    height: number;
    formats?: {
      thumbnail?: { url: string; width: number; height: number };
      small?: { url: string; width: number; height: number };
      medium?: { url: string; width: number; height: number };
      large?: { url: string; width: number; height: number };
    };
    hash: string;
    ext: string;
    mime: string;
    size: number;
    previewUrl?: string;
    provider: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
  // Quote component
  title?: string;
  quoteBody?: string;
  // Rich text component
  richTextBody?: string;
  // Slider component
  files?: Array<{
    id: number;
    documentId: string;
    name: string;
    url: string;
    alternativeText?: string;
    caption?: string;
    width: number;
    height: number;
    formats?: {
      thumbnail?: { url: string; width: number; height: number };
      small?: { url: string; width: number; height: number };
      medium?: { url: string; width: number; height: number };
      large?: { url: string; width: number; height: number };
    };
    hash: string;
    ext: string;
    mime: string;
    size: number;
    previewUrl?: string;
    provider: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  }>;
}

export interface About {
  id: number;
  documentId: string;
  title: string;
  blocks: AboutBlock[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface OrderItem {
  id?: number;
  menu: Menu;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: number;
  documentId: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress?: string;
  deliveryDate?: string;
  deliveryTime?: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  totalAmount: number;
  currency: string;
  orderItems: OrderItem[];
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod?: 'cash' | 'card' | 'online' | 'bank_transfer';
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface CreateOrderData {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress?: string;
  deliveryDate?: string;
  deliveryTime?: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  totalAmount: number;
  currency: string;
  orderItems: {
    menu: number;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod?: 'cash' | 'card' | 'online' | 'bank_transfer';
}

export interface CartItem {
  menu?: Menu;
  dish?: Dish;
  quantity: number;
}

// Event Page types
export interface EventGallery {
  id?: number;
  Title?: string;
  backgroundImg?: Array<{
    id: number;
    documentId: string;
    name: string;
    url: string;
    alternativeText?: string;
    caption?: string;
    width: number;
    height: number;
    formats?: {
      thumbnail?: { url: string; width: number; height: number };
      small?: { url: string; width: number; height: number };
      medium?: { url: string; width: number; height: number };
      large?: { url: string; width: number; height: number };
    };
    hash: string;
    ext: string;
    mime: string;
    size: number;
    previewUrl?: string;
    provider: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  }>;
  Images?: Array<{
    id: number;
    documentId: string;
    name: string;
    url: string;
    alternativeText?: string;
    caption?: string;
    width: number;
    height: number;
    formats?: {
      thumbnail?: { url: string; width: number; height: number };
      small?: { url: string; width: number; height: number };
      medium?: { url: string; width: number; height: number };
      large?: { url: string; width: number; height: number };
    };
    hash: string;
    ext: string;
    mime: string;
    size: number;
    previewUrl?: string;
    provider: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  }>;
}

export interface EventPage {
  id: number;
  documentId: string;
  Slug: string;
  title: string;
  TitleInmenu?: string;
  Description: string;
  Presentation?: {
    id: number;
    url: string;
    name: string;
    ext: string;
    mime: string;
    size: number;
  };
  Images?: {
    id: number;
    documentId: string;
    name: string;
    url: string;
    alternativeText?: string;
    caption?: string;
    width: number;
    height: number;
    formats?: {
      thumbnail?: { url: string; width: number; height: number };
      small?: { url: string; width: number; height: number };
      medium?: { url: string; width: number; height: number };
      large?: { url: string; width: number; height: number };
    };
    hash: string;
    ext: string;
    mime: string;
    size: number;
    previewUrl?: string;
    provider: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  } | Array<{
    id: number;
    documentId: string;
    name: string;
    url: string;
    alternativeText?: string;
    caption?: string;
    width: number;
    height: number;
    formats?: {
      thumbnail?: { url: string; width: number; height: number };
      small?: { url: string; width: number; height: number };
      medium?: { url: string; width: number; height: number };
      large?: { url: string; width: number; height: number };
    };
    hash: string;
    ext: string;
    mime: string;
    size: number;
    previewUrl?: string;
    provider: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  }>;
  GaleryOfMedia?: EventGallery;
  menus?: Array<{
    __component: string;
    id: number;
    Title?: string;
    Description?: string;
    smallDescription?: string;
    menus?: Menu[];
  }>;
  SeoMenus?: Array<{
    __component: string;
    id: number;
    Title?: string;
    Description?: string;
    SubTitle?: string;
    backgroundImg?: {
      id: number;
      documentId: string;
      name: string;
      url: string;
      alternativeText?: string;
      caption?: string;
      width: number;
      height: number;
      formats?: {
        thumbnail?: { url: string; width: number; height: number };
        small?: { url: string; width: number; height: number };
        medium?: { url: string; width: number; height: number };
        large?: { url: string; width: number; height: number };
      };
      hash: string;
      ext: string;
      mime: string;
      size: number;
      previewUrl?: string;
      provider: string;
      createdAt: string;
      updatedAt: string;
      publishedAt: string;
    };
  }>;
  dishes?: Dish[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface Service {
  id: number;
  documentId: string;
  Title: string;
  TitleInmenu?: string;
  slug: string;
  ShortDescription?: string;
  Description?: string;
  order?: number;
  Images?: Array<{
    id: number;
    documentId: string;
    name: string;
    url: string;
    alternativeText?: string;
    caption?: string;
    width: number;
    height: number;
    formats?: {
      thumbnail?: { url: string; width: number; height: number };
      small?: { url: string; width: number; height: number };
      medium?: { url: string; width: number; height: number };
      large?: { url: string; width: number; height: number };
    };
    hash: string;
    ext: string;
    mime: string;
    size: number;
    previewUrl?: string;
    provider: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  }>;
  SEO?: Array<{
    __component: string;
    id: number;
    Title?: string;
    Description?: string;
    keywords?: string;
    [key: string]: any;
  }>;
  Menu?: Array<{
    __component: string;
    id: number;
    Title?: string;
    Description?: string;
    smallDescription?: string;
    menus?: Menu[];
  }>;
  File?: {
    id: number;
    url: string;
    name: string;
    ext: string;
    mime: string;
    size: number;
  };
  GaleryOfMedia?: Array<{
    id: number;
    documentId: string;
    name: string;
    url: string;
    alternativeText?: string;
    caption?: string;
    width: number;
    height: number;
    formats?: {
      thumbnail?: { url: string; width: number; height: number };
      small?: { url: string; width: number; height: number };
      medium?: { url: string; width: number; height: number };
      large?: { url: string; width: number; height: number };
    };
    hash: string;
    ext: string;
    mime: string;
    size: number;
    previewUrl?: string;
    provider: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface Gallery {
  id: number;
  documentId: string;
  title: string;
  description?: string;
  images?: Array<{
    id: number;
    documentId: string;
    name: string;
    url: string;
    alternativeText?: string;
    caption?: string;
    width: number;
    height: number;
    formats?: {
      thumbnail?: { url: string; width: number; height: number };
      small?: { url: string; width: number; height: number };
      medium?: { url: string; width: number; height: number };
      large?: { url: string; width: number; height: number };
    };
    hash: string;
    ext: string;
    mime: string;
    size: number;
    previewUrl?: string;
    provider: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  }>;
  SEO?: Array<{
    __component: string;
    id: number;
    Title?: string;
    Description?: string;
    keywords?: string;
    [key: string]: any;
  }>;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

// API functions
export const apiClient = {
  // Get all dishes
  getDishes: async (params?: {
    populate?: string;
    filters?: any;
    sort?: string;
    pagination?: { page?: number; pageSize?: number };
  }) => {
    // Build query string manually to avoid issues with URLSearchParams
    let queryString = '';
    const queryParts = [];
    
    if (params?.populate) {
      queryParts.push(`populate=${encodeURIComponent(params.populate)}`);
    }
    
    if (params?.sort) {
      queryParts.push(`sort=${encodeURIComponent(params.sort)}`);
    }
    
    // Skip pagination parameters for now as they cause 400 errors in Strapi v5
    // if (params?.pagination?.pageSize) {
    //   queryParts.push(`pagination[pageSize]=${params.pagination.pageSize}`);
    // }
    
    if (queryParts.length > 0) {
      queryString = '?' + queryParts.join('&');
    }
    
    const url = `/dishes${queryString}`;
    const response = await api.get(url);
    return response.data;
  },

  // Get dish by slug
  getDishBySlug: async (slug: string) => {
    const response = await api.get(`/dishes?populate=*`);
    const dishes = response.data?.data || [];
    const dish = dishes.find((d: Dish) => d.slug === slug);
    return { data: dish ? [dish] : [] };
  },

  // Get all menus
  getMenus: async (params?: {
    populate?: string;
    filters?: any;
    sort?: string;
    pagination?: { page?: number; pageSize?: number };
  }) => {
    // Build query string manually to avoid issues with URLSearchParams
    let queryString = '';
    const queryParts = [];
    
    if (params?.populate) {
      queryParts.push(`populate=${encodeURIComponent(params.populate)}`);
    }
    
    if (params?.sort) {
      queryParts.push(`sort=${encodeURIComponent(params.sort)}`);
    }
    
    // Skip pagination parameters for now as they cause 400 errors in Strapi v5
    // if (params?.pagination?.pageSize) {
    //   queryParts.push(`pagination[pageSize]=${params.pagination.pageSize}`);
    // }
    
    if (queryParts.length > 0) {
      queryString = '?' + queryParts.join('&');
    }
    
    const url = `/menus${queryString}`;
    const response = await api.get(url);
    return response.data;
  },

  // Get menu by slug
  getMenuBySlug: async (slug: string) => {
    const response = await api.get(`/menus?filters[slug][$eq]=${slug}&populate[image]=true&populate[dishes][populate][images]=true`);
    return response.data;
  },

  // Get file by ID
  getFileById: async (fileId: number) => {
    try {
      const response = await api.get(`/upload/files/${fileId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching file by ID:', error);
      return null;
    }
  },

  // Get global settings
  getGlobal: async () => {
    try {
      
      // Сначала пробуем простой запрос
      let response = await api.get('/global');
      
      const data = response.data?.data || response.data;
      
      // Проверяем, есть ли компоненты в базовом ответе
      if (data?.contactInfo || data?.socialLinks || data?.defaultSeo) {
        return response.data;
      }
      
      // Если компонентов нет, пробуем populate
    
      const populateParams = [
        'populate=*'
      ];
      
      for (const populate of populateParams) {
        try {
         
          response = await api.get(`/global?${populate}`);
          const populatedData = response.data?.data || response.data;
          if (populatedData?.contactInfo || populatedData?.socialLinks || populatedData?.defaultSeo) {
           
            return response.data;
          }
        } catch (err) {
          console.log(`Failed with populate: ${populate}`, err);
        }
      }
      
      return response.data;
      
    } catch (error: any) {
      console.error('API call failed:', error);
      throw error;
    }
  },

  // Simple global settings test
  getGlobalSimple: async () => {
    try {
      const response = await api.get('/global');
      return response.data;
    } catch (error: any) {
      console.error('Simple global API call failed:', error);
      throw error;
    }
  },

  // Get contacts data
  getContacts: async () => {
    try {
      const response = await api.get('/contacts');
      return response.data;
    } catch (error: any) {
      // If contacts endpoint returns 404 (not created yet), return null instead of throwing
      // This is expected behavior since contacts might not exist as a separate entity
      // The app can still work using global data
      if (error?.response?.status === 404) {
        console.log('Contacts endpoint not found (404) - using global data instead');
        return null;
      }
      // Log non-404 errors with comprehensive details
      const errorDetails: Record<string, any> = {};
      if (error?.message) errorDetails.message = error.message;
      if (error?.code) errorDetails.code = error.code;
      if (error?.name) errorDetails.name = error.name;
      if (error?.response?.status) errorDetails.status = error.response.status;
      if (error?.response?.statusText) errorDetails.statusText = error.response.statusText;
      if (error?.response?.data) errorDetails.data = error.response.data;
      if (error?.config?.url) errorDetails.url = error.config.url;
      if (error?.config?.baseURL) errorDetails.baseURL = error.config.baseURL;
      
      if (Object.keys(errorDetails).length > 0) {
        console.error('Contacts API call failed:', errorDetails);
      } else {
        // Fallback: log the raw error if no details available
        console.error('Contacts API call failed (no details):', error);
      }
      throw error;
    }
  },

  // Get featured dishes (example with filters)
  getFeaturedDishes: async () => {
    const response = await api.get('/dishes?filters[featured][$eq]=true&populate=*');
    return response.data;
  },

  // Get dishes by category
  getDishesByCategory: async (categorySlug: string) => {
    const response = await api.get(`/dishes?filters[category][slug][$eq]=${categorySlug}&populate=*`);
    return response.data;
  },

  // Get dishes by type
  getDishesByType: async (type: DishType) => {
    const response = await api.get(`/dishes?filters[type][$eq]=${type}&populate=*`);
    return response.data;
  },

  // Get about page data
  getAbout: async () => {
    try {
      const response = await api.get('/about?populate=*');
      return response.data;
    } catch (error: any) {
      console.error('About API call failed:', error);
      throw error;
    }
  },

  // Get advantages data
  getAdvantages: async () => {
    try {
      const response = await api.get('/advantages?populate=*&sort=createdAt:asc');
      return response.data;
    } catch (error: any) {
      console.error('Advantages API call failed:', error);
      throw error;
    }
  },

  // Order management
  createOrder: async (orderData: CreateOrderData) => {
    try {
      const response = await api.post('/orders', {
        data: orderData
      });
      return response.data;
    } catch (error: any) {
      console.error('Failed to create order:', error);
      throw error;
    }
  },

  getOrders: async (params?: {
    populate?: string;
    filters?: any;
    sort?: string;
  }) => {
    try {
      let queryString = '';
      const queryParts = [];
      
      if (params?.populate) {
        queryParts.push(`populate=${encodeURIComponent(params.populate)}`);
      }
      
      if (params?.sort) {
        queryParts.push(`sort=${encodeURIComponent(params.sort)}`);
      }
      
      if (params?.filters) {
        Object.keys(params.filters).forEach(key => {
          queryParts.push(`filters[${key}]=${encodeURIComponent(params.filters[key])}`);
        });
      }
      
      if (queryParts.length > 0) {
        queryString = '?' + queryParts.join('&');
      }
      
      const url = `/orders${queryString}`;
      const response = await api.get(url);
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch orders:', error);
      throw error;
    }
  },

  getOrderById: async (id: string | number) => {
    try {
      const response = await api.get(`/orders/${id}?populate=*`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch order:', error);
      throw error;
    }
  },

  updateOrderStatus: async (id: string | number, status: Order['status']) => {
    try {
      const response = await api.put(`/orders/${id}/status`, { status });
      return response.data;
    } catch (error: any) {
      console.error('Failed to update order status:', error);
      throw error;
    }
  },

    // Get all event pages
    getEventPages: async (params?: {
      populate?: string;
      filters?: any;
      sort?: string;
      pagination?: { page?: number; pageSize?: number };
    }) => {
      try {
        let queryString = '';
        const queryParts = [];

        if (params?.populate) {
          queryParts.push(`populate=${encodeURIComponent(params.populate)}`);
        } else {
          // Use detailed populate for gallery data, menus and SEO fields
          queryParts.push('populate[Images]=true');
          queryParts.push('populate[GaleryOfMedia][populate][Images]=true');
          queryParts.push('populate[GaleryOfMedia][populate][backgroundImg]=true');
          queryParts.push('populate[menus][populate]=*');
          queryParts.push('populate[SeoMenus][populate]=*');
        }

        if (params?.sort) {
          queryParts.push(`sort=${encodeURIComponent(params.sort)}`);
        }

        if (queryParts.length > 0) {
          queryString = '?' + queryParts.join('&');
        }

        const url = `/event-pages${queryString}`;
        const response = await api.get(url);
        return response.data;
      } catch (error: any) {
        console.error('Failed to fetch event pages:', error);
        throw error;
      }
    },

  // Get event page by slug
  getEventPageBySlug: async (slug: string) => {
    try {
      // Build specific populate query for gallery component, menus and SEO fields
      const populateQuery = 'populate[Images]=true&populate[GaleryOfMedia][populate][Images]=true&populate[GaleryOfMedia][populate][backgroundImg]=true&populate[menus][populate]=*&populate[SeoMenus][populate]=*&populate[Presentation]=true&populate[dishes][populate][images]=true';
      
      const response = await api.get(`/event-pages?filters[Slug][$eq]=${slug}&${populateQuery}`);
      const eventPages = response.data?.data || [];
      const eventPage = eventPages.find((ep: EventPage) => ep.Slug === slug);

      if (!eventPage) {
        return { data: [] };
      }

      // Menus are already populated by the backend controller
      // No need to load them separately
      
      return { data: [eventPage] };
    } catch (error: any) {
      console.error('Failed to fetch event page:', error);
      throw error;
    }
  },

  // Get all services
  getServices: async (params?: {
    populate?: string;
    filters?: any;
    sort?: string;
    pagination?: { page?: number; pageSize?: number };
  }) => {
    try {
      let queryString = '';
      const queryParts = [];

      if (params?.populate) {
        queryParts.push(`populate=${encodeURIComponent(params.populate)}`);
      } else {
        // Use detailed populate for images and SEO
        queryParts.push('populate[Images]=true');
        queryParts.push('populate[SEO]=true');
      }

      // Sort by order field by default, or use provided sort
      if (params?.sort) {
        queryParts.push(`sort=${encodeURIComponent(params.sort)}`);
      } else {
        // Default sort by order field (ascending), then by createdAt if order is not set
        queryParts.push('sort=order:asc');
      }

      if (queryParts.length > 0) {
        queryString = '?' + queryParts.join('&');
      }

      const url = `/services${queryString}`;
      const response = await api.get(url);
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch services:', error);
      throw error;
    }
  },

  // Get service by slug
  getServiceBySlug: async (slug: string) => {
    try {
      // Используем детальный populate для всех полей
      // Для динамической зоны Menu нужно использовать правильный синтаксис с указанием компонента
      // Структура: Menu (dynamic zone) -> shared.menus-in-events (component) -> menus -> image
      const populateParts = [
        'populate[Images]=true',
        'populate[SEO]=true',
        'populate[File]=true',
        'populate[GaleryOfMedia]=true',
        'populate[Menu][on][shared.menus-in-events][populate][menus][populate][image]=true',
        'populate[Menu][on][shared.menus-in-events][populate][menus][populate][dishes][populate][images]=true'
      ];
      
      const populateQuery = populateParts.join('&');
      
      const response = await api.get(`/services?filters[slug][$eq]=${slug}&${populateQuery}`);
      const services = response.data?.data || [];
      const service = services.find((s: Service) => s.slug === slug);

      if (!service) {
        return { data: [] };
      }

      // Отладочная информация для проверки меню и изображений
      if (service.Menu && Array.isArray(service.Menu)) {
        service.Menu.forEach((block: NonNullable<Service['Menu']>[number], idx: number) => {
          if (block?.menus && Array.isArray(block.menus)) {
            block.menus.forEach((menu: Menu, menuIdx: number) => {
              console.log(`[Service API] Menu ${idx}-${menuIdx}:`, {
                name: menu.name,
                hasImage: !!menu.image,
                imageType: Array.isArray(menu.image) ? 'array' : typeof menu.image,
                imageLength: Array.isArray(menu.image) ? menu.image.length : 'N/A'
              });
            });
          }
        });
      }
      
      return { data: [service] };
    } catch (error: any) {
      // Если детальный populate не работает, пробуем упрощенный вариант
      console.warn('[Service API] Detailed populate failed, trying simplified populate...', error?.response?.status);
      
      try {
        // Упрощенный вариант - просто populate Menu
        const populateParts = [
          'populate[Images]=true',
          'populate[SEO]=true',
          'populate[File]=true',
          'populate[GaleryOfMedia]=true',
          'populate[Menu]=*'
        ];
        const populateQuery = populateParts.join('&');
        
        const response = await api.get(`/services?filters[slug][$eq]=${slug}&${populateQuery}`);
        const services = response.data?.data || [];
        const service = services.find((s: Service) => s.slug === slug);

        if (!service) {
          return { data: [] };
        }

        console.log('[Service API] Service loaded (simplified):', {
          hasMenu: !!service.Menu,
          menuType: Array.isArray(service.Menu) ? 'array' : typeof service.Menu,
          menuLength: Array.isArray(service.Menu) ? service.Menu.length : 'N/A'
        });
        
        return { data: [service] };
      } catch (retryError: any) {
        console.error('[Service API] Both attempts failed:', {
          firstError: error?.response?.data || error?.message,
          retryError: retryError?.response?.data || retryError?.message,
          status: retryError?.response?.status,
          statusText: retryError?.response?.statusText,
          url: retryError?.config?.url
        });
        throw retryError;
      }
    }
  },

  // Get gallery data
  getGallery: async () => {
    try {
      const response = await api.get('/gallery?populate[images]=true&populate[SEO]=true');
      return response.data;
    } catch (error: any) {
      console.error('Gallery API call failed:', error);
      throw error;
    }
  },
};

export default apiClient;

// Export helper functions
export { getAbsoluteUrl as getImageUrl };

