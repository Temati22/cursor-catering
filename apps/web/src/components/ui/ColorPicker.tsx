'use client';

import { useState, useEffect } from 'react';
import { Copy, Download, Palette, RotateCcw } from 'lucide-react';

interface ColorScheme {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    success: string;
    warning: string;
    error: string;
}

interface HiColorScheme {
    platinum: string;
    red: string;
    green: string;
    white: string;
    graphite: string;
    ash: string;
    deep: string;
    silver: string;
}

interface ColorPickerProps {
    onColorChange?: (colors: ColorScheme) => void;
    onGenerateInstructions?: (instructions: string) => void;
}

const defaultColors: ColorScheme = {
    primary: '#BFA76F', // hi-platinum
    secondary: '#C64848', // hi-red
    accent: '#5AA469', // hi-green
    background: '#FFFFFF', // hi-white
    text: '#2B2B2B', // hi-graphite
    success: '#5AA469', // hi-green
    warning: '#BFA76F', // hi-platinum
    error: '#C64848', // hi-red
};

const defaultHiColors: HiColorScheme = {
    platinum: '#BFA76F',
    red: '#C64848',
    green: '#5AA469',
    white: '#FFFFFF',
    graphite: '#2B2B2B',
    ash: '#F5F5F5',
    deep: '#1A1A1A',
    silver: '#D8D8D8',
};

export function ColorPicker({ onColorChange, onGenerateInstructions }: ColorPickerProps) {
    const [colors, setColors] = useState<ColorScheme>(defaultColors);
    const [hiColors, setHiColors] = useState<HiColorScheme>(defaultHiColors);
    const [previewMode, setPreviewMode] = useState(false);
    const [instructions, setInstructions] = useState<string>('');
    const [copied, setCopied] = useState(false);

    // Применяем цвета к CSS переменным для предварительного просмотра
    useEffect(() => {
        if (previewMode) {
            const root = document.documentElement;
            root.style.setProperty('--color-hi-platinum', hiColors.platinum);
            root.style.setProperty('--color-hi-red', hiColors.red);
            root.style.setProperty('--color-hi-green', hiColors.green);
            root.style.setProperty('--color-hi-white', hiColors.white);
            root.style.setProperty('--color-hi-graphite', hiColors.graphite);
            root.style.setProperty('--color-hi-ash', hiColors.ash);
            root.style.setProperty('--color-hi-deep', hiColors.deep);
            root.style.setProperty('--color-hi-silver', hiColors.silver);
        } else {
            // Сбрасываем к исходным цветам Hi-catering
            const root = document.documentElement;
            root.style.setProperty('--color-hi-platinum', '#BFA76F');
            root.style.setProperty('--color-hi-red', '#C64848');
            root.style.setProperty('--color-hi-green', '#5AA469');
            root.style.setProperty('--color-hi-white', '#FFFFFF');
            root.style.setProperty('--color-hi-graphite', '#2B2B2B');
            root.style.setProperty('--color-hi-ash', '#F5F5F5');
            root.style.setProperty('--color-hi-deep', '#1A1A1A');
            root.style.setProperty('--color-hi-silver', '#D8D8D8');
        }
    }, [hiColors, previewMode]);

    const handleColorChange = (colorKey: keyof ColorScheme, value: string) => {
        const newColors = { ...colors, [colorKey]: value };
        setColors(newColors);
        onColorChange?.(newColors);
    };

    const handleHiColorChange = (colorKey: keyof HiColorScheme, value: string) => {
        const newHiColors = { ...hiColors, [colorKey]: value };
        setHiColors(newHiColors);
    };

    const generateInstructions = () => {
        const instruction = `
# Инструкция по изменению цветовой схемы Hi-catering

## 1. Обновление CSS переменных в globals.css

Замените следующие CSS переменные в файле \`/apps/web/src/app/globals.css\`:

\`\`\`css
:root {
  /* Hi Color Palette */
  --color-hi-white: ${hiColors.white};
  --color-hi-graphite: ${hiColors.graphite};
  --color-hi-platinum: ${hiColors.platinum};
  --color-hi-red: ${hiColors.red};
  --color-hi-green: ${hiColors.green};
  --color-hi-ash: ${hiColors.ash};
  --color-hi-deep: ${hiColors.deep};
  --color-hi-silver: ${hiColors.silver};
}
\`\`\`

## 2. Обновление Tailwind конфигурации

В файле \`tailwind.config.js\` добавьте кастомные цвета Hi-catering:

\`\`\`javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        'hi-platinum': {
          50: '${adjustColorBrightness(hiColors.platinum, 0.9)}',
          100: '${adjustColorBrightness(hiColors.platinum, 0.8)}',
          500: '${hiColors.platinum}',
          600: '${adjustColorBrightness(hiColors.platinum, -0.1)}',
          700: '${adjustColorBrightness(hiColors.platinum, -0.2)}',
        },
        'hi-red': {
          50: '${adjustColorBrightness(hiColors.red, 0.9)}',
          100: '${adjustColorBrightness(hiColors.red, 0.8)}',
          500: '${hiColors.red}',
          600: '${adjustColorBrightness(hiColors.red, -0.1)}',
          700: '${adjustColorBrightness(hiColors.red, -0.2)}',
        },
        'hi-green': {
          50: '${adjustColorBrightness(hiColors.green, 0.9)}',
          100: '${adjustColorBrightness(hiColors.green, 0.8)}',
          500: '${hiColors.green}',
          600: '${adjustColorBrightness(hiColors.green, -0.1)}',
          700: '${adjustColorBrightness(hiColors.green, -0.2)}',
        },
        'hi-graphite': '${hiColors.graphite}',
        'hi-white': '${hiColors.white}',
        'hi-ash': '${hiColors.ash}',
        'hi-deep': '${hiColors.deep}',
        'hi-silver': '${hiColors.silver}'
      }
    }
  }
}
\`\`\`

## 3. Обновление компонентов

Замените все использования цветов в компонентах:

- \`from-orange-500 to-red-500\` → \`from-hi-platinum-500 to-hi-red-500\`
- \`bg-orange-500\` → \`bg-hi-platinum-500\`
- \`text-orange-600\` → \`text-hi-platinum-600\`
- \`border-orange-300\` → \`border-hi-platinum-300\`

## 4. Проверка изменений

После внесения изменений:
1. Перезапустите dev сервер
2. Проверьте все страницы на корректность отображения
3. Убедитесь, что контрастность текста соответствует стандартам

## Текущая цветовая схема Hi-catering:
- Platinum: ${hiColors.platinum}
- Red: ${hiColors.red}
- Green: ${hiColors.green}
- White: ${hiColors.white}
- Graphite: ${hiColors.graphite}
- Ash: ${hiColors.ash}
- Deep: ${hiColors.deep}
- Silver: ${hiColors.silver}

## Основная цветовая схема:
- Основной цвет (Platinum): ${colors.primary}
- Вторичный цвет (Red): ${colors.secondary}
- Акцентный цвет (Green): ${colors.accent}
- Фон (White): ${colors.background}
- Текст (Graphite): ${colors.text}
- Успех (Green): ${colors.success}
- Предупреждение (Platinum): ${colors.warning}
- Ошибка (Red): ${colors.error}
        `.trim();

        setInstructions(instruction);
        onGenerateInstructions?.(instruction);
    };

    const copyInstructions = async () => {
        try {
            await navigator.clipboard.writeText(instructions);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy instructions: ', err);
        }
    };

    const resetColors = () => {
        setColors(defaultColors);
        setHiColors(defaultHiColors);
        setPreviewMode(false);
        setInstructions('');
    };

    const togglePreview = () => {
        setPreviewMode(!previewMode);
    };

    return (
        <div className="w-full max-w-none min-h-screen p-3 sm:p-4 bg-hi-ash">
            {/* Заголовок и кнопки управления */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6">
                <div className="flex items-center space-x-2 mb-3 sm:mb-0">
                    <Palette className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: colors.primary }} />
                    <h3 className="text-base sm:text-lg font-semibold">Цветовая схема Hi-catering</h3>
                </div>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <button
                        onClick={togglePreview}
                        className={`px-3 py-1 rounded-lg text-xs sm:text-sm font-medium transition-colors ${previewMode
                            ? 'text-white'
                            : 'bg-hi-silver text-hi-graphite hover:bg-hi-silver'
                            }`}
                        style={previewMode ? { backgroundColor: colors.primary } : {}}
                    >
                        {previewMode ? 'Отключить предпросмотр' : 'Предпросмотр'}
                    </button>
                    <button
                        onClick={resetColors}
                        className="px-3 py-1 bg-hi-silver text-hi-graphite rounded-lg text-xs sm:text-sm font-medium hover:bg-hi-silver transition-colors"
                    >
                        <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                </div>
            </div>

            {/* Цветовые палитры */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4 w-full mb-6">
                {Object.entries(colors).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                        <label className="block text-xs sm:text-sm font-medium text-hi-graphite capitalize">
                            {key === 'primary' ? 'Основной' :
                                key === 'secondary' ? 'Вторичный' :
                                    key === 'accent' ? 'Акцентный' :
                                        key === 'background' ? 'Фон' :
                                            key === 'text' ? 'Текст' :
                                                key === 'success' ? 'Успех' :
                                                    key === 'warning' ? 'Предупреждение' :
                                                        key === 'error' ? 'Ошибка' : key}
                        </label>
                        <div className="flex items-center space-x-1 sm:space-x-2">
                            <input
                                type="color"
                                value={value}
                                onChange={(e) => handleColorChange(key as keyof ColorScheme, e.target.value)}
                                className="w-6 h-6 sm:w-8 sm:h-8 rounded border border-hi-silver cursor-pointer"
                            />
                            <input
                                type="text"
                                value={value}
                                onChange={(e) => handleColorChange(key as keyof ColorScheme, e.target.value)}
                                className="flex-1 px-1 sm:px-2 py-1 text-xs border border-hi-silver rounded focus:outline-none focus:ring-2 text-black"
                                style={{ '--tw-ring-color': colors.primary } as React.CSSProperties}
                            />
                        </div>
                        <div
                            className="w-full h-3 sm:h-4 rounded border border-hi-silver"
                            style={{ backgroundColor: value }}
                        />
                    </div>
                ))}
            </div>

            {/* Hi-catering Color Palette */}
            <div className="mt-4 sm:mt-6">
                <h4 className="text-xs sm:text-sm font-medium text-hi-graphite mb-2 sm:mb-3">Hi-catering Цветовая палитра</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4 w-full">
                    {Object.entries(hiColors).map(([key, value]) => (
                        <div key={key} className="space-y-2">
                            <label className="block text-xs sm:text-sm font-medium text-hi-graphite capitalize">
                                {key === 'platinum' ? 'Platinum' :
                                    key === 'red' ? 'Red' :
                                        key === 'green' ? 'Green' :
                                            key === 'white' ? 'White' :
                                                key === 'graphite' ? 'Graphite' :
                                                    key === 'ash' ? 'Ash' :
                                                        key === 'deep' ? 'Deep' :
                                                            key === 'silver' ? 'Silver' : key}
                            </label>
                            <div className="flex items-center space-x-1 sm:space-x-2">
                                <input
                                    type="color"
                                    value={value}
                                    onChange={(e) => handleHiColorChange(key as keyof HiColorScheme, e.target.value)}
                                    className="w-6 h-6 sm:w-8 sm:h-8 rounded border border-hi-silver cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={value}
                                    onChange={(e) => handleHiColorChange(key as keyof HiColorScheme, e.target.value)}
                                    className="flex-1 px-1 sm:px-2 py-1 text-xs border border-hi-silver rounded focus:outline-none focus:ring-2 text-black"
                                    style={{ '--tw-ring-color': colors.primary } as React.CSSProperties}
                                />
                            </div>
                            <div
                                className="w-full h-3 sm:h-4 rounded border border-hi-silver"
                                style={{ backgroundColor: value }}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Предпросмотр цветов */}
            <div className="p-3 sm:p-4 bg-hi-white rounded-lg border w-full mt-4 sm:mt-6">
                <h4 className="text-xs sm:text-sm font-medium text-hi-graphite mb-2 sm:mb-3">Предпросмотр</h4>
                <div className="space-y-2 sm:space-y-3">
                    <div className="flex flex-wrap gap-2">
                        <button
                            className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-white text-xs sm:text-sm font-medium"
                            style={{
                                background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`
                            }}
                        >
                            Основная кнопка
                        </button>
                        <button
                            className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium border"
                            style={{
                                color: colors.primary,
                                borderColor: colors.primary,
                                backgroundColor: colors.background
                            }}
                        >
                            Вторичная кнопка
                        </button>
                    </div>
                    <div
                        className="p-2 sm:p-3 rounded-lg"
                        style={{ backgroundColor: colors.background, color: colors.text }}
                    >
                        <p className="text-xs sm:text-sm">
                            Это пример текста с выбранными цветами.
                            <span style={{ color: colors.primary }}>Основной цвет</span> и
                            <span style={{ color: colors.accent }}> акцентный цвет</span>.
                        </p>
                    </div>
                </div>
            </div>

            {/* Генерация инструкций */}
            <div className="space-y-2 sm:space-y-3 mt-4 sm:mt-6">
                <button
                    onClick={generateInstructions}
                    className="w-full px-3 sm:px-4 py-2 text-white rounded-lg font-medium transition-all text-sm sm:text-base"
                    style={{
                        background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`
                    }}
                >
                    Сгенерировать инструкцию
                </button>

                {instructions && (
                    <div className="space-y-2 sm:space-y-3">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                            <h4 className="text-xs sm:text-sm font-medium text-hi-graphite mb-2 sm:mb-0">Инструкция для изменения цветов:</h4>
                            <button
                                onClick={copyInstructions}
                                className="flex items-center space-x-1 px-2 sm:px-3 py-1 bg-hi-silver text-hi-graphite rounded-lg text-xs sm:text-sm hover:bg-hi-silver transition-colors"
                            >
                                {copied ? (
                                    <>
                                        <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                                        <span>Скопировано</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                                        <span>Копировать</span>
                                    </>
                                )}
                            </button>
                        </div>
                        <pre className="p-3 sm:p-4 bg-hi-deep text-hi-white rounded-lg text-xs overflow-x-auto max-h-64 sm:max-h-96 w-full">
                            {instructions}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    );
}

// Вспомогательная функция для изменения яркости цвета
function adjustColorBrightness(color: string, factor: number): string {
    // Простая реализация для демонстрации
    // В реальном проекте лучше использовать библиотеку для работы с цветами
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    const newR = Math.max(0, Math.min(255, Math.round(r + (255 - r) * factor)));
    const newG = Math.max(0, Math.min(255, Math.round(g + (255 - g) * factor)));
    const newB = Math.max(0, Math.min(255, Math.round(b + (255 - b) * factor)));

    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
}
