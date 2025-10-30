'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Advantage } from '@/lib/api';
import apiClient, { getImageUrl } from '@/lib/api';
import styles from './AdvantagesGrid.module.css';
import { StrapiImage } from '@/components/ui/StrapiImage';
import { FallbackComponent } from '@/components/ui/FallbackComponent';
import {
    Truck,
    ChefHat,
    Users,
    Clock,
    CreditCard,
    CheckCircle,
    Leaf,
    Star,
    Award,
    Shield
} from 'lucide-react';

interface AdvantagesGridProps {
    /** Преимущества для отображения. Если не переданы, будут загружены из API */
    advantages?: Advantage[];
    /** Максимальное количество отображаемых преимуществ */
    maxItems?: number;
    /** Отображать ли компонент, если нет данных */
    showWhenEmpty?: boolean;
    /** Кастомное сообщение при отсутствии данных */
    emptyMessage?: string;
}

// Иконки для каждого преимущества по индексу
const getAdvantageIcon = (index: number) => {
    const icons = [
        Truck,      // 0 - География без границ / Доставка
        ChefHat,    // 1 - Профессиональные повара
        Users,      // 2 - Индивидуальный подход
        Clock,      // 3 - Доставка точно в срок
        CreditCard, // 4 - Гибкие тарифы
        CheckCircle,// 5 - Полный сервис
        Leaf,       // 6 - Экологичность
        Star,       // 7 - Качество
        Award,      // 8 - Профессионализм
        Shield      // 9 - Надежность
    ];

    return icons[index % icons.length];
};

/**
 * Компонент для отображения сетки преимуществ компании
 * Отображает преимущества в формате 3+4 (топ ряд - 3 элемента, нижний - 4)
 * С иконками, нумерацией и выравниванием по левому краю
 */
const AdvantagesGrid: React.FC<AdvantagesGridProps> = ({
    advantages: propAdvantages,
    maxItems = 7,
    showWhenEmpty = false,
    emptyMessage = "Преимущества пока не добавлены"
}) => {
    const [advantages, setAdvantages] = useState<Advantage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAdvantages = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // Если преимущества переданы через пропсы, используем их
            if (propAdvantages) {
                setAdvantages(propAdvantages.slice(0, maxItems));
                return;
            }

            // Загружаем с API
            const response = await apiClient.getAdvantages();
            const apiAdvantages = response?.data || [];

            setAdvantages(apiAdvantages.slice(0, maxItems));
        } catch (err) {
            const errorMessage = err instanceof Error
                ? err.message
                : 'Не удалось загрузить преимущества';

            setError(errorMessage);

            // Логируем ошибку для мониторинга (только в development)
            if (process.env.NODE_ENV === 'development') {
                console.error('AdvantagesGrid: Error fetching advantages:', err);
            }
        } finally {
            setLoading(false);
        }
    }, [propAdvantages, maxItems]);

    useEffect(() => {
        fetchAdvantages();
    }, [fetchAdvantages]);

    // Мемоизируем разделение на ряды для оптимизации
    const { topAdvantages, bottomAdvantages } = useMemo(() => {
        return {
            topAdvantages: advantages.slice(0, 3),
            bottomAdvantages: advantages.slice(3, maxItems)
        };
    }, [advantages, maxItems]);

    // Обработка состояния загрузки
    if (loading) {
        return (
            <section className={styles.advantagesGrid} aria-label="Загрузка преимуществ">
                <div className={styles.container}>
                    <FallbackComponent
                        message="Загружаем преимущества..."
                        size="lg"
                        variant="card"
                    />
                </div>
            </section>
        );
    }

    // Обработка ошибок
    if (error) {
        return (
            <section className={styles.advantagesGrid} aria-label="Ошибка загрузки преимуществ">
                <div className={styles.container}>
                    <FallbackComponent
                        message={`Ошибка загрузки: ${error}`}
                        size="lg"
                        variant="card"
                        className="border-red-200 bg-red-50 text-red-600"
                    />
                </div>
            </section>
        );
    }

    // Обработка пустого состояния
    if (advantages.length === 0) {
        if (!showWhenEmpty) {
            return null;
        }

        return (
            <section className={styles.advantagesGrid} aria-label="Преимущества отсутствуют">
                <div className={styles.container}>
                    <FallbackComponent
                        message={emptyMessage}
                        size="md"
                        variant="minimal"
                    />
                </div>
            </section>
        );
    }

    return (
        <section className={styles.advantagesGrid} aria-label="Наши преимущества">

            <div className={styles.container}>
                <h2 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-hi-graphite mb-6 text-center py-8'>Наши преимущества</h2>
                {/* Топ ряд - 3 элемента */}
                {topAdvantages.length > 0 && (
                    <div className={styles.topRow}>
                        {topAdvantages.map((advantage, index) => {
                            const IconComponent = getAdvantageIcon(index);
                            const cardNumber = String(index + 1).padStart(2, '0');

                            return (
                                <article
                                    key={advantage.id}
                                    className={`${styles.advantageCard} ${index === 1 ? styles.withBackground : styles.textOnly
                                        }`}
                                    aria-labelledby={`advantage-title-${advantage.id}`}
                                >
                                    {/* Нумерация */}
                                    <div className={styles.cardNumber} aria-hidden="true">
                                        {cardNumber}
                                    </div>

                                    {/* Фоновое изображение для среднего элемента */}
                                    {index === 1 && advantage.image?.url && (
                                        <div className={styles.backgroundImage} aria-hidden="true">
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    right: 0,
                                                    bottom: 0,
                                                    backgroundImage: `url(${getImageUrl(advantage.image.url)})`,
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: 'center',
                                                    backgroundRepeat: 'no-repeat',
                                                    zIndex: 1
                                                }}
                                            />
                                            <div className={styles.overlay} />
                                        </div>
                                    )}

                                    <div className={styles.content}>
                                        {/* Иконка */}
                                        <div className={styles.iconContainer}>
                                            <IconComponent
                                                className={styles.advantageIcon}
                                                size={48}
                                                aria-hidden="true"
                                            />
                                        </div>

                                        {/* Заголовок с чертой */}
                                        <div className={styles.titleContainer}>
                                            <h3
                                                id={`advantage-title-${advantage.id}`}
                                                className={styles.title}
                                            >
                                                {advantage.Title}
                                            </h3>
                                            <div className={styles.titleUnderline} aria-hidden="true"></div>
                                        </div>

                                        {/* Описание для карточек без фона */}
                                        {index !== 1 && advantage.Description && (
                                            <div
                                                className={styles.description}
                                                dangerouslySetInnerHTML={{ __html: advantage.Description }}
                                            />
                                        )}
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}

                {/* Нижний ряд - 4 элемента */}
                {bottomAdvantages.length > 0 && (
                    <div className={styles.bottomRow}>
                        {bottomAdvantages.map((advantage, index) => {
                            const IconComponent = getAdvantageIcon(index + 3); // +3 так как это продолжение после топ ряда
                            const cardNumber = String(index + 4).padStart(2, '0'); // +4 так как нумерация начинается с 04

                            return (
                                <article
                                    key={advantage.id}
                                    className={`${styles.advantageCard} ${styles.textOnly}`}
                                    aria-labelledby={`advantage-title-${advantage.id}`}
                                >
                                    {/* Нумерация */}
                                    <div className={styles.cardNumber} aria-hidden="true">
                                        {cardNumber}
                                    </div>

                                    <div className={styles.content}>
                                        {/* Иконка */}
                                        <div className={styles.iconContainer}>
                                            <IconComponent
                                                className={styles.advantageIcon}
                                                size={48}
                                                aria-hidden="true"
                                            />
                                        </div>

                                        {/* Заголовок с чертой */}
                                        <div className={styles.titleContainer}>
                                            <h3
                                                id={`advantage-title-${advantage.id}`}
                                                className={styles.title}
                                            >
                                                {advantage.Title}
                                            </h3>
                                            <div className={styles.titleUnderline} aria-hidden="true"></div>
                                        </div>

                                        {/* Описание */}
                                        {advantage.Description && (
                                            <div
                                                className={styles.description}
                                                dangerouslySetInnerHTML={{ __html: advantage.Description }}
                                            />
                                        )}
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
};

export default AdvantagesGrid;