import React from 'react';
import { FallbackComponent } from './FallbackComponent';

/**
 * Примеры использования FallbackComponent
 * Этот файл демонстрирует различные способы применения fallback компонента
 */

// 1. Базовое использование
export const BasicFallback = () => (
  <FallbackComponent />
);

// 2. С кастомным сообщением
export const CustomMessageFallback = () => (
  <FallbackComponent message="Данные временно недоступны" />
);

// 3. Различные размеры
export const SizeVariants = () => (
  <div className="space-y-4">
    <div>
      <h3 className="text-sm font-medium text-gray-700 mb-2">Маленький</h3>
      <FallbackComponent size="sm" />
    </div>
    <div>
      <h3 className="text-sm font-medium text-gray-700 mb-2">Средний (по умолчанию)</h3>
      <FallbackComponent size="md" />
    </div>
    <div>
      <h3 className="text-sm font-medium text-gray-700 mb-2">Большой</h3>
      <FallbackComponent size="lg" />
    </div>
    <div>
      <h3 className="text-sm font-medium text-gray-700 mb-2">Очень большой</h3>
      <FallbackComponent size="xl" />
    </div>
  </div>
);

// 4. Различные варианты стилей
export const StyleVariants = () => (
  <div className="space-y-4">
    <div>
      <h3 className="text-sm font-medium text-gray-700 mb-2">По умолчанию</h3>
      <FallbackComponent variant="default" />
    </div>
    <div>
      <h3 className="text-sm font-medium text-gray-700 mb-2">Минимальный</h3>
      <FallbackComponent variant="minimal" />
    </div>
    <div>
      <h3 className="text-sm font-medium text-gray-700 mb-2">Карточка</h3>
      <FallbackComponent variant="card" />
    </div>
    <div>
      <h3 className="text-sm font-medium text-gray-700 mb-2">Инлайн</h3>
      <FallbackComponent variant="inline" />
    </div>
  </div>
);

// 5. В контексте загрузки данных
export const LoadingDataExample = ({ 
  isLoading, 
  data, 
  error 
}: { 
  isLoading: boolean; 
  data: any; 
  error: string | null; 
}) => {
  if (isLoading) {
    return (
      <FallbackComponent 
        message="Загрузка данных..." 
        variant="card"
        size="lg"
      />
    );
  }

  if (error) {
    return (
      <FallbackComponent 
        message="Ошибка загрузки данных" 
        variant="card"
        size="lg"
        className="border-red-200 bg-red-50 text-red-600"
      />
    );
  }

  if (!data) {
    return (
      <FallbackComponent 
        message="Компонент на стадии разработки" 
        variant="card"
        size="lg"
      />
    );
  }

  return <div>Здесь отображаются реальные данные</div>;
};

// 6. Hook для использования с состоянием загрузки
export const useFallbackState = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [data, setData] = React.useState(null);
  const [error, setError] = React.useState<string | null>(null);

  const renderWithFallback = (Component: React.ComponentType<any>, props?: any) => {
    if (isLoading) {
      return <FallbackComponent message="Загрузка..." />;
    }
    
    if (error) {
      return <FallbackComponent message={`Ошибка: ${error}`} className="text-red-600" />;
    }
    
    if (!data) {
      return <FallbackComponent />;
    }

    return <Component data={data} {...props} />;
  };

  return {
    isLoading,
    setIsLoading,
    data,
    setData,
    error,
    setError,
    renderWithFallback
  };
};

// 7. HOC для автоматического fallback
export const withFallback = <P extends object>(
  Component: React.ComponentType<P>,
  fallbackProps?: Partial<React.ComponentProps<typeof FallbackComponent>>
) => {
  return (props: P & { isLoading?: boolean; hasError?: boolean; hasData?: boolean }) => {
    const { isLoading, hasError, hasData, ...componentProps } = props;

    if (isLoading) {
      return <FallbackComponent message="Загрузка..." {...fallbackProps} />;
    }

    if (hasError) {
      return <FallbackComponent message="Произошла ошибка" {...fallbackProps} />;
    }

    if (!hasData) {
      return <FallbackComponent {...fallbackProps} />;
    }

    return <Component {...(componentProps as P)} />;
  };
};
