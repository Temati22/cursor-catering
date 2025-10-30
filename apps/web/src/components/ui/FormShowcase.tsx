'use client';

import { useState } from 'react';
import { Button } from './Button';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Clock,
    Users,
    MessageSquare,
    Upload,
    Check,
    X,
    Eye,
    EyeOff,
    Star,
    Heart,
    Settings
} from 'lucide-react';

interface FormData {
    // Основная информация
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;

    // Адрес
    address: string;
    city: string;
    zipCode: string;
    country: string;

    // Дополнительная информация
    birthDate: string;
    gender: string;
    interests: string[];
    newsletter: boolean;
    terms: boolean;

    // Кейтеринг специфичные поля
    eventType: string;
    eventDate: string;
    eventTime: string;
    guests: number;
    budget: string;
    dietaryRestrictions: string;
    specialRequests: string;

    // Файлы
    avatar: File | null;
    documents: File[];

    // Рейтинг
    rating: number;
    satisfaction: number;
}

export function FormShowcase() {
    const [formData, setFormData] = useState<FormData>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        address: '',
        city: '',
        zipCode: '',
        country: '',
        birthDate: '',
        gender: '',
        interests: [],
        newsletter: false,
        terms: false,
        eventType: '',
        eventDate: '',
        eventTime: '',
        guests: 0,
        budget: '',
        dietaryRestrictions: '',
        specialRequests: '',
        avatar: null,
        documents: [],
        rating: 0,
        satisfaction: 0
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (field: keyof FormData, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleCheckboxChange = (field: keyof FormData, checked: boolean) => {
        setFormData(prev => ({
            ...prev,
            [field]: checked
        }));
    };

    const handleMultiSelectChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: Array.isArray(prev[field]) && prev[field].includes(value)
                ? prev[field].filter((item: string) => item !== value)
                : Array.isArray(prev[field])
                    ? [...prev[field], value]
                    : [value]
        }));
    };

    const handleFileChange = (field: keyof FormData, files: FileList | null) => {
        if (files) {
            if (field === 'avatar') {
                setFormData(prev => ({ ...prev, [field]: files[0] }));
            } else {
                setFormData(prev => ({
                    ...prev,
                    [field]: Array.from(files)
                }));
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Симуляция отправки формы
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Form submitted successfully
        setIsSubmitting(false);

        // Сброс формы
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: '',
            address: '',
            city: '',
            zipCode: '',
            country: '',
            birthDate: '',
            gender: '',
            interests: [],
            newsletter: false,
            terms: false,
            eventType: '',
            eventDate: '',
            eventTime: '',
            guests: 0,
            budget: '',
            dietaryRestrictions: '',
            specialRequests: '',
            avatar: null,
            documents: [],
            rating: 0,
            satisfaction: 0
        });
    };

    const interestOptions = [
        'Кулинария',
        'Путешествия',
        'Спорт',
        'Музыка',
        'Кино',
        'Книги',
        'Искусство',
        'Технологии'
    ];

    const eventTypes = [
        'Свадьба',
        'Корпоратив',
        'День рождения',
        'Юбилей',
        'Конференция',
        'Семинар',
        'Фуршет',
        'Гала-ужин'
    ];

    const budgetOptions = [
        'До 50,000 ₽',
        '50,000 - 100,000 ₽',
        '100,000 - 200,000 ₽',
        '200,000 - 500,000 ₽',
        'Свыше 500,000 ₽'
    ];

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6">
            <div className="mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-hi-graphite mb-2">Полная форма заказа</h2>
                <p className="text-sm sm:text-base text-hi-graphite">
                    Демонстрация всех возможных типов полей формы для кейтеринг-сервиса
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                {/* Личная информация */}
                <div className="bg-hi-white rounded-lg border border-hi-silver p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-semibold text-hi-graphite mb-3 sm:mb-4 flex items-center">
                        <User className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-hi-platinum" />
                        Личная информация
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                            <label className="block text-sm font-medium text-hi-graphite mb-1">
                                Имя *
                            </label>
                            <input
                                type="text"
                                value={formData.firstName}
                                onChange={(e) => handleInputChange('firstName', e.target.value)}
                                className="w-full px-3 py-2 border border-hi-silver rounded-lg focus:ring-2 focus:ring-hi-platinum focus:border-hi-platinum"
                                placeholder="Введите ваше имя"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-hi-graphite mb-1">
                                Фамилия *
                            </label>
                            <input
                                type="text"
                                value={formData.lastName}
                                onChange={(e) => handleInputChange('lastName', e.target.value)}
                                className="w-full px-3 py-2 border border-hi-silver rounded-lg focus:ring-2 focus:ring-hi-platinum focus:border-hi-platinum"
                                placeholder="Введите вашу фамилию"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-hi-graphite mb-1">
                                Email *
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-hi-silver" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className="w-full pl-10 pr-3 py-2 border border-hi-silver rounded-lg focus:ring-2 focus:ring-hi-platinum focus:border-hi-platinum"
                                    placeholder="example@email.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-hi-graphite mb-1">
                                Телефон *
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-hi-silver" />
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                    className="w-full pl-10 pr-3 py-2 border border-hi-silver rounded-lg focus:ring-2 focus:ring-hi-platinum focus:border-hi-platinum"
                                    placeholder="+7 (999) 123-45-67"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-hi-graphite mb-1">
                                Пароль *
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={(e) => handleInputChange('password', e.target.value)}
                                    className="w-full px-3 py-2 pr-10 border border-hi-silver rounded-lg focus:ring-2 focus:ring-hi-platinum focus:border-hi-platinum"
                                    placeholder="Введите пароль"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-hi-silver hover:text-hi-graphite"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-hi-graphite mb-1">
                                Подтвердите пароль *
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={formData.confirmPassword}
                                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                    className="w-full px-3 py-2 pr-10 border border-hi-silver rounded-lg focus:ring-2 focus:ring-hi-platinum focus:border-hi-platinum"
                                    placeholder="Подтвердите пароль"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-hi-silver hover:text-hi-graphite"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Адрес */}
                <div className="bg-hi-white rounded-lg border border-hi-silver p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-semibold text-hi-graphite mb-3 sm:mb-4 flex items-center">
                        <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-hi-platinum" />
                        Адрес
                    </h3>

                    <div className="space-y-3 sm:space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-hi-graphite mb-1">
                                Адрес
                            </label>
                            <input
                                type="text"
                                value={formData.address}
                                onChange={(e) => handleInputChange('address', e.target.value)}
                                className="w-full px-3 py-2 border border-hi-silver rounded-lg focus:ring-2 focus:ring-hi-platinum focus:border-hi-platinum"
                                placeholder="Улица, дом, квартира"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                            <div>
                                <label className="block text-sm font-medium text-hi-graphite mb-1">
                                    Город
                                </label>
                                <input
                                    type="text"
                                    value={formData.city}
                                    onChange={(e) => handleInputChange('city', e.target.value)}
                                    className="w-full px-3 py-2 border border-hi-silver rounded-lg focus:ring-2 focus:ring-hi-platinum focus:border-hi-platinum"
                                    placeholder="Москва"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-hi-graphite mb-1">
                                    Индекс
                                </label>
                                <input
                                    type="text"
                                    value={formData.zipCode}
                                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                                    className="w-full px-3 py-2 border border-hi-silver rounded-lg focus:ring-2 focus:ring-hi-platinum focus:border-hi-platinum"
                                    placeholder="123456"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-hi-graphite mb-1">
                                    Страна
                                </label>
                                <select
                                    value={formData.country}
                                    onChange={(e) => handleInputChange('country', e.target.value)}
                                    className="w-full px-3 py-2 border border-hi-silver rounded-lg focus:ring-2 focus:ring-hi-platinum focus:border-hi-platinum"
                                >
                                    <option value="">Выберите страну</option>
                                    <option value="ru">Россия</option>
                                    <option value="by">Беларусь</option>
                                    <option value="kz">Казахстан</option>
                                    <option value="ua">Украина</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Дополнительная информация */}
                <div className="bg-hi-white rounded-lg border border-hi-silver p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-semibold text-hi-graphite mb-3 sm:mb-4 flex items-center">
                        <Settings className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-hi-platinum" />
                        Дополнительная информация
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                            <label className="block text-sm font-medium text-hi-graphite mb-1">
                                Дата рождения
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-hi-silver" />
                                <input
                                    type="date"
                                    value={formData.birthDate}
                                    onChange={(e) => handleInputChange('birthDate', e.target.value)}
                                    className="w-full pl-10 pr-3 py-2 border border-hi-silver rounded-lg focus:ring-2 focus:ring-hi-platinum focus:border-hi-platinum"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-hi-graphite mb-1">
                                Пол
                            </label>
                            <div className="flex space-x-4">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="male"
                                        checked={formData.gender === 'male'}
                                        onChange={(e) => handleInputChange('gender', e.target.value)}
                                        className="mr-2"
                                    />
                                    Мужской
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="female"
                                        checked={formData.gender === 'female'}
                                        onChange={(e) => handleInputChange('gender', e.target.value)}
                                        className="mr-2"
                                    />
                                    Женский
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="mt-3 sm:mt-4">
                        <label className="block text-sm font-medium text-hi-graphite mb-2">
                            Интересы
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {interestOptions.map((interest) => (
                                <label key={interest} className="flex items-center text-sm">
                                    <input
                                        type="checkbox"
                                        checked={formData.interests.includes(interest)}
                                        onChange={(e) => handleMultiSelectChange('interests', interest)}
                                        className="mr-2"
                                    />
                                    {interest}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="mt-3 sm:mt-4 space-y-2">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={formData.newsletter}
                                onChange={(e) => handleCheckboxChange('newsletter', e.target.checked)}
                                className="mr-2"
                            />
                            Подписаться на рассылку
                        </label>

                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={formData.terms}
                                onChange={(e) => handleCheckboxChange('terms', e.target.checked)}
                                className="mr-2"
                                required
                            />
                            Согласен с условиями использования *
                        </label>
                    </div>
                </div>

                {/* Кейтеринг специфичные поля */}
                <div className="bg-hi-white rounded-lg border border-hi-silver p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-semibold text-hi-graphite mb-3 sm:mb-4 flex items-center">
                        <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-hi-platinum" />
                        Детали мероприятия
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                            <label className="block text-sm font-medium text-hi-graphite mb-1">
                                Тип мероприятия *
                            </label>
                            <select
                                value={formData.eventType}
                                onChange={(e) => handleInputChange('eventType', e.target.value)}
                                className="w-full px-3 py-2 border border-hi-silver rounded-lg focus:ring-2 focus:ring-hi-platinum focus:border-hi-platinum"
                                required
                            >
                                <option value="">Выберите тип</option>
                                {eventTypes.map((type) => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-hi-graphite mb-1">
                                Дата мероприятия *
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-hi-silver" />
                                <input
                                    type="date"
                                    value={formData.eventDate}
                                    onChange={(e) => handleInputChange('eventDate', e.target.value)}
                                    className="w-full pl-10 pr-3 py-2 border border-hi-silver rounded-lg focus:ring-2 focus:ring-hi-platinum focus:border-hi-platinum"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-hi-graphite mb-1">
                                Время мероприятия
                            </label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-hi-silver" />
                                <input
                                    type="time"
                                    value={formData.eventTime}
                                    onChange={(e) => handleInputChange('eventTime', e.target.value)}
                                    className="w-full pl-10 pr-3 py-2 border border-hi-silver rounded-lg focus:ring-2 focus:ring-hi-platinum focus:border-hi-platinum"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-hi-graphite mb-1">
                                Количество гостей *
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="1000"
                                value={formData.guests}
                                onChange={(e) => handleInputChange('guests', parseInt(e.target.value) || 0)}
                                className="w-full px-3 py-2 border border-hi-silver rounded-lg focus:ring-2 focus:ring-hi-platinum focus:border-hi-platinum"
                                placeholder="50"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-hi-graphite mb-1">
                                Бюджет
                            </label>
                            <select
                                value={formData.budget}
                                onChange={(e) => handleInputChange('budget', e.target.value)}
                                className="w-full px-3 py-2 border border-hi-silver rounded-lg focus:ring-2 focus:ring-hi-platinum focus:border-hi-platinum"
                            >
                                <option value="">Выберите бюджет</option>
                                {budgetOptions.map((budget) => (
                                    <option key={budget} value={budget}>{budget}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="mt-3 sm:mt-4 space-y-3 sm:space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-hi-graphite mb-1">
                                Диетические ограничения
                            </label>
                            <textarea
                                value={formData.dietaryRestrictions}
                                onChange={(e) => handleInputChange('dietaryRestrictions', e.target.value)}
                                className="w-full px-3 py-2 border border-hi-silver rounded-lg focus:ring-2 focus:ring-hi-platinum focus:border-hi-platinum"
                                rows={3}
                                placeholder="Укажите аллергии, вегетарианство, веганство и т.д."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-hi-graphite mb-1">
                                Особые пожелания
                            </label>
                            <textarea
                                value={formData.specialRequests}
                                onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                                className="w-full px-3 py-2 border border-hi-silver rounded-lg focus:ring-2 focus:ring-hi-platinum focus:border-hi-platinum"
                                rows={3}
                                placeholder="Дополнительные требования к меню или сервису"
                            />
                        </div>
                    </div>
                </div>

                {/* Файлы */}
                <div className="bg-hi-white rounded-lg border border-hi-silver p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-semibold text-hi-graphite mb-3 sm:mb-4 flex items-center">
                        <Upload className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-hi-platinum" />
                        Загрузка файлов
                    </h3>

                    <div className="space-y-3 sm:space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-hi-graphite mb-1">
                                Аватар
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileChange('avatar', e.target.files)}
                                className="w-full px-3 py-2 border border-hi-silver rounded-lg focus:ring-2 focus:ring-hi-platinum focus:border-hi-platinum"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-hi-graphite mb-1">
                                Документы
                            </label>
                            <input
                                type="file"
                                multiple
                                accept=".pdf,.doc,.docx,.jpg,.png"
                                onChange={(e) => handleFileChange('documents', e.target.files)}
                                className="w-full px-3 py-2 border border-hi-silver rounded-lg focus:ring-2 focus:ring-hi-platinum focus:border-hi-platinum"
                            />
                            <p className="text-sm text-hi-graphite mt-1">
                                Поддерживаемые форматы: PDF, DOC, DOCX, JPG, PNG
                            </p>
                        </div>
                    </div>
                </div>

                {/* Рейтинги */}
                <div className="bg-hi-white rounded-lg border border-hi-silver p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-semibold text-hi-graphite mb-3 sm:mb-4 flex items-center">
                        <Star className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-hi-platinum" />
                        Оценки
                    </h3>

                    <div className="space-y-3 sm:space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-hi-graphite mb-2">
                                Общий рейтинг: {formData.rating}/5
                            </label>
                            <div className="flex space-x-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => handleInputChange('rating', star)}
                                        className={`w-8 h-8 ${star <= formData.rating
                                            ? 'text-hi-yellow'
                                            : 'text-hi-silver'
                                            } hover:text-hi-yellow transition-colors`}
                                    >
                                        <Star className="w-full h-full fill-current" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-hi-graphite mb-2">
                                Удовлетворенность сервисом: {formData.satisfaction}%
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={formData.satisfaction}
                                onChange={(e) => handleInputChange('satisfaction', parseInt(e.target.value))}
                                className="w-full h-2 bg-hi-ash rounded-lg appearance-none cursor-pointer slider"
                            />
                        </div>
                    </div>
                </div>

                {/* Кнопки действий */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
                    <Button
                        type="submit"
                        loading={isSubmitting}
                        className="flex-1"
                    >
                        {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                            setFormData({
                                firstName: '',
                                lastName: '',
                                email: '',
                                phone: '',
                                password: '',
                                confirmPassword: '',
                                address: '',
                                city: '',
                                zipCode: '',
                                country: '',
                                birthDate: '',
                                gender: '',
                                interests: [],
                                newsletter: false,
                                terms: false,
                                eventType: '',
                                eventDate: '',
                                eventTime: '',
                                guests: 0,
                                budget: '',
                                dietaryRestrictions: '',
                                specialRequests: '',
                                avatar: null,
                                documents: [],
                                rating: 0,
                                satisfaction: 0
                            });
                        }}
                        className="flex-1"
                    >
                        <X className="w-4 h-4 mr-2" />
                        Очистить форму
                    </Button>
                </div>
            </form>
        </div>
    );
}
