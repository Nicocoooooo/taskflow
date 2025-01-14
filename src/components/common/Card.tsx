import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
    children,
    className,
    ...props
}) => {
    return (
        <div
            className={cn(
                "relative bg-white rounded-3xl shadow-sm p-6 mb-4",
                "border border-gray-100",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};