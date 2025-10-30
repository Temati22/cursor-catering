'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Mail, Phone } from 'lucide-react';
import { useState } from 'react';
import { useContactsData } from '@/hooks/useContactsData';
import { StrapiImage } from '@/components/ui/StrapiImage';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';

// Helper function to get absolute URL for images
const getImageUrl = (url: string | undefined | null): string => {
    if (!url) {
        return '';
    }
    if (url.startsWith('http')) {
        return url;
    }
    return `http://localhost:1337${url}`;
};

export function CtaSection() {
    const { globalData, primaryPhone, email } = useContactsData();
    const [imageError, setImageError] = useState(false);

    return (
        <section className="relative py-16 sm:py-20 lg:py-24 bg-hi-luxe text-hi-white">
            {/* Background Image */}
            {globalData?.ctaImage && globalData.ctaImage.url && !imageError ? (
                <div className="absolute inset-0">
                    <StrapiImage
                        src={getImageUrl(globalData.ctaImage.url)}
                        alt={globalData.ctaImage.alternativeText || 'CTA background'}
                        fill
                        className="object-cover opacity-20"
                        onError={() => setImageError(true)}
                    />
                </div>
            ) : null}

            <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    className="text-center max-w-3xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                        Готовы начать проект?
                    </h2>
                    <p className="text-lg mb-8 opacity-90">
                        Свяжитесь с нами для обсуждения вашего проекта.
                        Мы поможем создать современный, быстрый и SEO-оптимизированный сайт.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                        <button className="inline-flex items-center justify-center rounded-lg border border-hi-white bg-transparent px-6 py-3 text-sm font-medium text-hi-white transition-all hover:bg-hi-white hover:text-hi-graphite">
                            Начать проект
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </button>

                        {primaryPhone && (
                            <a
                                href={`tel:${primaryPhone}`}
                                className="inline-flex items-center justify-center rounded-lg border border-hi-white bg-transparent px-6 py-3 text-sm font-medium text-hi-white transition-all hover:bg-hi-white hover:text-hi-graphite"
                            >
                                <Phone className="mr-2 h-4 w-4" />
                                Позвонить
                            </a>
                        )}
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-8 text-sm opacity-75">
                        {email && (
                            <div className="flex items-center space-x-2">
                                <Mail className="h-4 w-4" />
                                <span>{email}</span>
                            </div>
                        )}
                        {primaryPhone && (
                            <div className="flex items-center space-x-2">
                                <Phone className="h-4 w-4" />
                                <span>{primaryPhone}</span>
                            </div>
                        )}
                        {/* Fallback if no data from API */}
                        {!email && !primaryPhone && (
                            <>
                                <div className="flex items-center space-x-2">
                                    <Mail className="h-4 w-4" />
                                    <span>info@example.com</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Phone className="h-4 w-4" />
                                    <span>+7 (999) 123-45-67</span>
                                </div>
                            </>
                        )}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
