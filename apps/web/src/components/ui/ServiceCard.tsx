'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Service } from '@/lib/api';
import { StrapiImage } from './StrapiImage';
import { ImagePlaceholder } from './ImagePlaceholder';
import { getImageUrl } from '@/lib/imageUtils';
import { useFavorites } from '@/contexts/FavoritesContext';
import { Heart } from 'lucide-react';

interface ServiceCardProps {
    service: Service;
    showDescription?: boolean;
    onImageError?: (serviceId: number) => void;
    className?: string;
}

export function ServiceCard({
    service,
    showDescription = true,
    onImageError,
    className = ''
}: ServiceCardProps) {
    const [imageError, setImageError] = useState(false);
    const { addService: addServiceToFavorites, removeFavorite, isFavorite } = useFavorites();

    const handleImageError = () => {
        setImageError(true);
        onImageError?.(service.id);
    };

    const isServiceFavorite = isFavorite(service.id, 'service');

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isServiceFavorite) {
            removeFavorite(service.id, 'service');
        } else {
            addServiceToFavorites(service);
        }
    };

    const firstImage = service.Images && service.Images.length > 0 ? service.Images[0] : null;
    const serviceTitle = service.TitleInmenu || service.Title;

    return (
        <Link
            href={`/services/${service.slug}`}
            className={`flex flex-col bg-white rounded-2xl shadow-hi hover:shadow-hi-hover transition-all duration-300 overflow-hidden group cursor-pointer h-full ${className}`}
        >
            {/* Image Section */}
            <div className="relative h-48 overflow-hidden">
                {firstImage && !imageError ? (
                    <StrapiImage
                        src={getImageUrl(firstImage.url)}
                        alt={firstImage.alternativeText || serviceTitle}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={handleImageError}
                    />
                ) : (
                    <ImagePlaceholder
                        className="h-48"
                        text={imageError ? "Ошибка загрузки" : "Нет изображения"}
                    />
                )}

                {/* Favorite button */}
                <button
                    onClick={handleFavoriteClick}
                    className={`absolute top-3 right-3 w-8 h-8 rounded-full backdrop-blur-sm flex items-center justify-center transition-all duration-300 z-10 ${isServiceFavorite
                        ? 'bg-red-500/90 text-white'
                        : 'bg-white/80 text-gray-600 hover:text-red-500 hover:bg-white'
                        }`}
                    aria-label={isServiceFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
                >
                    <Heart size={16} className={isServiceFavorite ? 'fill-current' : ''} />
                </button>
            </div>

            {/* Content Section */}
            <div className="p-6 flex flex-col flex-1 justify-between">
                <div>
                    <h3 className="text-lg font-bold text-hi-graphite leading-tight mb-2 group-hover:text-[#BFA76F] transition-colors">
                        {serviceTitle}
                    </h3>
                    {showDescription && (service.ShortDescription) && (
                        <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                            {service.ShortDescription}
                        </p>
                    )}
                </div>
            </div>
        </Link>
    );
}
