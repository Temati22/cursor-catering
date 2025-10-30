'use client';

import { useEffect, useRef } from 'react';

interface YandexMapProps {
    width?: string | number;
    height?: string | number;
    center?: [number, number];
    zoom?: number;
    className?: string;
}

// Глобальная переменная для отслеживания загрузки API
let isYandexMapsLoaded = false;
let isLoadingPromise: Promise<void> | null = null;

// Функция для загрузки API Яндекс.Карт
const loadYandexMapsAPI = (): Promise<void> => {
    if (isYandexMapsLoaded && window.ymaps) {
        return Promise.resolve();
    }

    if (isLoadingPromise) {
        return isLoadingPromise;
    }

    isLoadingPromise = new Promise((resolve, reject) => {
        // Проверяем, есть ли уже скрипт в DOM
        const existingScript = document.querySelector('script[src*="api-maps.yandex.ru"]');

        if (existingScript) {
            // Если скрипт уже есть, ждем его загрузки
            const checkYmaps = () => {
                if (window.ymaps) {
                    isYandexMapsLoaded = true;
                    resolve();
                } else {
                    setTimeout(checkYmaps, 100);
                }
            };
            checkYmaps();
            return;
        }

        // Создаем новый скрипт
        const script = document.createElement('script');
        const apiKey = process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY || 'YOUR_API_KEY';
        script.src = `https://api-maps.yandex.ru/2.1/?apikey=${apiKey}&lang=ru_RU`;
        script.async = true;

        script.onload = () => {
            window.ymaps.ready(() => {
                isYandexMapsLoaded = true;
                resolve();
            });
        };

        script.onerror = () => {
            isLoadingPromise = null;
            reject(new Error('Failed to load Yandex Maps API'));
        };

        document.head.appendChild(script);
    });

    return isLoadingPromise;
};

export function YandexMap({
    width = '100%',
    height = '100%',
    center = [55.7558, 37.6176], // Москва по умолчанию
    zoom = 15,
    className = '',
}: YandexMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const ymapsRef = useRef<any>(null);
    const mapInstanceRef = useRef<any>(null);

    useEffect(() => {
        // Загружаем API и инициализируем карту
        loadYandexMapsAPI()
            .then(() => {
                ymapsRef.current = window.ymaps;
                initializeMap();
            })
            .catch((error) => {
                console.error('Error loading Yandex Maps API:', error);
            });

        return () => {
            // Очистка при размонтировании
            if (mapInstanceRef.current) {
                mapInstanceRef.current.destroy();
                mapInstanceRef.current = null;
            }
        };
    }, []);

    const initializeMap = () => {
        if (!mapRef.current || !ymapsRef.current) return;

        // Создаем карту
        mapInstanceRef.current = new ymapsRef.current.Map(mapRef.current, {
            center: center,
            zoom: zoom,
            controls: ['zoomControl', 'fullscreenControl', 'typeSelector', 'geolocationControl'],
        });

        // Добавляем слой карты
        mapInstanceRef.current.layers.add(ymapsRef.current.map.layers.get('yandex#map'));

        // Добавляем обработчик изменения размера карты
        const resizeObserver = new ResizeObserver(() => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.container.fitToViewport();
            }
        });

        if (mapRef.current) {
            resizeObserver.observe(mapRef.current);
        }

        return () => {
            resizeObserver.disconnect();
        };
    };

    return (
        <div
            ref={mapRef}
            style={{
                width: typeof width === 'number' ? `${width}px` : width,
                height: typeof height === 'number' ? `${height}px` : height,
            }}
            className={className}
        />
    );
}

// Расширяем глобальный объект Window для TypeScript
declare global {
    interface Window {
        ymaps: any;
    }
}
