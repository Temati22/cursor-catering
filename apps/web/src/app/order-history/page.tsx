'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Calendar, Clock, MapPin, Phone, Mail, Package, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { apiClient, Order } from '@/lib/api';

function OrderHistoryContent() {
  const searchParams = useSearchParams();
  const phone = searchParams.get('phone');

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchPhone, setSearchPhone] = useState(phone || '');

  const fetchOrders = async (phoneNumber: string) => {
    if (!phoneNumber.trim()) {
      setOrders([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await apiClient.getOrders({
        populate: '*',
        filters: {
          'customerPhone[$eq]': phoneNumber
        },
        sort: 'createdAt:desc'
      });

      setOrders(response.data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Не удалось загрузить заказы');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (phone) {
      fetchOrders(phone);
    } else {
      setLoading(false);
    }
  }, [phone]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders(searchPhone);
  };

  const getStatusLabel = (status: Order['status']) => {
    const labels: Record<Order['status'], string> = {
      pending: 'Ожидает подтверждения',
      confirmed: 'Подтвержден',
      preparing: 'Готовится',
      ready: 'Готов к выдаче',
      delivered: 'Доставлен',
      cancelled: 'Отменен'
    };
    return labels[status];
  };

  const getStatusColor = (status: Order['status']) => {
    const colors: Record<Order['status'], string> = {
      pending: 'text-hi-yellow bg-hi-yellow/10',
      confirmed: 'text-blue-600 bg-blue-100',
      preparing: 'text-orange-600 bg-orange-100',
      ready: 'text-green-600 bg-green-100',
      delivered: 'text-green-600 bg-green-100',
      cancelled: 'text-red-600 bg-red-100'
    };
    return colors[status];
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">История заказов</h1>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Поиск заказов</h2>
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Номер телефона
              </label>
              <input
                type="tel"
                id="phone"
                value={searchPhone}
                onChange={(e) => setSearchPhone(e.target.value)}
                placeholder="+7 (999) 999-99-99"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hi-green focus:border-transparent"
                required
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-hi-green text-white rounded-lg hover:bg-hi-green-dark transition-colors disabled:opacity-50"
              >
                {loading ? 'Поиск...' : 'Найти'}
              </button>
            </div>
          </form>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hi-green mx-auto"></div>
            <p className="mt-4 text-gray-600">Загружаем заказы...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600">{error}</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchPhone ? 'Заказы не найдены' : 'Введите номер телефона для поиска'}
            </h3>
            <p className="text-gray-600">
              {searchPhone
                ? 'По данному номеру телефона заказы не найдены'
                : 'Введите номер телефона, который использовался при оформлении заказов'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm p-6">
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Заказ #{order.orderNumber}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('ru-RU', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)} mt-2 sm:mt-0`}>
                    {getStatusIcon(order.status)}
                    <span className="ml-2">{getStatusLabel(order.status)}</span>
                  </div>
                </div>

                {/* Order Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Customer Info */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Информация о заказе</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Phone className="w-4 h-4 mr-2" />
                        {order.customerPhone}
                      </div>
                      {order.customerEmail && (
                        <div className="flex items-center text-gray-600">
                          <Mail className="w-4 h-4 mr-2" />
                          {order.customerEmail}
                        </div>
                      )}
                      {order.deliveryAddress && (
                        <div className="flex items-center text-gray-600">
                          <MapPin className="w-4 h-4 mr-2" />
                          {order.deliveryAddress}
                        </div>
                      )}
                      {order.deliveryDate && (
                        <div className="flex items-center text-gray-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          {new Date(order.deliveryDate).toLocaleDateString('ru-RU')}
                        </div>
                      )}
                      {order.deliveryTime && (
                        <div className="flex items-center text-gray-600">
                          <Clock className="w-4 h-4 mr-2" />
                          {order.deliveryTime}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Состав заказа</h4>
                    <div className="space-y-2">
                      {order.orderItems?.map((item, index) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                          <div>
                            <span className="font-medium text-gray-900">{item.menu.name}</span>
                            <span className="text-gray-500 ml-2">× {item.quantity}</span>
                          </div>
                          <span className="font-medium text-gray-900">
                            {item.totalPrice} {order.currency}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between items-center font-semibold text-gray-900">
                        <span>Итого:</span>
                        <span>{order.totalAmount} {order.currency}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {order.notes && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-medium text-gray-900 mb-2">Комментарии</h4>
                    <p className="text-sm text-gray-600">{order.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function OrderHistoryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hi-green mx-auto mb-4"></div>
          <p className="text-gray-600">Загружаем...</p>
        </div>
      </div>
    }>
      <OrderHistoryContent />
    </Suspense>
  );
}
