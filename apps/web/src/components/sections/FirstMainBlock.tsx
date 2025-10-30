'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useGlobalData } from '@/hooks/useGlobalData';
import { StrapiImage } from '@/components/ui/StrapiImage';
import { FallbackComponent } from '@/components/ui/FallbackComponent';
import { FullWidthBgSection } from '@/components/ui/FullWidthBgSection';
import { getImageWithFallback, getImageUrl, createFullBackground } from '@/lib/imageUtils';
import styles from './FirstMainBlock.module.css';





interface FirstMainBlockProps {
    onOpenPopup?: () => void;
}

export function FirstMainBlock({ onOpenPopup }: FirstMainBlockProps) {
    const { globalData, heroTitle, heroSubtitle, heroDescription, loading, ctaImage } = useGlobalData();
    const [imageError, setImageError] = useState(false);

    // Получаем изображение с fallback для надёжности
    const heroImageData = getImageWithFallback(globalData?.heroImage, 'hero', 'original');

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

    // Отладочная информация
    console.log('ctaImage:', ctaImage);
    console.log('ctaImage?.url:', ctaImage?.url);

    // Временно используем отдельные свойства для гарантии отображения
    return (
        <FullWidthBgSection
            backgroundImage={heroImageData.url}
            backgroundColor="#f1f2f0"
            backgroundPosition="right top"
            backgroundSize="contain"
            backgroundRepeat="no-repeat"
            minHeight="500px"
            containerWidth="w-full max-w-7xl mx-auto py-12"
            containerClassName="flex items-center justify-start"
        >


            {/* Left Column - Content */}

            <motion.div
                className={styles.content}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
            >
                {/* Logo */}
                <div className={styles.logo}>
                    {ctaImage?.url && !imageError ? (
                        <StrapiImage
                            src={getImageUrl(ctaImage.url)}
                            alt={ctaImage.alternativeText || "Logo"}
                            width={200}
                            height={200}
                            onError={() => {
                                setImageError(true);
                            }}
                        />
                    ) : (
                        <>
                            <StrapiImage src="/Logo.png" alt="Logo" width={100} height={300} />
                        </>
                    )}
                </div>

                {loading ? (
                    <div className="space-y-4">
                        <FallbackComponent
                            message="Загружаем данные главной страницы..."
                            size="lg"
                            variant="minimal"
                        />
                    </div>
                ) : (
                    <>
                        {/* Title */}
                        <h1 className={styles.title}>
                            Кейтеринг ресторанного уровня в Санкт-Петербурге.
                        </h1>

                        {/* Description */}
                        <p className={styles.description}>
                            Мы создаём вкус, эстетику и атмосферу — от камерных встреч до масштабных праздников.
                        </p>
                    </>
                )}

                {/* CTA Button */}
                <motion.button
                    className={styles.ctaButton}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    onClick={onOpenPopup}
                >
                    ЗАКАЗАТЬ КЕЙТЕРИНГ
                </motion.button>
            </motion.div>



        </FullWidthBgSection>
    );
}
