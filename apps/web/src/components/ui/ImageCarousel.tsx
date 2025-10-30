'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { StrapiImage } from './StrapiImage';

interface ImageCarouselProps {
    images: Array<{
        id: number | string;
        url: string;
        alternativeText?: string;
        caption?: string;
    }>;
    getImageUrl: (url: string) => string;
}

export function ImageCarousel({ images, getImageUrl }: ImageCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    // Количество картинок для отображения на десктопе
    const itemsToShow = 5;
    // Минимальная дистанция для свайпа (50px)
    const minSwipeDistance = 50;

    // Вычисляем максимальный индекс для прокрутки
    const maxIndex = Math.max(0, images.length - itemsToShow);

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? maxIndex : prevIndex - 1
        );
    };

    const goToNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex >= maxIndex ? 0 : prevIndex + 1
        );
    };

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            goToNext();
        }
        if (isRightSwipe) {
            goToPrevious();
        }
    };

    if (images.length === 0) return null;

    return (
        <div className="relative w-full">
            {/* Carousel Container */}
            <div
                className="relative w-full overflow-hidden"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                {/* Images Grid */}
                <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{
                        transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)`,
                        width: `${(images.length / itemsToShow) * 100}%`
                    }}
                >
                    {images.map((image, index) => (
                        <div
                            key={image.id}
                            className="flex-shrink-0 px-2"
                            style={{ width: `${100 / images.length}%` }}
                        >
                            <div className="relative aspect-square rounded-lg overflow-hidden group">
                                <StrapiImage
                                    src={getImageUrl(image.url)}
                                    alt={image.alternativeText || `Gallery image ${index + 1}`}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Navigation Arrows */}
                {images.length > itemsToShow && (
                    <>
                        <button
                            onClick={goToPrevious}
                            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-hi-graphite p-2 rounded-full shadow-lg transition-all z-10"
                            aria-label="Previous images"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            onClick={goToNext}
                            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-hi-graphite p-2 rounded-full shadow-lg transition-all z-10"
                            aria-label="Next images"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </>
                )}
            </div>

            {/* Image Counter */}
            {images.length > itemsToShow && (
                <div className="text-center mt-4 text-hi-graphite text-sm">
                    Показано {Math.min(currentIndex + itemsToShow, images.length)} из {images.length}
                </div>
            )}
        </div>
    );
}
