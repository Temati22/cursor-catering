'use client';

import { useState, useEffect } from 'react';
import { X, User, Phone, Users } from 'lucide-react';
import { Button } from './Button';

// Типы состояний попапа
export type PopupType = 'order-catering' | 'calculate-event';

interface PopupProps {
    isOpen: boolean;
    onClose: () => void;
    type?: PopupType;
}

interface FormData {
    name: string;
    phone: string;
    guests: string;
}

// Получение заголовка и описания по типу состояния
const getPopupContent = (type: PopupType) => {
    switch (type) {
        case 'order-catering':
            return {
                title: 'Заказать кейтеринг для вашего мероприятия',
                description: 'Заполните форму и мы свяжемся с вами для обсуждения деталей',
                buttonText: 'Заказать кейтеринг'
            };
        case 'calculate-event':
            return {
                title: 'Сделать просчет мероприятия',
                description: 'Расскажите о вашем мероприятии и получите персональный расчет',
                buttonText: 'Получить расчет'
            };
        default:
            return {
                title: 'Обратная связь',
                description: 'Заполните форму и мы свяжемся с вами',
                buttonText: 'Отправить заявку'
            };
    }
};

export const Popup = ({ isOpen, onClose, type = 'order-catering' }: PopupProps) => {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        phone: '',
        guests: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Получаем контент на основе типа состояния
    const popupContent = getPopupContent(type);

    // Закрытие по Escape
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            // Блокируем скролл body
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Здесь будет логика отправки формы
            // Отправка формы

            // Имитация отправки
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Очистка формы и закрытие popup
            setFormData({ name: '', phone: '', guests: '' });
            onClose();

            // Здесь можно добавить уведомление об успешной отправке
            alert('Спасибо! Ваша заявка отправлена.');
        } catch (error) {
            console.error('Ошибка отправки формы:', error);
            alert('Произошла ошибка при отправке формы. Попробуйте еще раз.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-60 backdrop-blur-md p-4"
            onClick={handleOverlayClick}
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
        >
            <div className="relative w-full max-w-lg mx-auto bg-hi-white rounded-2xl shadow-2xl transform transition-all duration-300 scale-100">
                {/* Заголовок */}
                <div className="relative p-8 pb-6">
                    {/* Logo */}
                    <div className="flex justify-center mb-5">
                        <div className="relative inline-flex items-center justify-center">
                            <img
                                src="/Logo.png"
                                alt="Hi-Catering логотип"
                                className="h-10 w-auto select-none"
                                draggable={false}
                            />
                        </div>
                    </div>
                    <div className="flex items-start justify-between">
                        <div className="pr-6">
                            <h2 className="text-2xl font-bold text-hi-graphite mb-2 text-center sm:text-left">{popupContent.title}</h2>
                            <p className="text-hi-silver text-sm text-center sm:text-left">{popupContent.description}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-hi-graphite hover:text-hi-platinum hover:bg-hi-ash rounded-full transition-all duration-200"
                            aria-label="Закрыть"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Форма */}
                <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-6">
                    {/* Имя */}
                    <div className="group">
                        <label htmlFor="name" className="block text-sm font-semibold text-hi-graphite mb-3">
                            Ваше имя *
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-hi-silver group-focus-within:text-hi-platinum transition-colors" />
                            </div>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                className="w-full pl-10 pr-4 py-3 border-2 border-hi-silver rounded-xl focus:outline-none focus:ring-0 focus:border-hi-platinum transition-all duration-200 text-hi-graphite placeholder-hi-silver bg-hi-white hover:border-hi-platinum/50"
                                placeholder="Введите ваше имя"
                            />
                        </div>
                    </div>

                    {/* Телефон */}
                    <div className="group">
                        <label htmlFor="phone" className="block text-sm font-semibold text-hi-graphite mb-3">
                            Номер телефона *
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Phone className="h-5 w-5 text-hi-silver group-focus-within:text-hi-platinum transition-colors" />
                            </div>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                required
                                className="w-full pl-10 pr-4 py-3 border-2 border-hi-silver rounded-xl focus:outline-none focus:ring-0 focus:border-hi-platinum transition-all duration-200 text-hi-graphite placeholder-hi-silver bg-hi-white hover:border-hi-platinum/50"
                                placeholder="+7 (999) 123-45-67"
                            />
                        </div>
                    </div>

                    {/* Количество гостей */}
                    <div className="group">
                        <label htmlFor="guests" className="block text-sm font-semibold text-hi-graphite mb-3">
                            Количество гостей *
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Users className="h-5 w-5 text-hi-silver group-focus-within:text-hi-platinum transition-colors" />
                            </div>
                            <input
                                type="number"
                                id="guests"
                                name="guests"
                                value={formData.guests}
                                onChange={handleInputChange}
                                required
                                min="1"
                                max="1000"
                                className="w-full pl-10 pr-4 py-3 border-2 border-hi-silver rounded-xl focus:outline-none focus:ring-0 focus:border-hi-platinum transition-all duration-200 text-hi-graphite placeholder-hi-silver bg-hi-white hover:border-hi-platinum/50"
                                placeholder="Укажите количество гостей"
                            />
                        </div>
                    </div>

                    {/* Кнопки */}
                    <div className="flex gap-4 pt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            fullWidth
                            className="py-3 font-semibold text-[20px]"
                        >
                            Отмена
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            loading={isSubmitting}
                            fullWidth
                            className="py-3 font-semibold text-[20px]"
                        >
                            {isSubmitting ? 'Отправка...' : popupContent.buttonText}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
