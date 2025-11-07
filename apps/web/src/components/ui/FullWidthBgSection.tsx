'use client';

import { ReactNode, CSSProperties } from 'react';
import styles from './FullWidthBgSection.module.css';

export interface FullWidthBgSectionProps {
  /** Полное CSS свойство background (может включать цвет, изображение, градиенты и т.д.) */
  background?: string;

  /** URL изображения для фона (используется если не задан background) */
  backgroundImage?: string;

  /** Позиция фонового изображения */
  backgroundPosition?:
  | 'center'
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top left'
  | 'top right'
  | 'bottom left'
  | 'bottom right'
  | 'center top'
  | 'center bottom'
  | string;

  /** Размер фонового изображения */
  backgroundSize?: 'cover' | 'contain' | 'auto' | string;

  /** Повтор фонового изображения */
  backgroundRepeat?: 'no-repeat' | 'repeat' | 'repeat-x' | 'repeat-y';

  /** Цвет фона (используется если не задан background) */
  backgroundColor?: string;

  /** Дополнительные CSS классы */
  className?: string;

  /** Содержимое компонента */
  children: ReactNode;

  /** Inline стили */
  style?: CSSProperties;

  /** Минимальная высота секции */
  minHeight?: string;

  /** Ширина контейнера (Tailwind классы или CSS значения) */
  containerWidth?: string;

  /** Дополнительные классы для контейнера */
  containerClassName?: string;

  /** Устаревшие настройки контейнера (для обратной совместимости) */
  containerSettings?: {
    maxWidth?: string;
    padding?: string;
    centered?: boolean;
  };
}

export function FullWidthBgSection({
  background,
  backgroundImage,
  backgroundPosition = 'center',
  backgroundSize = 'cover',
  backgroundRepeat = 'no-repeat',
  backgroundColor,
  className = '',
  children,
  style,
  minHeight = '400px',
  containerWidth = 'w-1/2',
  containerClassName = '',
  containerSettings
}: FullWidthBgSectionProps) {

  // Формируем стили для фона
  const backgroundStyles: CSSProperties = {
    // Используем shorthand background если он задан, иначе отдельные свойства
    ...(background ?
      { background } :
      {
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundColor,
        backgroundPosition,
        backgroundSize,
        backgroundRepeat,
      }
    ),
    minHeight,
    ...style
  };

  // Определяем стили контейнера
  let containerClasses = '';
  let containerStyles: CSSProperties = {};

  if (containerSettings) {
    // Используем старый API для обратной совместимости
    containerClasses = containerClassName;
    containerStyles = {
      maxWidth: containerSettings.maxWidth,
      padding: containerSettings.padding,
      margin: containerSettings.centered ? '0 auto' : undefined
    };
  } else {
    // Используем новый API с Tailwind классами
    containerClasses = `${containerWidth} mx-auto md:px-8 lg:px-8 p-4 ${containerClassName}`;
  }

  return (
    <section
      className={`${styles.fullWidthSection} ${className}`}
      style={backgroundStyles}
    >
      {/* Контейнер для содержимого */}
      <div
        className={containerClasses}
        style={containerStyles}
      >
        {children}
      </div>
    </section>
  );
}

