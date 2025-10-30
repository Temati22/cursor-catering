'use client';

import { useState, useEffect } from 'react';
import { apiClient, Contacts, Global } from '@/lib/api';
import { getContactData, getSocialData } from '@/lib/fallback-data';

export function useContactsData() {
    const [contactsData, setContactsData] = useState<Contacts | null>(null);
    const [globalData, setGlobalData] = useState<Global | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Загружаем данные Contacts и Global параллельно
                const [contactsResponse, globalResponse] = await Promise.allSettled([
                    apiClient.getContacts(),
                    apiClient.getGlobal()
                ]);
                
                if (contactsResponse.status === 'fulfilled') {
                    const contactsData = contactsResponse.value.data || contactsResponse.value;
                    setContactsData(contactsData);
                }
                
                if (globalResponse.status === 'fulfilled') {
                    const globalData = globalResponse.value.data || globalResponse.value;
                    setGlobalData(globalData);
                }
                
            } catch (err) {
                setError('Не удалось загрузить данные');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Извлекаем данные с fallback
    const contactData = getContactData(globalData);
    const socialData = getSocialData(globalData);

    return {
        contactsData,
        globalData,
        loading,
        error,
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
        // Additional contacts data
        title: globalData?.siteName || contactsData?.title || 'Контакты',
        description: globalData?.heroDescription || globalData?.siteDescription || 'Профессиональный кейтеринг для ваших мероприятий',
        workingHours: contactsData?.workingHours,
        mapEmbed: contactsData?.mapEmbed,
        // Global data for images and site info
        siteName: globalData?.siteName || 'Hi-Catering',
        siteDescription: globalData?.siteDescription || 'Профессиональный кейтеринг',
        heroImage: globalData?.heroImage,
        featuresImage: globalData?.featuresImage,
        ctaImage: globalData?.ctaImage,
        // About section data
        aboutImage: globalData?.aboutImage,
        aboutText1: globalData?.aboutText1,
        aboutText2: globalData?.aboutText2,
    };
}
