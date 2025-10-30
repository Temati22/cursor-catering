'use client';

import { useState, useEffect } from 'react';
import { apiClient, Global } from '@/lib/api';
import { getContactData, getSocialData, getSeoData } from '@/lib/fallback-data';

export function useGlobalData() {
    const [globalData, setGlobalData] = useState<Global | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchGlobalData = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await apiClient.getGlobal();
                // Проверяем структуру ответа
                const data = response.data || response;
                setGlobalData(data);
            } catch (err) {
                setError('Не удалось загрузить данные');
            } finally {
                setLoading(false);
            }
        };

        fetchGlobalData();
      
    }, []);

    // Извлекаем данные с fallback
    const contactData = getContactData(globalData);
    const socialData = getSocialData(globalData);
    const seoData = getSeoData(globalData);
    console.log('globalData - ', globalData);
    console.log('heroImage - ', globalData?.heroImage);
    

    return {
        globalData,
        loading,
        error,
        // Helper functions for common data access
        siteName: globalData?.siteName || 'Hi-Catering',
        siteDescription: globalData?.siteDescription || 'Профессиональный кейтеринг для ваших мероприятий',
        contactInfo: globalData?.contactInfo,
        socialLinks: globalData?.socialLinks,
        // Hero section helpers with fallback
        heroTitle: globalData?.heroTitle || 'Hi-Catering Кейтеринг для вашего события',
        heroSubtitle: globalData?.heroSubtitle || 'Кейтеринг',
        heroDescription: globalData?.heroDescription || 'Профессиональный кейтеринг для любых мероприятий. Вкусная еда, качественный сервис, незабываемые впечатления.',
        // Contact helpers with fallback
        primaryPhone: contactData.phone1,
        secondaryPhone: contactData.phone2,
        email: contactData.email,
        address: contactData.address,
        // Social media helpers with fallback
        vkLink: socialData.vk,
        instagramLink: socialData.instagram,
        telegramLink: socialData.telegram,
        whatsappLink: socialData.whatsapp,
        // SEO helpers with fallback
        metaTitle: seoData.metaTitle,
        metaDescription: seoData.metaDescription,
        shareImage: seoData.shareImage,
        // About section helpers
        aboutImage: globalData?.aboutImage,
        aboutText1: globalData?.aboutText1,
        aboutText2: globalData?.aboutText2,
        // CTA and logo helpers
        ctaImage: globalData?.ctaImage,
        // Logo helper - use imgLogo, with featuresImage (Logo-white.png) and heroImage as fallbacks
        logo: globalData?.imgLogo || globalData?.featuresImage || globalData?.heroImage,

    };
} 
