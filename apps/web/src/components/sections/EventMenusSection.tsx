'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { StrapiImage } from '@/components/ui/StrapiImage';
import { Menu } from '@/lib/api';
import { ShoppingCart, Plus, Minus, Heart, ChevronDown, MessageCircle } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';

interface EventMenusSectionProps {
  menus: Menu[];
  getImageUrl: (url: string) => string;
  title?: string;
  description?: string;
  smallDescription?: string;
}

export function EventMenusSection({ menus, getImageUrl, title, description, smallDescription }: EventMenusSectionProps) {
  const { addMenu, removeItem, updateQuantity, state } = useCart();
  const { addMenu: addMenuToFavorites, removeFavorite, isFavorite } = useFavorites();

  // Пагинация меню - показываем по 4 в ряд (первая строка)
  const [visibleMenus, setVisibleMenus] = useState(4);

  // Обработчики для кнопок
  const handleLoadMore = () => {
    setVisibleMenus(prev => Math.min(prev + 4, menus.length));
  };

  const handleRequestMenu = () => {
    // Здесь можно добавить логику для открытия формы запроса меню
    // Например, открыть модальное окно или перенаправить на страницу контактов
    window.open('/contacts', '_blank');
  };

  // Определяем какие меню показывать
  const displayedMenus = menus.slice(0, visibleMenus);
  const hasMoreMenus = menus.length > visibleMenus;

  // Show header even if no menus - content might still be valid
  const showHeader = title || description || smallDescription;

  if (!showHeader && (!menus || menus.length === 0)) {
    return null;
  }

  return (
    <section className="mb-12">
      {/* Menu Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {displayedMenus.map((menu) => {
          const menuId = menu.id || menu.documentId || Math.random();
          const cartItem = state.items.find(item => item.menu?.id === menu.id);
          const quantity = cartItem?.quantity || 0;
          const isMenuFavorite = isFavorite(menu.id, 'menu');

          const handleAddToCart = () => {
            addMenu(menu, 1);
          };

          const handleIncrease = () => {
            if (quantity === 0) {
              addMenu(menu, 1);
            } else {
              updateQuantity(menu.id, 'menu', quantity + 1);
            }
          };

          const handleDecrease = () => {
            if (quantity <= 1) {
              removeItem(menu.id, 'menu');
            } else {
              updateQuantity(menu.id, 'menu', quantity - 1);
            }
          };

          const handleFavoriteClick = (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();

            if (isMenuFavorite) {
              removeFavorite(menu.id, 'menu');
            } else {
              addMenuToFavorites(menu);
            }
          };

          return (
            <div
              key={menuId}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              {/* Menu Image */}
              {menu.image && Array.isArray(menu.image) && menu.image.length > 0 && menu.image[0]?.url && (
                <div className="relative h-48 w-full overflow-hidden">
                  <Link
                    href={`/menus/${menu.slug}`}
                    className="block group relative h-full w-full"
                  >
                    <StrapiImage
                      src={getImageUrl(menu.image[0].url)}
                      alt={menu.name || 'Menu image'}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  {/* Favorite button */}
                  <button
                    onClick={handleFavoriteClick}
                    className={`absolute top-3 right-3 w-8 h-8 rounded-full backdrop-blur-sm flex items-center justify-center transition-all duration-300 z-10 ${isMenuFavorite
                      ? 'bg-red-500/90 text-white'
                      : 'bg-white/80 text-gray-600 hover:text-red-500 hover:bg-white'
                      }`}
                    aria-label={isMenuFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
                  >
                    <Heart size={16} className={isMenuFavorite ? 'fill-current' : ''} />
                  </button>
                </div>
              )}

              {/* Menu Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-hi-graphite mb-2 group-hover:text-hi-platinum transition-colors">
                  {menu.name || 'Без названия'}
                </h3>

                {menu.description && (
                  <p className="text-hi-silver text-sm mb-3 line-clamp-2">
                    {menu.description}
                  </p>
                )}


                {/* Price and Action Buttons */}
                <div className="flex justify-between items-center pt-4 border-t border-hi-ash">
                  {/* Price */}
                  {menu.pricePerPerson && (
                    <div className="flex items-center">
                      <span className="text-base font-normal text-hi-platinum">
                        {menu.pricePerPerson}
                      </span>
                      <span className="text-sm text-hi-platinum ml-1">
                        {menu.currency || 'руб.'}
                      </span>
                    </div>
                  )}

                  {/* Quantity Counter */}
                  {quantity > 0 ? (
                    <div className="flex items-center space-x-2 bg-hi-green rounded-lg px-3 py-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDecrease();
                        }}
                        className="text-white hover:text-hi-platinum transition-colors"
                        aria-label="Уменьшить количество"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="text-white font-medium text-sm min-w-[20px] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleIncrease();
                        }}
                        className="text-white hover:text-hi-platinum transition-colors"
                        aria-label="Увеличить количество"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart();
                      }}
                      className="bg-[#BFA76F] hover:bg-[#BFA76F]/90 text-white px-4 py-2 rounded-lg font-medium text-sm transition-all shadow-hi hover:shadow-hi-hover flex items-center space-x-1"
                    >
                      <ShoppingCart size={16} />
                      <span>Заказать</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      {menus.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
          {/* Кнопка подгрузки дополнительных меню */}
          {hasMoreMenus && (
            <button
              onClick={handleLoadMore}
              className="bg-hi-ash hover:bg-hi-silver text-hi-graphite px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 group"
            >
              <ChevronDown size={20} className="group-hover:translate-y-1 transition-transform" />
              <span>Показать еще меню</span>
            </button>
          )}
        </div>
      )}
    </section>
  );
}
