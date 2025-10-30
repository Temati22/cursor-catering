import React from 'react';

interface FallbackComponentProps {
  /**
   * Дополнительные CSS классы для кастомизации стилей
   */
  className?: string;
  /**
   * Кастомный текст сообщения. По умолчанию: "Компонент на стадии разработки"
   */
  message?: string;
  /**
   * Размер компонента
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /**
   * Вариант отображения
   */
  variant?: 'default' | 'minimal' | 'card' | 'inline';
}

/**
 * Fallback компонент для отображения заглушки вместо данных, которые не загрузились
 */
export const FallbackComponent: React.FC<FallbackComponentProps> = ({
  className = '',
  message = 'Компонент на стадии разработки',
  size = 'md',
  variant = 'default'
}) => {
  const sizeClasses = {
    sm: 'text-sm p-3 min-h-[80px]',
    md: 'text-base p-4 min-h-[120px]',
    lg: 'text-lg p-6 min-h-[160px]',
    xl: 'text-xl p-8 min-h-[200px]'
  };

  const variantClasses = {
    default: 'bg-gray-50 border border-gray-200 rounded-lg shadow-sm',
    minimal: 'bg-gray-25 border border-gray-100 rounded',
    card: 'bg-white border border-gray-200 rounded-xl shadow-md',
    inline: 'bg-gray-100 rounded-md'
  };

  const baseClasses = [
    'flex items-center justify-center',
    'text-gray-500',
    'font-medium',
    'transition-all duration-200',
    'hover:bg-gray-100',
    sizeClasses[size],
    variantClasses[variant],
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={baseClasses}>
      <div className="text-center">
        <div className="mb-2">
          {/* Иконка разработки */}
          <svg 
            className="w-6 h-6 mx-auto text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" 
            />
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
            />
          </svg>
        </div>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default FallbackComponent;
