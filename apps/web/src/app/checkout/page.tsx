'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { apiClient, CreateOrderData } from '@/lib/api';
import { CartItem } from '@/components/ui/CartItem';
import { Calendar, Clock, MapPin, User, Phone, Mail, MessageSquare } from 'lucide-react';

export default function CheckoutPage() {
    const router = useRouter();
    const { state, clearCart } = useCart();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        deliveryAddress: '',
        deliveryDate: '',
        deliveryTime: '',
        notes: '',
        paymentMethod: 'cash' as 'cash' | 'card' | 'online' | 'bank_transfer'
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            // Prepare order items
            const orderItems = state.items
                .filter(item => item.menu) // Filter out items without menu
                .map(item => ({
                    menu: item.menu!.id,
                    quantity: item.quantity,
                    unitPrice: item.menu!.pricePerPerson || 0,
                    totalPrice: item.quantity * (item.menu!.pricePerPerson || 0)
                }));

            // Create order
            const orderData: CreateOrderData = {
                ...formData,
                orderItems,
                totalAmount: state.totalAmount,
                currency: 'руб',
                status: 'pending',
                paymentStatus: 'pending'
            };

            const response = await apiClient.createOrder(orderData);

            // Clear cart and redirect to success page
            clearCart();
            router.push(`/order-success?orderNumber=${response.data.orderNumber}`);
        } catch (err: any) {
            console.error('Order creation failed:', err);
            setError('Произошла ошибка при создании заказа. Попробуйте еще раз.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (state.items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-2xl mx-auto px-4">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Корзина пуста</h1>
                        <p className="text-gray-600 mb-8">Добавьте меню в корзину, чтобы оформить заказ</p>
                        <a
                            href="/menus"
                            className="inline-flex items-center px-6 py-3 bg-hi-green text-white rounded-lg hover:bg-hi-green-dark transition-colors"
                        >
                            Перейти к меню
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Оформление заказа</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Order Summary */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Ваш заказ</h2>
                        <div className="space-y-4">
                            {state.items
                                .filter(item => item.menu) // Filter out items without menu
                                .map((item) => (
                                    <CartItem key={item.menu!.id} item={item} />
                                ))
                            }
                        </div>
                        <div className="border-t pt-4 mt-4">
                            <div className="flex justify-between text-lg font-semibold text-gray-900">
                                <span>Итого:</span>
                                <span>{state.totalAmount} руб</span>
                            </div>
                        </div>
                    </div>

                    {/* Order Form */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Данные заказа</h2>

                        {error && (
                            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-600">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Customer Info */}
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
                                        <User size={16} className="inline mr-2" />
                                        Имя и фамилия *
                                    </label>
                                    <input
                                        type="text"
                                        id="customerName"
                                        name="customerName"
                                        required
                                        value={formData.customerName}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hi-green focus:border-transparent"
                                        placeholder="Введите ваше имя"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700 mb-1">
                                        <Phone size={16} className="inline mr-2" />
                                        Телефон *
                                    </label>
                                    <input
                                        type="tel"
                                        id="customerPhone"
                                        name="customerPhone"
                                        required
                                        value={formData.customerPhone}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hi-green focus:border-transparent"
                                        placeholder="+7 (999) 999-99-99"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700 mb-1">
                                        <Mail size={16} className="inline mr-2" />
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="customerEmail"
                                        name="customerEmail"
                                        value={formData.customerEmail}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hi-green focus:border-transparent"
                                        placeholder="your@email.com"
                                    />
                                </div>
                            </div>

                            {/* Delivery Info */}
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="deliveryAddress" className="block text-sm font-medium text-gray-700 mb-1">
                                        <MapPin size={16} className="inline mr-2" />
                                        Адрес доставки
                                    </label>
                                    <textarea
                                        id="deliveryAddress"
                                        name="deliveryAddress"
                                        rows={3}
                                        value={formData.deliveryAddress}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hi-green focus:border-transparent"
                                        placeholder="Укажите адрес доставки"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="deliveryDate" className="block text-sm font-medium text-gray-700 mb-1">
                                            <Calendar size={16} className="inline mr-2" />
                                            Дата доставки
                                        </label>
                                        <input
                                            type="date"
                                            id="deliveryDate"
                                            name="deliveryDate"
                                            value={formData.deliveryDate}
                                            onChange={handleInputChange}
                                            min={new Date().toISOString().split('T')[0]}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hi-green focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="deliveryTime" className="block text-sm font-medium text-gray-700 mb-1">
                                            <Clock size={16} className="inline mr-2" />
                                            Время доставки
                                        </label>
                                        <input
                                            type="time"
                                            id="deliveryTime"
                                            name="deliveryTime"
                                            value={formData.deliveryTime}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hi-green focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div>
                                <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-1">
                                    Способ оплаты
                                </label>
                                <select
                                    id="paymentMethod"
                                    name="paymentMethod"
                                    value={formData.paymentMethod}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hi-green focus:border-transparent"
                                >
                                    <option value="cash">Наличными при получении</option>
                                    <option value="card">Картой при получении</option>
                                    <option value="online">Онлайн оплата</option>
                                    <option value="bank_transfer">Банковский перевод</option>
                                </select>
                            </div>

                            {/* Notes */}
                            <div>
                                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                                    <MessageSquare size={16} className="inline mr-2" />
                                    Комментарии к заказу
                                </label>
                                <textarea
                                    id="notes"
                                    name="notes"
                                    rows={3}
                                    value={formData.notes}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hi-green focus:border-transparent"
                                    placeholder="Дополнительные пожелания или комментарии"
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-hi-green text-white py-3 px-4 rounded-lg font-medium hover:bg-hi-green-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Оформляем заказ...' : `Оформить заказ за ${state.totalAmount} руб`}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
