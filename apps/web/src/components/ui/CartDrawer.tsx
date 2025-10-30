'use client';

import React from 'react';
import { X, ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { CartItem } from './CartItem';
import Link from 'next/link';

export function CartDrawer() {
    const { state, closeCart } = useCart();
    const { items, totalAmount, totalItems } = state;

    return (
        <>
            {/* Backdrop */}
            {state.isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={closeCart}
                />
            )}

            {/* Drawer */}
            <div
                className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${state.isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-2">
                        <ShoppingCart size={24} className="text-hi-green" />
                        <h2 className="text-lg font-semibold text-hi-graphite">
                            Корзина ({totalItems})
                        </h2>
                    </div>
                    <button
                        onClick={closeCart}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        aria-label="Закрыть корзину"
                    >
                        <X size={20} className="text-gray-600" />
                    </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-center p-6">
                            <ShoppingCart size={48} className="text-gray-300 mb-4" />
                            <h3 className="text-lg font-medium text-gray-500 mb-2">
                                Корзина пуста
                            </h3>
                            <p className="text-sm text-gray-400">
                                Добавьте меню, чтобы сделать заказ
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {items
                                .filter(item => item.menu) // Filter out items without menu
                                .map((item) => (
                                    <CartItem key={item.menu!.id} item={item} />
                                ))
                            }
                        </div>
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="border-t border-gray-200 p-6 space-y-4">
                        {/* Total */}
                        <div className="flex justify-between items-center text-lg font-semibold text-hi-graphite">
                            <span>Итого:</span>
                            <span>{totalAmount} руб</span>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-2">
                            <Link
                                href="/checkout"
                                onClick={closeCart}
                                className="w-full bg-hi-green text-white py-3 px-4 rounded-lg font-medium text-center hover:bg-hi-green-dark transition-colors block"
                            >
                                Оформить заказ
                            </Link>
                            <Link
                                href="/menus"
                                onClick={closeCart}
                                className="w-full bg-gray-100 text-hi-graphite py-3 px-4 rounded-lg font-medium text-center hover:bg-gray-200 transition-colors block"
                            >
                                Продолжить покупки
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
