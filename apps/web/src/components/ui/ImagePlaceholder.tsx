import { ImageIcon } from 'lucide-react';

interface ImagePlaceholderProps {
    className?: string;
    text?: string;
}

export function ImagePlaceholder({
    className = "h-48",
    text = "Нет изображения"
}: ImagePlaceholderProps) {
    return (
        <div className={`${className} bg-hi-ash flex items-center justify-center`}>
            <div className="text-center">
                <ImageIcon className="w-8 h-8 text-hi-silver mx-auto mb-2" />
                <span className="text-hi-graphite text-sm">{text}</span>
            </div>
        </div>
    );
}
