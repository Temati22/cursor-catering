'use client';

import { Calendar, Sparkles, Heart, Users, Utensils, Gift } from 'lucide-react';

interface EventsListFallbackProps {
    limit?: number;
    title?: string;
    description?: string;
    showTitle?: boolean;
    className?: string;
}

// Статичные данные для fallback при недоступности API
const fallbackEvents = [
    {
        id: 1,
        title: "Свадебный кейтеринг",
        description: "Создайте незабываемую атмосферу на самом важном дне в вашей жизни. Изысканные блюда, безупречный сервис и внимание к каждой детали.",
        icon: Heart,
        features: ["Персональное меню", "Свадебный торт", "Фуршетная зона", "Барная станция"],
        color: "bg-pink-100 text-pink-600",
        badge: "Романтика",
        badgeColor: "bg-pink-500"
    },
    {
        id: 2,
        title: "Корпоративные мероприятия",
        description: "Профессиональный кейтеринг для деловых событий, презентаций, конференций и корпоративных праздников.",
        icon: Users,
        features: ["Бизнес-ланч", "Кофе-брейк", "Банкетное меню", "Выездное обслуживание"],
        color: "bg-blue-100 text-blue-600",
        badge: "Бизнес",
        badgeColor: "bg-blue-500"
    },
    {
        id: 3,
        title: "Дни рождения и юбилеи",
        description: "Сделайте ваш праздник особенным! Вкусная еда, красивая подача и праздничная атмосфера для гостей всех возрастов.",
        icon: Gift,
        features: ["Праздничный стол", "Детское меню", "Тематическое оформление", "Праздничные десерты"],
        color: "bg-yellow-100 text-yellow-600",
        badge: "Праздник",
        badgeColor: "bg-yellow-500"
    },
    {
        id: 4,
        title: "Семейные торжества",
        description: "Уютные семейные собрания с домашней атмосферой и вкусными блюдами, приготовленными с любовью.",
        icon: Utensils,
        features: ["Домашняя кухня", "Семейные рецепты", "Комфортная подача", "Детские блюда"],
        color: "bg-green-100 text-green-600",
        badge: "Семейный",
        badgeColor: "bg-green-500"
    },
    {
        id: 5,
        title: "Праздничные банкеты",
        description: "Торжественные мероприятия с широким выбором блюд, элегантной подачей и профессиональным обслуживанием.",
        icon: Sparkles,
        features: ["Банкетное меню", "Торжественная подача", "Алкогольные напитки", "Праздничное оформление"],
        color: "bg-purple-100 text-purple-600",
        badge: "Премиум",
        badgeColor: "bg-purple-500"
    },
    {
        id: 6,
        title: "Фуршеты и коктейли",
        description: "Элегантные коктейльные вечеринки и фуршеты с изысканными закусками и напитками.",
        icon: Calendar,
        features: ["Коктейльная карта", "Легкие закуски", "Мобильный бар", "Стильная подача"],
        color: "bg-indigo-100 text-indigo-600",
        badge: "Премиум",
        badgeColor: "bg-indigo-500"
    }
];

export function EventsListFallback({
    limit,
    title = "Наши праздники и мероприятия",
    description = "Мы предлагаем широкий спектр кейтеринговых услуг для любых празднований и торжеств. Каждое мероприятие уникально, и мы подготовим для вас особенное меню.",
    showTitle = true,
    className = ""
}: EventsListFallbackProps) {

    const displayEvents = limit ? fallbackEvents.slice(0, limit) : fallbackEvents;

    return (
        <section className={`py-16 bg-hi-white ${className}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {showTitle && (
                    <div className="text-center mb-12">
                        <div className="flex items-center justify-center mb-4">
                            <Sparkles className="text-hi-green mr-2" size={32} />
                            <h2 className="text-3xl font-bold text-hi-graphite">{title}</h2>
                            <Sparkles className="text-hi-green ml-2" size={32} />
                        </div>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            {description}
                        </p>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {displayEvents.map((event) => {
                        const IconComponent = event.icon;
                        return (
                            <button
                                key={event.id}
                                className="relative rounded-lg shadow-hi hover:shadow-hi-hover transition-all duration-300 overflow-hidden group cursor-pointer w-full text-left h-48 bg-gradient-to-br from-gray-100 to-gray-200"
                            >


                                {/* Background pattern with icon */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                                    <IconComponent size={60} className="text-gray-400" />
                                </div>

                                {/* Category badge */}
                                <div className="absolute top-3 left-3 z-10">
                                    <div className={`${event.badgeColor} text-white px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm bg-opacity-90 shadow-lg`}>
                                        {event.badge}
                                    </div>
                                </div>

                                {/* Gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#1E1F26]/90 via-[#1E1F26]/30 to-transparent" />



                                {/* Content Section */}
                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                    <h3 className="text-base font-semibold text-white leading-tight drop-shadow-lg">
                                        {event.title}
                                    </h3>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Call to Action */}
                {limit && displayEvents.length === limit && (
                    <div className="text-center mt-12">
                        <p className="text-gray-600 mb-6">
                            Не нашли подходящий вариант? Мы создадим индивидуальное предложение специально для вас!
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="bg-hi-green text-white px-6 py-3 rounded-lg font-medium hover:bg-hi-green-dark transition-colors inline-flex items-center justify-center">
                                <Calendar size={20} className="mr-2" />
                                Консультация
                            </button>
                            <button className="border border-hi-green text-hi-green px-6 py-3 rounded-lg font-medium hover:bg-hi-green hover:text-white transition-colors inline-flex items-center justify-center">
                                Все услуги
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
