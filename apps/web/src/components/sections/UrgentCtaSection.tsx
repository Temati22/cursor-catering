'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Clock, Gift, Star, Users } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';

interface UrgentCtaSectionProps {
    variant?: 'urgent' | 'offer' | 'limited';
    title?: string;
    subtitle?: string;
    description?: string;
    ctaText?: string;
    offerText?: string;
    deadline?: string;
    discount?: string;
    className?: string;
}

export function UrgentCtaSection({
    variant = 'urgent',
    title = 'Ограниченное предложение!',
    subtitle = 'Скидка 20% на первый заказ',
    description = 'До конца месяца действует специальная скидка для новых клиентов. Успейте забронировать дату!',
    ctaText = 'Забронировать со скидкой',
    offerText = 'Осталось мест:',
    deadline = '2024-12-31',
    discount = '20%',
    className = '',
}: UrgentCtaSectionProps) {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const deadlineDate = new Date(deadline).getTime();
            const now = new Date().getTime();
            const difference = deadlineDate - now;

            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((difference % (1000 * 60)) / 1000);

                setTimeLeft({ days, hours, minutes, seconds });
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [deadline]);

    const variants = {
        urgent: {
            bg: 'bg-gradient-to-r from-hi-red to-hi-platinum',
            text: 'text-hi-white',
            accent: 'bg-hi-white text-hi-red',
            border: 'border-hi-white',
        },
        offer: {
            bg: 'bg-gradient-to-r from-hi-platinum to-hi-graphite',
            text: 'text-hi-white',
            accent: 'bg-hi-white text-hi-platinum',
            border: 'border-hi-white',
        },
        limited: {
            bg: 'bg-gradient-to-r from-hi-deep to-hi-platinum',
            text: 'text-hi-white',
            accent: 'bg-hi-white text-hi-deep',
            border: 'border-hi-white',
        },
    };

    const currentVariant = variants[variant];

    const getIcon = () => {
        switch (variant) {
            case 'urgent':
                return <Clock className="h-6 w-6" />;
            case 'offer':
                return <Gift className="h-6 w-6" />;
            case 'limited':
                return <Star className="h-6 w-6" />;
            default:
                return <Clock className="h-6 w-6" />;
        }
    };

    return (
        <section className={`py-12 lg:py-16 ${currentVariant.bg} ${className}`}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8现在">
                <motion.div
                    className="max-w-6xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                        {/* Left Column - Icon & Title */}
                        <motion.div
                            className="text-center lg:text-left"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            viewport={{ once: true }}
                        >
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-hi-white bg-opacity-20 mb-4">
                                {getIcon()}
                            </div>
                            <h2 className={`text-2xl lg:text-3xl font-bold ${currentVariant.text} mb-2`}>
                                {title}
                            </h2>
                            <p className={`text-lg ${currentVariant.text} opacity-90`}>
                                {subtitle}
                            </p>
                        </motion.div>

                        {/* Center Column - Timer */}
                        <motion.div
                            className="text-center"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            viewport={{ once: true }}
                        >
                            {isVisible && (
                                <div className="bg-hi-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 border border-hi-white border-opacity-20">
                                    <p className={`text-sm ${currentVariant.text} opacity-80 mb-4`}>
                                        {offerText}
                                    </p>
                                    <div className="grid grid-cols-4 gap-2">
                                        <div className="text-center">
                                            <div className={`text-2xl font-bold ${currentVariant.text}`}>
                                                {timeLeft.days}
                                            </div>
                                            <div className={`text-xs ${currentVariant.text} opacity-70`}>
                                                дней
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className={`text-2xl font-bold ${currentVariant.text}`}>
                                                {timeLeft.hours}
                                            </div>
                                            <div className={`text-xs ${currentVariant.text} opacity-70`}>
                                                часов
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className={`text-2xl font-bold ${currentVariant.text}`}>
                                                {timeLeft.minutes}
                                            </div>
                                            <div className={`text-xs ${currentVariant.text} opacity-70`}>
                                                минут
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className={`text-2xl font-bold ${currentVariant.text}`}>
                                                {timeLeft.seconds}
                                            </div>
                                            <div className={`text-xs ${currentVariant.text} opacity-70`}>
                                                секунд
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>

                        {/* Right Column - CTA */}
                        <motion.div
                            className="text-center lg:text-right"
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            viewport={{ once: true }}
                        >
                            <div className="space-y-4">
                                <div className={`inline-flex items-center justify-center px-4 py-2 rounded-full ${currentVariant.accent} font-bold text-lg`}>
                                    Скидка {discount}
                                </div>

                                <p className={`text-base ${currentVariant.text} opacity-80`}>
                                    {description}
                                </p>

                                <Button
                                    variant="outline"
                                    size="lg"
                                    className={`border-current ${currentVariant.text} hover:bg-hi-white hover:text-hi-graphite transition-all duration-300`}
                                >
                                    {ctaText}
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>

                                <div className="flex items-center justify-center lg:justify-end gap-2 text-sm opacity-70">
                                    <Users className="h-4 w-4" />
                                    <span>Уже заказали: 47 клиентов</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
