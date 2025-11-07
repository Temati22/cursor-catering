'use client';

import { useState, useEffect } from 'react';
import { Star, ShoppingCart } from 'lucide-react';
import { apiClient, Dish } from '@/lib/api';
import { StrapiImage } from '@/components/ui/StrapiImage';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { Button } from '@/components/ui/Button';
import { FallbackComponent } from '@/components/ui/FallbackComponent';
import { getImageUrl } from '@/lib/imageUtils';

interface PopularFoodSectionProps {
    limit?: number;
    title?: string;
    subtitle?: string;
}

export function PopularFoodSection({
    limit = 3,
    title = "Самая популярная еда",
    subtitle = "Попробуйте наши лучшие блюда"
}: PopularFoodSectionProps) {
    const [dishes, setDishes] = useState<Dish[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

    useEffect(() => {
        const fetchDishes = async () => {
            try {
                setLoading(true);
                const response = await apiClient.getDishes({
                    populate: '*'
                });
                const allDishes = response.data || [];
                // Limit dishes on client side since server pagination causes 400 errors
                setDishes(allDishes.slice(0, limit));
            } catch (err) {
                console.error('Error fetching dishes:', err);
                setError('Не удалось загрузить блюда');
            } finally {
                setLoading(false);
            }
        };

        fetchDishes();
    }, [limit]);

    const handleAddToCart = (dish: Dish) => {
        // TODO: Implement add to cart functionality
    };

    const renderStars = (rating: number = 5) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`w-4 h-4 ${i < rating ? 'text-hi-platinum fill-hi-platinum' : 'text-hi-silver'
                    }`}
            />
        ));
    };

    if (loading) {
        return (
            <section className="py-16 bg-hi-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">
                            <span className="text-hi-graphite">Самая популярная</span>{' '}
                            <span className="text-hi-platinum">еда</span>
                        </h2>
                        <p className="text-lg text-hi-graphite max-w-2xl mx-auto">
                            {subtitle}
                        </p>
                    </div>
                    <FallbackComponent
                        message="Загружаем популярные блюда..."
                        size="lg"
                        variant="card"
                    />
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="py-16 bg-hi-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold mb-4">
                            <span className="text-hi-graphite">Самая популярная</span>{' '}
                            <span className="text-hi-platinum">еда</span>
                        </h2>
                        <FallbackComponent
                            message={error}
                            size="lg"
                            variant="card"
                            className="border-red-200 bg-red-50 text-red-600"
                        />
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 bg-hi-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">
                        <span className="text-hi-graphite">Самая популярная</span>{' '}
                        <span className="text-hi-platinum">еда</span>
                    </h2>
                    <p className="text-lg text-hi-graphite max-w-2xl mx-auto">
                        {subtitle}
                    </p>
                </div>

                {dishes.length === 0 ? (
                    <FallbackComponent
                        message="Популярные блюда пока не добавлены"
                        size="md"
                        variant="minimal"
                    />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {dishes.map((dish) => (
                            <div
                                key={dish.id}
                                className="bg-hi-white rounded-lg shadow-hi overflow-hidden hover:shadow-hi-hover transition-shadow duration-300"
                            >
                                {/* Image */}
                                {dish.images && dish.images.length > 0 && dish.images[0] && dish.images[0].url && !imageErrors.has(dish.id) ? (
                                    <div className="relative h-48">
                                        <StrapiImage
                                            src={getImageUrl(dish.images[0].url)}
                                            alt={dish.images[0].alternativeText || dish.name}
                                            fill
                                            className="object-cover"
                                            onError={() => setImageErrors(prev => new Set(prev).add(dish.id))}
                                        />
                                    </div>
                                ) : (
                                    <ImagePlaceholder
                                        className="h-48"
                                        text={imageErrors.has(dish.id) ? "Ошибка загрузки" : "Нет изображения"}
                                    />
                                )}

                                {/* Content */}
                                <div className="p-6">
                                    {/* Title */}
                                    <h3 className="text-xl font-semibold text-hi-graphite mb-2">
                                        {dish.name}
                                    </h3>

                                    {/* Rating */}
                                    <div className="flex items-center mb-4">
                                        {renderStars()}
                                    </div>

                                    {/* Price and Add to Cart */}
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-bold text-hi-graphite">
                                            {dish.price} {dish.currency}
                                        </span>
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            onClick={() => handleAddToCart(dish)}
                                            className="bg-hi-platinum hover:bg-hi-platinum/90 text-white"
                                        >
                                            <ShoppingCart className="w-4 h-4 mr-1" />
                                            В корзину
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination dots */}
                <div className="flex justify-center mt-8">
                    <div className="flex space-x-2">
                        {[...Array(Math.ceil(dishes.length / 3))].map((_, i) => (
                            <button
                                key={i}
                                className={`w-3 h-3 rounded-full transition-colors duration-200 ${i === 0 ? 'bg-hi-platinum' : 'bg-hi-silver'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
