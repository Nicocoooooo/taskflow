import React from 'react';
import { cn } from '../../utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    children: React.ReactNode;
    variant?: 'default' | 'secondary' | 'success' | 'warning' | 'danger';
}

export const Badge: React.FC<BadgeProps> = ({
    children,
    variant = 'default',
    className,
    ...props
}) => {
    const variants = {
        default: 'bg-violet-100 text-violet-700',
        secondary: 'bg-gray-100 text-gray-700',
        success: 'bg-green-100 text-green-700',
        warning: 'bg-orange-100 text-orange-700',
        danger: 'bg-red-100 text-red-700',
    };

    return (
        <span
            className={cn(
                "inline-flex items-center px-3 py-1",
                "rounded-full text-sm font-medium",
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
};