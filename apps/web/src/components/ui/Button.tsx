import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({
        className = '',
        variant = 'primary',
        size = 'md',
        loading = false,
        fullWidth = false,
        children,
        disabled,
        ...props
    }, ref) => {
        const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-[20px]';

        const variants = {
            primary: 'bg-hi-platinum text-hi-white shadow-hi hover:shadow-hi-hover focus:ring-hi-platinum',
            secondary: 'bg-hi-ash text-hi-graphite shadow-hi hover:bg-hi-silver focus:ring-hi-platinum',
            outline: 'border border-hi-silver bg-hi-white text-hi-graphite shadow-hi hover:bg-hi-ash focus:ring-hi-platinum',
            ghost: 'text-hi-graphite hover:bg-hi-ash focus:ring-hi-platinum',
            destructive: 'bg-hi-red text-hi-white shadow-hi hover:shadow-hi-hover focus:ring-hi-red'
        };

        const sizes = {
            sm: 'px-3 py-1.5 text-sm',
            md: 'px-4 py-2 text-sm',
            lg: 'px-6 py-3 text-base'
        };

        const widthClass = fullWidth ? 'w-full' : '';

        return (
            <button
                className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
                ref={ref}
                disabled={disabled || loading}
                {...props}
            >
                {loading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';

export { Button };
