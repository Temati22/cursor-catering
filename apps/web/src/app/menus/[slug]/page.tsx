'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, Users, ChefHat } from 'lucide-react';
import { apiClient, Menu, getImageUrl } from '@/lib/api';
import { StrapiImage } from '@/components/ui/StrapiImage';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { OrderButton } from '@/components/ui/OrderButton';
import { DishMiniCard } from '@/components/ui/DishMiniCard';
import { ReviewsSection } from '@/components/ui/ReviewsSection';

export default function MenuDetailPage() {
    const params = useParams();
    const slug = params.slug as string;

    const [menu, setMenu] = useState<Menu | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                setLoading(true);
                const response = await apiClient.getMenuBySlug(slug);
                const menuData = response.data?.[0];

                if (!menuData) {
                    setError('Меню не найдено');
                    return;
                }

                setMenu(menuData);
            } catch (err) {
                console.error('Error fetching menu:', err);
                setError('Не удалось загрузить меню');
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchMenu();
        }
    }, [slug]);

    const getTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            breakfast: 'Завтрак',
            lunch: 'Обед',
            dinner: 'Ужин',
            brunch: 'Бранч',
            snacks: 'Закуски',
            beverages: 'Напитки',
            desserts: 'Десерты',
            special: 'Специальное'
        };
        return labels[type] || type;
    };

    const getOccasionLabel = (occasion: string) => {
        const labels: Record<string, string> = {
            wedding: 'Свадьба',
            corporate: 'Корпоратив',
            birthday: 'День рождения',
            anniversary: 'Юбилей',
            holiday: 'Праздник',
            casual: 'Повседневное',
            formal: 'Официальное',
            buffet: 'Фуршет'
        };
        return labels[occasion] || occasion;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="h-96 bg-gray-200 rounded-lg"></div>
                            <div className="space-y-4">
                                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-200 rounded w-full"></div>
                                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !menu) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">
                            {error || 'Меню не найдено'}
                        </h1>
                        <Link
                            href="/menus"
                            className="inline-flex items-center px-4 py-2 bg-hi-green text-white rounded-lg hover:bg-hi-green-dark transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Вернуться к меню
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                {/* Breadcrumb */}
                <nav className="mb-8">
                    <Link
                        href="/menus"
                        className="inline-flex items-center text-hi-green hover:text-hi-green-dark transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Все меню
                    </Link>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Menu Images */}
                    <div className="space-y-4">
                        {menu.image && menu.image.length > 0 ? (
                            <div className="relative h-96 rounded-lg overflow-hidden">
                                <StrapiImage
                                    src={getImageUrl(menu.image[0].url)}
                                    alt={menu.image[0].alternativeText || menu.name}
                                    fill
                                    className="object-cover"
                                    onError={() => setImageErrors(prev => new Set(prev).add(menu.id))}
                                />
                            </div>
                        ) : (
                            <ImagePlaceholder
                                className="h-96"
                                text={imageErrors.has(menu.id) ? "Ошибка загрузки" : "Нет изображения"}
                            />
                        )}

                        {/* Additional Images */}
                        {menu.image && menu.image.length > 1 && (
                            <div className="grid grid-cols-2 gap-4">
                                {menu.image.slice(1, 3).map((img, index) => (
                                    <div key={index} className="relative h-32 rounded-lg overflow-hidden">
                                        <StrapiImage
                                            src={getImageUrl(img.url)}
                                            alt={img.alternativeText || `${menu.name} ${index + 2}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Dishes */}
                        {menu.dishes && menu.dishes.length > 0 && (
                            <div className="bg-white rounded-lg border border-gray-200 p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                                    <ChefHat className="w-5 h-5 mr-2 text-hi-green" />
                                    Блюда в меню ({menu.dishes.length})
                                </h2>

                                <div className="space-y-4">
                                    {menu.dishes.map((dish) => (
                                        <DishMiniCard
                                            key={dish.id}
                                            dish={dish}
                                            className="h-auto"
                                        />
                                    ))}
                                </div>
                            </div>
                        )}


                    </div>

                    {/* Menu Details */}
                    <div className="space-y-6">
                        {/* Header */}
                        <div>
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="px-3 py-1 bg-hi-platinum bg-opacity-30 text-hi-graphite text-sm rounded-full font-medium">
                                    {getTypeLabel(menu.type)}
                                </span>
                                <span className="px-3 py-1 bg-hi-ash text-hi-graphite text-sm rounded-full font-medium">
                                    {getOccasionLabel(menu.occasion)}
                                </span>
                                {menu.servingSize && (
                                    <span className="px-3 py-1 bg-hi-silver text-hi-graphite text-sm rounded-full font-medium">
                                        на {menu.servingSize} чел
                                    </span>
                                )}
                            </div>

                            <h1 className="text-3xl font-bold text-gray-900 mb-4">{menu.name}</h1>
                        </div>

                        {/* Price and Order */}
                        {menu.pricePerPerson && (
                            <div className="bg-white rounded-lg border border-gray-200 p-6">
                                <div className="text-center mb-6">
                                    <div className="text-3xl font-bold text-hi-green mb-2">
                                        {menu.pricePerPerson} {menu.currency}/чел
                                    </div>
                                    <p className="text-gray-600">Цена за одного человека</p>
                                </div>

                                <OrderButton menu={menu} />
                            </div>
                        )}


                        {/* Menu Info */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Информация о меню</h2>

                            <div className="space-y-3">
                                {menu.servingSize && (
                                    <div className="flex items-center text-gray-600">
                                        <Users className="w-5 h-5 mr-3 text-hi-green" />
                                        <span>До {menu.servingSize} человек</span>
                                    </div>
                                )}

                                {menu.validFrom && (
                                    <div className="flex items-center text-gray-600">
                                        <Clock className="w-5 h-5 mr-3 text-hi-green" />
                                        <span>Действует с {new Date(menu.validFrom).toLocaleDateString()}</span>
                                    </div>
                                )}

                            </div>
                        </div>

                        {menu.description && (
                            <div className="bg-white rounded-lg border border-gray-200 p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Описание меню</h2>

                                <p className="text-lg text-gray-600 leading-relaxed">{menu.description}</p>

                            </div>
                        )}

                        {/* Reviews */}
                        <ReviewsSection
                            reviews={[
                                {
                                    id: 1,
                                    author: 'Анна Петрова',
                                    rating: 5,
                                    comment: 'Отличное меню! Все блюда были очень вкусными и свежими. Особенно понравился стейк из говядины. Обслуживание на высшем уровне.',
                                    date: '2024-10-20',
                                    avatar: undefined
                                },
                                {
                                    id: 2,
                                    author: 'Михаил Соколов',
                                    rating: 4,
                                    comment: 'Хорошее качество еды, но порции могли бы быть немного больше. В целом остался доволен.',
                                    date: '2024-10-18',
                                    avatar: undefined
                                },
                                {
                                    id: 3,
                                    author: 'Елена Козлова',
                                    rating: 5,
                                    comment: 'Прекрасное меню для корпоративного мероприятия! Все гости были в восторге. Рекомендую!',
                                    date: '2024-10-15',
                                    avatar: undefined
                                }
                            ]}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}