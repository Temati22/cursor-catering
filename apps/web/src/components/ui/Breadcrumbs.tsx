import Link from 'next/link';

export interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    className?: string;
}

export function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
    return (
        <div className={`bg-hi-ash ${className}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <nav className="flex items-center space-x-2 text-sm">
                    {items.map((item, index) => (
                        <div key={index} className="flex items-center">
                            {index > 0 && (
                                <span className="text-hi-silver mr-2">/</span>
                            )}
                            {item.href ? (
                                <Link
                                    href={item.href}
                                    className="text-hi-graphite hover:text-hi-green transition-colors"
                                >
                                    {item.label}
                                </Link>
                            ) : (
                                <span className="text-hi-graphite font-medium">
                                    {item.label}
                                </span>
                            )}
                        </div>
                    ))}
                </nav>
            </div>
        </div>
    );
}
