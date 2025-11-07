'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiClient, Service } from '@/lib/api';
import { Briefcase } from 'lucide-react';

interface ServicesButtonsSectionProps {
    title?: string;
    description?: string;
    className?: string;
    limit?: number;
}

export function ServicesButtonsSection({
    title = 'Наши услуги',
    description = 'Выберите подходящую услугу для вашего мероприятия',
    className = '',
    limit
}: ServicesButtonsSectionProps) {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    if (loading) {
        return (
            <section className={`py-16 bg-hi-white ${className}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="animate-pulse">
                        <div className="h-8 bg-hi-silver rounded w-1/3 mx-auto mb-4"></div>
                        <div className="h-4 bg-hi-silver rounded w-1/2 mx-auto mb-8"></div>
                        <div className="flex flex-wrap justify-center gap-4">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="h-12 bg-hi-silver rounded-full w-32"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (error || services.length === 0) {
        return null; // Не показываем секцию, если нет услуг или ошибка
    }

    return (
        <section className={`py-16 bg-hi-ash/30 ${className}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Заголовок и описание */}
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

                {/* Кнопки с услугами */}
                <div className="flex flex-wrap justify-center gap-4">
                    {services.map((service) => (
                        <Link
                            key={service.id}
                            href={`/services/${service.slug}`}
                            className="group relative inline-flex items-center gap-3 px-6 py-3 bg-hi-white hover:bg-[#BFA76F] text-hi-graphite hover:text-white rounded-full font-medium text-sm lg:text-base transition-all duration-300 transform hover:scale-105 shadow-hi hover:shadow-hi-hover border border-hi-silver/30"
                        >
                            <Briefcase className="h-5 w-5 text-hi-graphite group-hover:text-white transition-colors" />
                            <span>{service.TitleInmenu || service.Title}</span>
                            <svg
                                className="h-4 w-4 text-hi-graphite group-hover:text-white group-hover:translate-x-1 transition-all"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    ))}
                </div>

                {/* Ссылка на все услуги */}
                <div className="text-center mt-8">
                    <Link
                        href="/services"
                        className="group inline-flex items-center gap-2 bg-[#BFA76F] hover:bg-[#BFA76F]/90 text-white px-6 py-3 rounded-full font-medium text-sm lg:text-base transition-all duration-300 transform hover:scale-105 shadow-hi hover:shadow-hi-hover"
                    >
                        Посмотреть все услуги
                        <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
}

