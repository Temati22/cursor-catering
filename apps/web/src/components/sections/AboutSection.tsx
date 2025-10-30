'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useContactsData } from '@/hooks/useContactsData';
import { StrapiImage } from '@/components/ui/StrapiImage';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { FallbackComponent } from '@/components/ui/FallbackComponent';
import Link from 'next/link';

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

export function AboutSection() {
    const { globalData, aboutImage, aboutText1, aboutText2, loading } = useContactsData();
    const [imageError, setImageError] = useState(false);

    return (
        <section className="relative py-16 sm:py-20 lg:py-24 bg-hi-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    {/* Left side - Image */}
                    <motion.div
                        className="relative h-80 sm:h-96 lg:h-[500px] rounded-lg overflow-hidden"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        {aboutImage && aboutImage.url && !imageError ? (
                            <StrapiImage
                                src={getImageUrl(aboutImage.url)}
                                alt={aboutImage.alternativeText || 'О нашей компании'}
                                fill
                                className="object-cover"
                                onError={() => setImageError(true)}
                            />
                        ) : (
                            <ImagePlaceholder
                                className="w-full h-full bg-hi-ash"
                                text="Изображение компании"
                            />
                        )}
                    </motion.div>

                    {/* Right side - Text content */}
                    <motion.div
                        className="space-y-6"
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        <div className="text-center lg:text-left">
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-hi-graphite mb-6">
                                • О НАШЕЙ КОМПАНИИ •
                            </h2>
                        </div>

                        <div className="space-y-4 text-hi-graphite">
                            {loading ? (
                                <FallbackComponent
                                    message="Загружаем информацию о компании..."
                                    size="md"
                                    variant="minimal"
                                />
                            ) : (
                                <>
                                    <p className="text-base sm:text-lg leading-relaxed">
                                        {aboutText1 ||
                                            'Hi-Catering — это молодая, динамично развивающаяся компания кейтеринга. Наша сеть начала работу в 2024 году с первой кухни в Москве. Сегодня мы радуем клиентов качественными услугами в городах Москва, Санкт-Петербург и других регионах, постоянно развиваясь и совершенствуясь. Мы заботимся о здоровье наших гостей, используя только натуральные продукты в приготовлении блюд.'
                                        }
                                    </p>

                                    <p className="text-base sm:text-lg leading-relaxed">
                                        {aboutText2 ||
                                            'Наши профессиональные технологи разрабатывают уникальные рецепты приготовления блюд, используя только натуральные, высококачественные сырье от производителя, что обеспечивает неповторимый вкус и аромат наших блюд.'
                                        }
                                    </p>
                                </>
                            )}
                        </div>

                        <motion.div
                            className="pt-4"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            viewport={{ once: true }}
                        >
                            <Link
                                href="/contacts"
                                className="inline-flex items-center justify-center rounded-lg bg-hi-platinum px-6 py-3 text-base font-medium text-hi-white shadow-hi transition-all hover:shadow-hi-hover hover:bg-hi-platinum/90 focus:outline-none focus:ring-2 focus:ring-hi-platinum focus:ring-offset-2"
                            >
                                СВЯЗАТЬСЯ С НАМИ
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
