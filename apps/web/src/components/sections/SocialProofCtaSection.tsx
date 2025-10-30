'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Star, Quote, Users, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface SocialProofCtaSectionProps {
    variant?: 'testimonials' | 'stats' | 'features';
    title?: string;
    subtitle?: string;
    description?: string;
    ctaText?: string;
    showTestimonials?: boolean;
    showStats?: boolean;
    showFeatures?: boolean;
    className?: string;
}

export function SocialProofCtaSection({
    variant = 'testimonials',
    title = 'Почему выбирают нас?',
    subtitle = 'Более 500 довольных клиентов',
    description = 'Присоединяйтесь к сотням клиентов, которые уже доверили нам свои мероприятия',
    ctaText = 'Стать клиентом',
    showTestimonials = true,
    showStats = true,
    showFeatures = true,
    className = '',
}: SocialProofCtaSectionProps) {
    const [activeTestimonial, setActiveTestimonial] = useState(0);

    const testimonials = [
        {
            name: 'Анна Петрова',
            role: 'Директор по маркетингу',
            company: 'TechCorp',
            text: 'Отличный сервис! Организовали корпоратив на 150 человек. Все было идеально - от меню до сервировки.',
            rating: 5,
        },
        {
            name: 'Михаил Соколов',
            role: 'Основатель',
            company: 'StartupHub',
            text: 'Профессиональный подход и внимание к деталям. Гости до сих пор вспоминают наш выпускной.',
            rating: 5,
        },
        {
            name: 'Елена Козлова',
            role: 'Event Manager',
            company: 'EventPro',
            text: 'Работаем с Hi-Catering уже третий год. Никогда не подводили, всегда качественно и в срок.',
            rating: 5,
        },
    ];

    const stats = [
        { number: '500+', label: 'Довольных клиентов' },
        { number: '1000+', label: 'Проведенных мероприятий' },
        { number: '5', label: 'Лет опыта' },
        { number: '98%', label: 'Положительных отзывов' },
    ];

    const features = [
        'Персональный менеджер',
        'Гибкое меню',
        'Профессиональный сервис',
        'Доставка в день мероприятия',
        'Гарантия качества',
        'Консультация шеф-повара',
    ];

    return (
        <section className={`py-12 sm:py-16 lg:py-20 bg-hi-ash ${className}`}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    className="max-w-7xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
                        {/* Left Column - Content & Stats */}
                        <div className="space-y-6 sm:space-y-8">
                            <motion.div
                                className="space-y-3 sm:space-y-4"
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-hi-graphite">
                                    {title}
                                </h2>
                                <p className="text-lg sm:text-xl text-hi-platinum font-medium">
                                    {subtitle}
                                </p>
                                <p className="text-base sm:text-lg text-hi-graphite opacity-80">
                                    {description}
                                </p>
                            </motion.div>

                            {/* Stats */}
                            {showStats && (
                                <motion.div
                                    className="grid grid-cols-2 gap-4 sm:gap-6"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                    viewport={{ once: true }}
                                >
                                    {stats.map((stat, index) => (
                                        <div key={index} className="text-center">
                                            <div className="text-2xl sm:text-3xl font-bold text-hi-platinum mb-1">
                                                {stat.number}
                                            </div>
                                            <div className="text-xs sm:text-sm text-hi-graphite opacity-70">
                                                {stat.label}
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            )}

                            {/* Features */}
                            {showFeatures && (
                                <motion.div
                                    className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.3 }}
                                    viewport={{ once: true }}
                                >
                                    {features.map((feature, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-hi-green flex-shrink-0" />
                                            <span className="text-sm sm:text-base text-hi-graphite">{feature}</span>
                                        </div>
                                    ))}
                                </motion.div>
                            )}

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                viewport={{ once: true }}
                            >
                                <Button
                                    variant="primary"
                                    size="lg"
                                    className="w-full sm:w-auto"
                                >
                                    {ctaText}
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </motion.div>
                        </div>

                        {/* Right Column - Testimonials */}
                        {showTestimonials && (
                            <motion.div
                                className="space-y-4 sm:space-y-6"
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                viewport={{ once: true }}
                            >
                                <div className="bg-hi-white rounded-2xl p-4 sm:p-6 lg:p-8 shadow-hi">
                                    <Quote className="h-6 w-6 sm:h-8 sm:w-8 text-hi-platinum mb-3 sm:mb-4" />

                                    <blockquote className="text-base sm:text-lg text-hi-graphite mb-4 sm:mb-6 leading-relaxed">
                                        "{testimonials[activeTestimonial].text}"
                                    </blockquote>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-semibold text-sm sm:text-base text-hi-graphite">
                                                {testimonials[activeTestimonial].name}
                                            </div>
                                            <div className="text-xs sm:text-sm text-hi-graphite opacity-70">
                                                {testimonials[activeTestimonial].role}, {testimonials[activeTestimonial].company}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1">
                                            {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                                                <Star key={i} className="h-4 w-4 sm:h-5 sm:w-5 text-hi-platinum fill-current" />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Testimonial Navigation */}
                                <div className="flex justify-center gap-2">
                                    {testimonials.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setActiveTestimonial(index)}
                                            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${index === activeTestimonial
                                                ? 'bg-hi-platinum'
                                                : 'bg-hi-silver hover:bg-hi-platinum'
                                                }`}
                                        />
                                    ))}
                                </div>

                                {/* Additional Social Proof */}
                                <div className="bg-hi-white rounded-xl p-3 sm:p-4 shadow-hi">
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <Users className="h-5 w-5 sm:h-6 sm:w-6 text-hi-platinum" />
                                        <div>
                                            <div className="font-semibold text-sm sm:text-base text-hi-graphite">
                                                Присоединяйтесь к сообществу
                                            </div>
                                            <div className="text-xs sm:text-sm text-hi-graphite opacity-70">
                                                Более 500 довольных клиентов уже с нами
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
