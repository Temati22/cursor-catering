'use client';

import { useState, useEffect } from 'react';
import { apiClient, Dish } from '@/lib/api';
import { DishCard } from '@/components/ui/DishCard';
import { FallbackComponent } from '@/components/ui/FallbackComponent';

interface DishesSectionProps {
    limit?: number;
    showPrice?: boolean;
    showDescription?: boolean;
}

export function DishesSection({
    limit = 6,
    showPrice = true,
    showDescription = true
}: DishesSectionProps) {
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

    if (loading) {
        return (
            <section className="py-16 bg-hi-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-hi-graphite mb-8">Наши блюда</h2>
                        <FallbackComponent
                            message="Загружаем блюда..."
                            size="lg"
                            variant="card"
                        />
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="py-16 bg-hi-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-hi-graphite mb-8">Наши блюда</h2>
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
                    <h2 className="text-3xl font-bold text-hi-graphite mb-4">Наши блюда</h2>
                    <p className="text-lg text-hi-graphite max-w-2xl mx-auto">
                        Откройте для себя наше разнообразное меню, приготовленное с любовью и вниманием к деталям
                    </p>
                </div>

                {dishes.length === 0 ? (
                    <FallbackComponent
                        message="Блюда пока не добавлены"
                        size="md"
                        variant="minimal"
                    />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {dishes.map((dish) => (
                            <DishCard
                                key={dish.id}
                                dish={dish}
                                showPrice={showPrice}
                                showDescription={showDescription}
                                onImageError={(dishId) => setImageErrors(prev => new Set(prev).add(dishId))}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
