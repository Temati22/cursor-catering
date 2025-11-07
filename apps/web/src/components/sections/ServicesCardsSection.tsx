'use client';

import { useState, useEffect } from 'react';
import { apiClient, Service } from '@/lib/api';
import { ServiceCard } from '@/components/ui/ServiceCard';
import { CtaFillCard } from '@/components/ui/CtaFillCard';
import { FallbackComponent } from '@/components/ui/FallbackComponent';

interface ServicesCardsSectionProps {
    limit?: number;
    showDescription?: boolean;
    title?: string;
    description?: string;
    className?: string;
    /**
     * Показать CTA карточку для заполнения свободных мест в сетке
     */
    showCta?: boolean;
    /**
     * Заголовок CTA карточки
     */
    ctaTitle?: string;
    /**
     * Описание CTA карточки
     */
    ctaDescription?: string;
    /**
     * Текст кнопки в CTA карточке
     */
    ctaButtonText?: string;
    /**
     * Callback для клика по кнопке CTA
     */
    onCtaClick?: () => void;
}

export function ServicesCardsSection({
    limit,
    showDescription = true,
    title,
    description,
    className = '',
    showCta = false,
    ctaTitle = 'Нужна консультация?',
    ctaDescription = 'Свяжитесь с нами для обсуждения деталей вашего мероприятия и получите персональное предложение',
    ctaButtonText = 'Оставить заявку',
    onCtaClick
}: ServicesCardsSectionProps) {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

    useEffect(() => {
        const fetchServices = async () => {
            try {
                setLoading(true);
                const response = await apiClient.getServices({
                    populate: '*'
                });
                const allServices = response.data || [];
                setServices(limit ? allServices.slice(0, limit) : allServices);
            } catch (err) {
                console.error('Error fetching services:', err);
                setError('Не удалось загрузить услуги');
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, [limit]);

    const handleImageError = (serviceId: number) => {
        setImageErrors(prev => new Set(prev).add(serviceId));
    };

    if (loading) {
        return (
            <section className={`py-16 bg-hi-white ${className}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-hi-graphite mb-8">
                            {title || 'Наши услуги'}
                        </h2>
                    </div>
                    <FallbackComponent
                        message="Загружаем услуги..."
                        size="lg"
                        variant="card"
                    />
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className={`py-16 bg-hi-white ${className}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <p className="text-red-500">{error}</p>
                    </div>
                </div>
            </section>
        );
    }

    if (services.length === 0) {
        return null;
    }

    return (
        <section className={`py-16 bg-hi-white ${className}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                {(title || description) && (
                    <div className="text-center mb-12">
                        {title && (
                            <h2 className="text-3xl font-bold text-hi-graphite mb-4">
                                {title}
                            </h2>
                        )}
                        {description && (
                            <p className="text-lg text-hi-platinum max-w-2xl mx-auto">
                                {description}
                            </p>
                        )}
                    </div>
                )}

                {/* Services Grid - 5 per row on large screens */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {services.map((service) => (
                        <ServiceCard
                            key={service.id}
                            service={service}
                            showDescription={showDescription}
                            onImageError={handleImageError}
                        />
                    ))}
                    {/* CTA Fill Card - заполняет свободные места в сетке */}
                    {showCta && (
                        <CtaFillCard
                            title={ctaTitle}
                            description={ctaDescription}
                            buttonText={ctaButtonText}
                            onButtonClick={onCtaClick}
                            maxColumns={1}
                            variant="gradient"
                        />
                    )}
                </div>
            </div>
        </section>
    );
}
