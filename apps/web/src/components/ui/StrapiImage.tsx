'use client';

import Image from 'next/image';
import { useState } from 'react';

interface StrapiImageProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
    fill?: boolean;
    priority?: boolean;
    onError?: () => void;
}

export function StrapiImage({
    src,
    alt,
    width,
    height,
    className = "object-cover",
    fill = false,
    priority = false,
    onError
}: StrapiImageProps) {
    const [useFallback, setUseFallback] = useState(false);
    const [useLocalPlaceholder, setUseLocalPlaceholder] = useState(false);

    // Если нужно использовать локальный placeholder
    if (useLocalPlaceholder) {
        return (
            <img
                src="/placeholder.svg"
                alt={alt || "Placeholder image"}
                width={width}
                height={height}
                className={className}
            />
        );
    }

    // Если Next.js Image не работает, используем обычный img
    if (useFallback) {
        return (
            <img
                src={src}
                alt={alt}
                width={width}
                height={height}
                className={className}
                onError={(e) => {
                    console.warn('Error loading image, using local placeholder:', src);
                    setUseLocalPlaceholder(true);
                    onError?.();
                }}
            />
        );
    }

    return (
        <Image
            src={src}
            alt={alt}
            {...(fill ? { fill: true } : { width, height })}
            className={className}
            priority={priority}
            onError={() => {
                console.warn('Next.js Image failed, falling back to img tag');
                setUseFallback(true);
                onError?.();
            }}
        />
    );
}
