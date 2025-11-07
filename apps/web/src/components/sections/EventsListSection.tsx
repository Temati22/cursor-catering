'use client';

import { useState, useEffect } from 'react';
import { apiClient, EventPage } from '@/lib/api';
import { EventCard } from '@/components/ui/EventCard';
import { FallbackComponent } from '@/components/ui/FallbackComponent';
import { EventsListFallback } from './EventsListFallback';
import { Calendar, Sparkles } from 'lucide-react';

interface EventsListSectionProps {
    limit?: number;
    title?: string;
    description?: string;
    showTitle?: boolean;
    className?: string;
    forceFallback?: boolean; // Для тестирования fallback режима
}

export function EventsListSection({
    limit,
    title = "Наши праздники и мероприятия",
    description = "Откройте для себя наши специальные предложения для различных праздников и мероприятий. Мы создаём незабываемые моменты для каждого особого случая.",
    showTitle = true,
    className = "",
    forceFallback = false
}: EventsListSectionProps) {
    const [events, setEvents] = useState<EventPage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
    const [useStaticFallback, setUseStaticFallback] = useState(false);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);
                setError(null);

                // Try with simpler populate first to avoid potential issues
                const response = await apiClient.getEventPages({
                    populate: '*'
                });

                const allEvents = response.data || [];

                // Apply limit if specified, otherwise show all events
                const filteredEvents = limit ? allEvents.slice(0, limit) : allEvents;

                setEvents(filteredEvents);
            } catch (err: any) {
                console.error('Error fetching events:', err);

                // For certain errors, automatically switch to static fallback
                if (err?.response?.status === 404 || err?.response?.status === 403 || err?.code === 'ECONNREFUSED') {
                    console.warn('Переключаемся на статичный режим из-за недоступности API');
                    setUseStaticFallback(true);
                    return;
                }

                // For other errors, show error message
                const errorMessage = err?.message
                    ? `Ошибка API: ${err.message}`
                    : 'Не удалось загрузить события. Попробуйте обновить страницу.';

                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [limit]);

    const handleImageError = (eventId: number) => {
        setImageErrors(prev => new Set(prev).add(eventId));
    };

    // If static fallback is enabled or forced, render it
    if (useStaticFallback || forceFallback) {
        return (
            <EventsListFallback
                limit={limit}
                title={title}
                description={description}
                showTitle={showTitle}
                className={className}
            />
        );
    }

    if (loading) {
        return (
            <section className={`py-16 bg-hi-white ${className}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {showTitle && (
                        <div className="text-center mb-12">
                            <div className="flex items-center justify-center mb-4">
                                <Sparkles className="text-hi-platinum mr-2" size={32} />
                                <h2 className="text-3xl font-bold text-hi-graphite">{title}</h2>
                                <Sparkles className="text-hi-platinum ml-2" size={32} />
                            </div>
                        </div>
                    )}
                    <FallbackComponent
                        message="Загружаем праздники и мероприятия..."
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
                    {showTitle && (
                        <div className="text-center mb-12">
                            <div className="flex items-center justify-center mb-4">
                                <Sparkles className="text-hi-platinum mr-2" size={32} />
                                <h2 className="text-3xl font-bold text-hi-graphite">{title}</h2>
                                <Sparkles className="text-hi-platinum ml-2" size={32} />
                            </div>
                        </div>
                    )}
                    <FallbackComponent
                        message={error}
                        size="lg"
                        variant="card"
                        className="border-red-200 bg-red-50 text-red-600"
                    />
                </div>
            </section>
        );
    }

    return (
        <section className={`py-16 bg-hi-white ${className}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {showTitle && (
                    <div className="text-center mb-12">
                        <div className="flex items-center justify-center mb-4">
                            <Sparkles className="text-hi-platinum mr-2" size={32} />
                            <h2 className="text-3xl font-bold text-hi-graphite">{title}</h2>
                            <Sparkles className="text-hi-platinum ml-2" size={32} />
                        </div>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            {description}
                        </p>
                    </div>
                )}

                {events.length === 0 ? (
                    <div className="text-center py-12">
                        <Calendar size={64} className="text-gray-300 mx-auto mb-4" />
                        <FallbackComponent
                            message="Праздники и мероприятия пока не добавлены"
                            size="md"
                            variant="minimal"
                        />
                        <p className="text-gray-500 mt-4 max-w-md mx-auto">
                            Мы работаем над добавлением новых интересных предложений для ваших особых моментов.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                            {events.map((event) => (
                                <EventCard
                                    key={event.id}
                                    event={event}
                                    onImageError={handleImageError}
                                />
                            ))}
                        </div>

                        {/* Show "Load More" or "View All" button if there are more events */}
                        {limit && events.length === limit && (
                            <div className="text-center mt-12">
                                <button
                                    onClick={() => window.location.href = '/events'}
                                    className="bg-hi-green text-white px-8 py-3 rounded-lg font-medium hover:bg-hi-green-dark transition-colors inline-flex items-center space-x-2"
                                >
                                    <Calendar size={20} />
                                    <span>Посмотреть все праздники</span>
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
}
