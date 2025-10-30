import axios from 'axios';

// Get API URL with fallback
const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    // Client-side: use localhost for browser access
    return 'http://localhost:1337/api';
  } else {
    // Server-side: use Docker service name for server-side rendering
    return process.env.NEXT_PUBLIC_API_URL || 'http://backend:1337/api';
  }
};

const API_BASE_URL = getApiUrl();
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';


const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
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
    console.error('API response error:', {
      message: error?.message || 'Unknown error',
      code: error?.code || 'UNKNOWN',
      status: error?.response?.status || 'No status',
      statusText: error?.response?.statusText || 'No status text',
      data: error?.response?.data || 'No response data',
      url: error?.config?.url || 'Unknown URL',
      baseURL: error?.config?.baseURL || 'Unknown base URL',
      method: error?.config?.method || 'Unknown method',
      fullError: error
    });
    return Promise.reject(error);
  }
);

// Helper function to convert relative URLs to absolute URLs
const getAbsoluteUrl = (url: string): string => {
  if (url.startsWith('http')) {
    return url;
  }
  return `${STRAPI_URL}${url}`;
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
  aboutImage?: {
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
  }>;
  dishes?: Dish[];
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
      console.error('Contacts API call failed:', error);
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
          queryParts.push('populate[menus]=true');
          queryParts.push('populate[SeoMenus]=true');
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
      const populateQuery = 'populate[Images]=true&populate[GaleryOfMedia][populate][Images]=true&populate[GaleryOfMedia][populate][backgroundImg]=true&populate[menus]=true&populate[SeoMenus]=true&populate[Presentation]=true&populate[dishes][populate][images]=true';
      
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
};

export default apiClient;

// Export helper functions
export { getAbsoluteUrl as getImageUrl };

