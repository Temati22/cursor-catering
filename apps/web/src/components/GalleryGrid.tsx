'use client';

import Image from 'next/image';
import { getImageUrl } from '@/lib/imageUtils';

interface GalleryImage {
    id: number;
    documentId: string;
    name: string;
    url: string;
    alternativeText?: string;
    caption?: string;
    width: number;
    height: number;
    formats?: {
        thumbnail?: { url: string; width: number; height: number };
        small?: { url: string; width: number; height: number };
        medium?: { url: string; width: number; height: number };
        large?: { url: string; width: number; height: number };
    };
}

interface GalleryGridProps {
    images: GalleryImage[];
}

export function GalleryGrid({ images }: GalleryGridProps) {
    if (!images || images.length === 0) {
        return (
            <div className="text-center py-20">
                <div className="bg-white rounded-2xl shadow-hi p-12 border border-hi-silver/30">
                    <svg
                        className="mx-auto h-16 w-16 text-hi-graphite/40 mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                    </svg>
                    <h3 className="text-xl font-semibold text-hi-graphite mb-2">
                        Фотографии скоро появятся
                    </h3>
                    <p className="text-hi-graphite/70">
                        Мы работаем над наполнением галереи. Загляните позже!
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image, index) => {
                const imageUrl = getImageUrl(image.url);
                const thumbnailUrl = image.formats?.medium?.url 
                    ? getImageUrl(image.formats.medium.url)
                    : image.formats?.small?.url 
                    ? getImageUrl(image.formats.small.url)
                    : imageUrl;

                return (
                    <div
                        key={image.id || index}
                        className="group relative aspect-square rounded-2xl overflow-hidden shadow-hi hover:shadow-hi-hover transition-all duration-300 border border-hi-silver/30 bg-white"
                    >
                        <Image
                            src={thumbnailUrl}
                            alt={image.alternativeText || image.caption || `Gallery image ${index + 1}`}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            loading={index < 6 ? 'eager' : 'lazy'}
                            quality={85}
                            unoptimized={process.env.NODE_ENV === 'development'}
                            onError={(e) => {
                                console.error(`[Gallery] Failed to load image:`, thumbnailUrl);
                            }}
                        />
                        {/* Overlay with caption */}
                        {(image.caption || image.alternativeText) && (
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                                <p className="text-white p-4 text-sm font-medium">
                                    {image.caption || image.alternativeText}
                                </p>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

