'use client';

import { motion } from 'framer-motion';
import { Zap, Shield, Smartphone, BarChart3, Search, Globe } from 'lucide-react';
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { StrapiImage } from '@/components/ui/StrapiImage';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';

// Helper function to get absolute URL for images
const getImageUrl = (url: string): string => {
    if (url.startsWith('http')) {
        return url;
    }
    return `http://localhost:1337${url}`;
};

const features = [
    {
        icon: Zap,
        title: 'Молниеносная скорость',
        description: 'Оптимизирован для Core Web Vitals с Lighthouse Score 90+',
    },
    {
        icon: Search,
        title: 'SEO оптимизация',
        description: 'Полная настройка мета-тегов, структурированных данных и sitemap',
    },
    {
        icon: BarChart3,
        title: 'Аналитика и метрики',
        description: 'Интеграция с GA4, GTM, Facebook Pixel и другими инструментами',
    },
    {
        icon: Shield,
        title: 'Безопасность',
        description: 'HTTPS, CSP, HSTS и другие меры безопасности',
    },
    {
        icon: Smartphone,
        title: 'Адаптивность',
        description: 'Идеально работает на всех устройствах и экранах',
    },
    {
        icon: Globe,
        title: 'Масштабируемость',
        description: 'Готов к росту с CDN, кэшированием и оптимизацией',
    },
];

export function FeaturesSection() {
    const [globalData, setGlobalData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

    useEffect(() => {
        const fetchGlobalData = async () => {
            try {
                const response = await apiClient.getGlobal();
                setGlobalData(response.data);
            } catch (error: any) {
                console.error('Error fetching global data:', {
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
            } finally {
                setLoading(false);
            }
        };

        fetchGlobalData();
    }, []);

    return (
        <section className="relative py-16 sm:py-20 lg:py-24 bg-hi-white">
            {/* Background Image */}
            {globalData?.featuresImage && globalData.featuresImage.url && !imageErrors.has('features') ? (
                <div className="absolute inset-0">
                    <StrapiImage
                        src={getImageUrl(globalData.featuresImage.url)}
                        alt={globalData.featuresImage.alternativeText || 'Features background'}
                        fill
                        className="object-cover opacity-10"
                        onError={() => setImageErrors(prev => new Set(prev).add('features'))}
                    />
                </div>
            ) : null}

            <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    className="text-center mb-12 sm:mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-hi-graphite">
                        Почему выбирают нас
                    </h2>
                    <p className="text-base sm:text-lg text-hi-graphite max-w-2xl mx-auto">
                        Современные технологии и лучшие практики для создания
                        высокопроизводительных веб-сайтов
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            className="bg-hi-white rounded-lg p-4 sm:p-6 text-center hover:shadow-hi-hover transition-shadow shadow-hi"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-hi-platinum bg-opacity-20 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-hi-platinum" />
                            </div>
                            <h3 className="text-lg sm:text-xl font-semibold mb-2 text-hi-graphite">{feature.title}</h3>
                            <p className="text-sm sm:text-base text-hi-graphite">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
