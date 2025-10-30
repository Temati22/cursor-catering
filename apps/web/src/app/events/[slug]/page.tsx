'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Image as ImageIcon, ShoppingCart, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { apiClient, EventPage, Menu } from '@/lib/api';
import { Breadcrumbs, BreadcrumbItem } from '@/components/ui/Breadcrumbs';
import { StrapiImage } from '@/components/ui/StrapiImage';
import { ImageCarousel } from '@/components/ui/ImageCarousel';
import { CompactCtaSection } from '@/components/sections/CompactCtaSection';
import { EventMenusSection } from '@/components/sections/EventMenusSection';
import { EventDishesSection } from '@/components/sections/EventDishesSection';

// Common CSS classes
const CONTAINER_CLASSES = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8";
const API_BASE_URL = "http://localhost:1337";

// Helper function to get absolute URL for images
const getImageUrl = (url: string): string => {
    if (url.startsWith('http')) {
        return url;
    }
    return `${API_BASE_URL}${url}`;
};

interface EventPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default function EventPageDetail({ params }: EventPageProps) {
    // Unwrap the params Promise using React.use()
    const { slug } = use(params);

    const [eventPage, setEventPage] = useState<EventPage | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const fetchEventPage = async () => {
            try {
                setLoading(true);
                const response = await apiClient.getEventPageBySlug(slug);
                const events = response.data || [];
                if (events.length > 0) {
                    const event = events[0];
                    setEventPage(event);
                } else {
                    setError('Страница мероприятия не найдена');
                }
            } catch (err) {
                console.error('Error fetching event page:', err);
                setError('Не удалось загрузить страницу мероприятия');
            } finally {
                setLoading(false);
            }
        };

        fetchEventPage();
    }, [slug]);

    // Собираем все доступные изображения
    const getAllImages = () => {
        const images = [];

        // Основное изображение (может быть объектом или массивом)
        if (eventPage?.Images) {
            if (Array.isArray(eventPage.Images)) {
                images.push(...eventPage.Images);
            } else if (eventPage.Images.url) {
                images.push(eventPage.Images);
            }
        }

        // Изображения из галереи
        if (eventPage?.GaleryOfMedia?.Images && Array.isArray(eventPage.GaleryOfMedia.Images)) {
            images.push(...eventPage.GaleryOfMedia.Images);
        }

        // Фоновые изображения из галереи
        if (eventPage?.GaleryOfMedia?.backgroundImg && Array.isArray(eventPage.GaleryOfMedia.backgroundImg)) {
            images.push(...eventPage.GaleryOfMedia.backgroundImg);
        }

        return images.filter(img => img && img.url);
    };

    const renderImageSection = () => {
        const images = getAllImages();

        if (images.length === 0) {
            return (
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-hi-ash flex items-center justify-center">
                    <div className="text-center text-hi-silver">
                        <ImageIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <p>Изображение не найдено</p>
                    </div>
                </div>
            );
        }

        if (images.length === 1) {
            // Одно изображение - показываем просто
            return (
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                    <StrapiImage
                        src={getImageUrl(images[0].url)}
                        alt={images[0].alternativeText || eventPage?.title || 'Event image'}
                        fill
                        className="object-cover"
                        priority
                    />
                    {/* Градиент для лучшего восприятия */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/5 via-transparent to-white/10"></div>
                </div>
            );
        }

        // Несколько изображений - показываем слайдер
        const currentImage = images[currentImageIndex];

        const nextImage = () => {
            setCurrentImageIndex((prev) => (prev + 1) % images.length);
        };

        const prevImage = () => {
            setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
        };

        return (
            <div className="relative">
                {/* Основное изображение */}
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                    <StrapiImage
                        src={getImageUrl(currentImage.url)}
                        alt={currentImage.alternativeText || eventPage?.title || 'Event image'}
                        fill
                        className="object-cover transition-opacity duration-300"
                        priority
                    />
                    {/* Градиент для лучшего восприятия */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/5 via-transparent to-white/10"></div>

                    {/* Навигация слайдера */}
                    <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200 text-white hover:scale-110"
                        aria-label="Предыдущее изображение"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>

                    <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200 text-white hover:scale-110"
                        aria-label="Следующее изображение"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>

                    {/* Индикаторы */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentImageIndex(index)}
                                className={`w-2 h-2 rounded-full transition-all duration-200 ${index === currentImageIndex
                                    ? 'bg-white scale-125'
                                    : 'bg-white/50 hover:bg-white/70'
                                    }`}
                                aria-label={`Изображение ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Счетчик изображений */}
                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                    {currentImageIndex + 1} / {images.length}
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-hi-white">
                <div className={`${CONTAINER_CLASSES} py-16`}>
                    <div className="animate-pulse">
                        <div className="h-12 bg-hi-silver rounded w-1/3 mb-6"></div>
                        <div className="h-64 bg-hi-silver rounded mb-8"></div>
                        <div className="space-y-4">
                            <div className="h-4 bg-hi-silver rounded w-full"></div>
                            <div className="h-4 bg-hi-silver rounded w-5/6"></div>
                            <div className="h-4 bg-hi-silver rounded w-4/6"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !eventPage) {
        return (
            <div className="min-h-screen bg-hi-white">
                <div className={`${CONTAINER_CLASSES} py-16`}>
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-hi-graphite mb-4">
                            {error || 'Страница не найдена'}
                        </h1>
                        <Link
                            href="/events"
                            className="inline-flex items-center text-hi-platinum hover:text-hi-green transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Вернуться к мероприятиям
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Подготавливаем хлебные крошки
    const breadcrumbItems: BreadcrumbItem[] = [
        { label: 'Главная', href: '/' },
        { label: 'События', href: '/events' },
        { label: eventPage.title }
    ];

    return (
        <div className="min-h-screen bg-hi-white">
            {/* Breadcrumb */}
            <Breadcrumbs items={breadcrumbItems} />

            {/* Main Content */}
            <article className={`${CONTAINER_CLASSES} py-12`}>
                {/* Header */}
                <section className="mb-12">
                    <div className="mb-8 bg-white rounded-2xl shadow-hi hover:shadow-hi-hover transition-all duration-300 p-8 lg:p-12 border border-hi-silver/30">
                        {/* Description and Image Layout */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                            {/* Description */}
                            <div className="space-y-6">
                                <h1 className="text-4xl font-bold text-hi-graphite mb-6">
                                    {eventPage.title}
                                </h1>

                                {eventPage.Description && (
                                    <div
                                        className="text-hi-graphite text-lg leading-relaxed prose prose-lg max-w-none prose-headings:text-hi-graphite prose-p:text-hi-graphite prose-strong:text-hi-graphite"
                                        dangerouslySetInnerHTML={{ __html: eventPage.Description }}
                                    />
                                )}

                                {/* Кнопки */}
                                <div className="space-y-4 pt-4">
                                    {eventPage.Presentation?.url && (
                                        <Link
                                            href={`${API_BASE_URL}${eventPage.Presentation.url}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-3 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 group"
                                        >
                                            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                                                <Download className="h-4 w-4" />
                                            </div>
                                            Скачать PDF презентацию
                                        </Link>
                                    )}

                                    <Link
                                        href="/contacts"
                                        className="inline-flex items-center gap-3 px-6 py-3 bg-hi-platinum hover:opacity-90 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                                    >
                                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                            <ShoppingCart className="h-4 w-4" />
                                        </div>
                                        Заказать кейтеринг
                                    </Link>
                                </div>
                            </div>

                            {/* Image Slider */}
                            <div className="space-y-4">
                                {renderImageSection()}
                            </div>
                        </div>
                    </div>
                </section>

                {/* SEO Content Section */}
                {eventPage.SeoMenus && Array.isArray(eventPage.SeoMenus) && eventPage.SeoMenus.length > 0 &&
                    eventPage.SeoMenus.map((seoBlock, seoIndex) => (
                        <section key={seoIndex} className="text-left p-12">
                            {seoBlock.Title && (
                                <h2 className="text-3xl font-bold text-hi-graphite text-left">
                                    {seoBlock.Title}
                                </h2>
                            )}
                            {seoBlock.Description && (
                                <div className="prose prose-lg max-w-none text-hi-graphite mx-auto">
                                    <div
                                        className="leading-relaxed"
                                        dangerouslySetInnerHTML={{ __html: seoBlock.Description }}
                                    />
                                </div>
                            )}
                            {seoBlock.SubTitle && (
                                <h3 className="text-xl font-semibold text-hi-platinum mb-8 mt-8">
                                    {seoBlock.SubTitle}
                                </h3>
                            )}
                        </section>
                    ))
                }

                {/* Event Menus Section */}
                {eventPage.menus && Array.isArray(eventPage.menus) && eventPage.menus.length > 0 &&
                    eventPage.menus.map((menuBlock, blockIndex) => {
                        // Extract menus from the block
                        const menus: Menu[] = Array.isArray(menuBlock.menus)
                            ? menuBlock.menus
                            : [];

                        return menus.length > 0 ? (
                            <EventMenusSection
                                key={blockIndex}
                                menus={menus}
                                getImageUrl={getImageUrl}
                            />
                        ) : null;
                    })
                }

                {/* CTA Section */}
                <CompactCtaSection
                    variant="primary"
                    title="Готовы организовать ваше мероприятие?"
                    subtitle="Свяжитесь с нами для бесплатной консультации"
                    ctaText="Заказать кейтеринг"
                    showContactInfo={true}
                />


                {/* Event Dishes Section */}
                <EventDishesSection
                    title="Блюда для мероприятия"
                    dishes={eventPage.dishes}
                />

                {/* CTA Section */}
                <CompactCtaSection
                    variant="primary"
                    title="Готовы организовать ваше мероприятие?"
                    subtitle="Свяжитесь с нами для бесплатной консультации"
                    ctaText="Заказать кейтеринг"
                    showContactInfo={true}
                />

                {/* Gallery */}
                {eventPage.GaleryOfMedia && eventPage.GaleryOfMedia.Images && Array.isArray(eventPage.GaleryOfMedia.Images) && eventPage.GaleryOfMedia.Images.length > 0 ? (
                    <section className="mb-12 mt-12">
                        {eventPage.GaleryOfMedia.Title && (
                            <h2 className="text-xl font-semibold text-hi-graphite mb-4">{eventPage.GaleryOfMedia.Title}</h2>
                        )}
                        <ImageCarousel
                            images={eventPage.GaleryOfMedia.Images}
                            getImageUrl={getImageUrl}
                        />
                    </section>
                ) : null}

            </article>
        </div>
    );
}
