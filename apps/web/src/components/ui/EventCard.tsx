'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { EventPage } from '@/lib/api';
import { Calendar, Crown, Users, Heart, Gift, Star, Sparkles } from 'lucide-react';
import { useFavorites } from '@/contexts/FavoritesContext';

interface EventCardProps {
    event: EventPage;
    onImageError?: (eventId: number) => void;
    className?: string;
}

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


export function EventCard({
    event,
    onImageError,
    className = ''
}: EventCardProps) {
    const [imageError, setImageError] = useState(false);
    const { addEvent, removeFavorite, isFavorite } = useFavorites();

    const handleImageError = () => {
        setImageError(true);
        onImageError?.(event.id);
    };

    const isEventFavorite = isFavorite(event.id, 'event');

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isEventFavorite) {
            removeFavorite(event.id, 'event');
        } else {
            addEvent(event);
        }
    };


    // Get the main image from arrays, prioritizing order:
    // 1. First image from event.Images (if it's an array)
    // 2. First image from GaleryOfMedia.Images
    // 3. First image from GaleryOfMedia.backgroundImg
    const mainImage =
        // Check if event.Images is an array and get first item
        (Array.isArray(event.Images) && event.Images.length > 0 ? event.Images[0] : null) ||
        // Check if event.Images is a single object
        (!Array.isArray(event.Images) && event.Images ? event.Images : null) ||
        // Check GaleryOfMedia.Images array
        (event.GaleryOfMedia?.Images && event.GaleryOfMedia.Images.length > 0 ?
            event.GaleryOfMedia.Images[0] : null) ||
        // Check GaleryOfMedia.backgroundImg array  
        (event.GaleryOfMedia?.backgroundImg && event.GaleryOfMedia.backgroundImg.length > 0 ?
            event.GaleryOfMedia.backgroundImg[0] : null);

    // Determine event category and styling based on title
    const getEventCategory = (title: string) => {
        const titleLower = title.toLowerCase();
        if (titleLower.includes('свадеб')) {
            return {
                badge: 'Романтика',
                badgeColor: 'bg-pink-500',
                icon: Heart,
                iconColor: 'text-pink-400',
                isPopular: true
            };
        } else if (titleLower.includes('корпорат')) {
            return {
                badge: 'Бизнес',
                badgeColor: 'bg-blue-500',
                icon: Users,
                iconColor: 'text-blue-400',
                isPopular: false
            };
        } else if (titleLower.includes('день рожден') || titleLower.includes('юбилей')) {
            return {
                badge: 'Праздник',
                badgeColor: 'bg-yellow-500',
                icon: Gift,
                iconColor: 'text-yellow-400',
                isPopular: true
            };
        } else if (titleLower.includes('семейн')) {
            return {
                badge: 'Семейный',
                badgeColor: 'bg-green-500',
                icon: Heart,
                iconColor: 'text-green-400',
                isPopular: false
            };
        } else {
            return {
                badge: 'Премиум',
                badgeColor: 'bg-purple-500',
                icon: Crown,
                iconColor: 'text-purple-400',
                isPopular: false
            };
        }
    };

    const category = getEventCategory(event.title);
    const IconComponent = category.icon;

    const backgroundStyle = mainImage && !imageError
        ? {
            backgroundImage: `url(${getImageUrl(mainImage.url)})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
        }
        : { backgroundColor: '#f3f4f6' };

    return (
        <Link
            href={`/events/${event.Slug || event.id}`}
            className={`relative rounded-lg shadow-hi hover:shadow-hi-hover transition-all duration-300 overflow-hidden group block cursor-pointer h-48 ${className}`}
            style={backgroundStyle}
        >
            {/* Background image error handling */}
            {mainImage && (
                <img
                    src={getImageUrl(mainImage.url)}
                    alt={mainImage.alternativeText || event.title}
                    className="hidden"
                    onError={handleImageError}
                />
            )}

            {/* Fallback for no image */}
            {(!mainImage || imageError) && (
                <div className="absolute inset-0 bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-600 text-sm text-center px-4">
                        {imageError ? "Ошибка загрузки" : "Нет изображения"}
                    </span>
                </div>
            )}

            {/* Top decorative badges */}
            <div className="absolute top-3 left-3 z-10 flex gap-2">
                {/* Category badge */}
                {/* <div className={`${category.badgeColor} text-white px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm bg-opacity-90 shadow-lg`}>
                    {category.badge}
                </div> */}
                {/* Popular badge */}
                {category.isPopular && (
                    <div className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm bg-opacity-90 shadow-lg flex items-center gap-1">
                        <Star size={10} className="fill-current" />
                        Популярно
                    </div>
                )}
            </div>

            {/* Top right icons */}
            <div className="absolute top-3 right-3 z-10 flex gap-2">
                {/* Favorite button */}
                <button
                    onClick={handleFavoriteClick}
                    className={`w-8 h-8 rounded-full backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-all duration-300 ${isEventFavorite
                        ? 'bg-red-500/90 text-white'
                        : 'bg-white/20 text-white/70 hover:text-red-300'
                        }`}
                    aria-label={isEventFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
                >
                    <Heart size={16} className={isEventFavorite ? 'fill-current' : ''} />
                </button>

            </div>

            {/* Gradient overlay from dark to transparent for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1E1F26]/90 via-[#1E1F26]/40 to-transparent" />

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Content Section - positioned at bottom with padding */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex items-end justify-between">
                    <div className="flex-1">
                        <h3 className="text-base font-semibold text-white leading-tight drop-shadow-lg group-hover:text-yellow-100 transition-colors">
                            {event.title}
                        </h3>
                        {/* Decorative line */}
                        <div className="w-12 h-0.5 bg-gradient-to-r from-yellow-400 to-transparent mt-2 opacity-75"></div>
                    </div>

                    {/* Rating stars */}
                    <div className="flex gap-0.5 ml-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                size={10}
                                className="text-yellow-400 fill-current opacity-80"
                            />
                        ))}
                    </div>
                </div>
            </div>
        </Link>
    );
}
