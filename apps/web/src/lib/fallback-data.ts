// Fallback данные для случаев, когда Strapi API недоступен или компоненты не заполнены
// Используются только как резерв, когда данные из Strapi недоступны

export const fallbackContactData = {
  phone1: process.env.NEXT_PUBLIC_PHONE_1 || '+7 999 999 99 99',
  phone2: process.env.NEXT_PUBLIC_PHONE_2 || '+7 888 888 88 88',
  email: process.env.NEXT_PUBLIC_EMAIL || 'info@hi-catering.ru',
  address: process.env.NEXT_PUBLIC_ADDRESS || 'Москва, ул. Примерная, 123'
};

export const fallbackSocialData = {
  vk: process.env.NEXT_PUBLIC_VK_LINK || '',
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_LINK || '',
  telegram: process.env.NEXT_PUBLIC_TELEGRAM_LINK || '',
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_LINK || ''
};

export const fallbackSeoData = {
  metaTitle: process.env.NEXT_PUBLIC_SITE_TITLE || 'Hi-Catering - Профессиональный кейтеринг',
  metaDescription: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'Профессиональный кейтеринг для ваших мероприятий',
  shareImage: process.env.NEXT_PUBLIC_SHARE_IMAGE || ''
};

// Функция для получения контактных данных с fallback
export const getContactData = (strapiData: any) => {
  // Поддержка как старого формата (Global), так и нового (Contacts)
  const contactInfo = strapiData?.contactInfo;
  const contactsData = strapiData;
  
  // Приоритет: Contacts -> Global -> Fallback
  return {
    phone1: contactsData?.phone1 || contactInfo?.phone1 || fallbackContactData.phone1,
    phone2: contactsData?.phone2 || contactInfo?.phone2 || fallbackContactData.phone2,
    email: contactsData?.email || contactInfo?.email || fallbackContactData.email,
    address: contactsData?.address || contactInfo?.address || fallbackContactData.address
  };
};

// Функция для получения социальных данных с fallback
export const getSocialData = (strapiData: any) => {
  // Поддержка как старого формата (Global), так и нового (Contacts)
  const socialLinks = strapiData?.socialLinks;
  const contactsData = strapiData;
  
  return {
    vk: contactsData?.vk || socialLinks?.vk || fallbackSocialData.vk,
    instagram: contactsData?.instagram || socialLinks?.instagram || fallbackSocialData.instagram,
    telegram: contactsData?.telegram || socialLinks?.telegram || fallbackSocialData.telegram,
    whatsapp: contactsData?.whatsapp || socialLinks?.whatsapp || fallbackSocialData.whatsapp
  };
};

// Функция для получения SEO данных с fallback
export const getSeoData = (strapiData: any) => {
  const defaultSeo = strapiData?.defaultSeo;
  
  return {
    metaTitle: defaultSeo?.metaTitle || fallbackSeoData.metaTitle,
    metaDescription: defaultSeo?.metaDescription || fallbackSeoData.metaDescription,
    shareImage: defaultSeo?.shareImage || fallbackSeoData.shareImage
  };
};
