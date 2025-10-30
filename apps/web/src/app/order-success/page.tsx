'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, ShoppingBag, Home, Phone } from 'lucide-react';

function OrderSuccessContent() {
    const searchParams = useSearchParams();
    const orderNumber = searchParams.get('orderNumber');

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-2xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                    {/* Success Icon */}
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>

                    {/* Success Message */}
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        Заказ успешно оформлен!
                    </h1>

                    <p className="text-lg text-gray-600 mb-6">
                        Спасибо за ваш заказ. Мы свяжемся с вами в ближайшее время для подтверждения.
                    </p>

                    {/* Order Number */}
                    {orderNumber && (
                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                            <p className="text-sm text-gray-500 mb-1">Номер заказа:</p>
                            <p className="text-xl font-mono font-semibold text-gray-900">{orderNumber}</p>
                        </div>
                    )}

                    {/* Next Steps */}
                    <div className="bg-blue-50 rounded-lg p-6 mb-8">
                        <h2 className="text-lg font-semibold text-blue-900 mb-3">Что дальше?</h2>
                        <div className="text-left space-y-2 text-blue-800">
                            <p>1. Мы получили ваш заказ и обрабатываем его</p>
                            <p>2. Наш менеджер свяжется с вами в течение 30 минут</p>
                            <p>3. Мы подтвердим детали заказа и время доставки</p>
                            <p>4. Готовим ваш заказ и доставляем в указанное время</p>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="bg-hi-green bg-opacity-10 rounded-lg p-6 mb-8">
                        <h2 className="text-lg font-semibold text-hi-graphite mb-3">Нужна помощь?</h2>
                        <p className="text-gray-600 mb-4">
                            Если у вас есть вопросы по заказу, свяжитесь с нами:
                        </p>
                        <a
                            href="tel:+79999999999"
                            className="inline-flex items-center px-4 py-2 bg-hi-green text-white rounded-lg hover:bg-hi-green-dark transition-colors"
                        >
                            <Phone className="w-4 h-4 mr-2" />
                            +7 999 999 99 99
                        </a>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/"
                            className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            <Home className="w-4 h-4 mr-2" />
                            На главную
                        </Link>
                        <Link
                            href="/menus"
                            className="inline-flex items-center px-6 py-3 bg-[#BFA76F] hover:bg-[#BFA76F]/90 text-white rounded-lg transition-all shadow-hi hover:shadow-hi-hover"
                        >
                            <ShoppingBag className="w-4 h-4 mr-2" />
                            Заказать еще
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function OrderSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hi-green mx-auto mb-4"></div>
                    <p className="text-gray-600">Загружаем...</p>
                </div>
            </div>
        }>
            <OrderSuccessContent />
        </Suspense>
    );
}
