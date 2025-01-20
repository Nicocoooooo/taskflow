import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { cn, type ColorVariant } from '../../utils/cn';

interface StatCardProps {
    title: string;
    value: string | number;
    description?: string;
    trend?: number;
    sparklineData?: Array<{ value: number }>;
    icon?: React.ComponentType<any>;
    variant?: ColorVariant;
    className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    description,
    trend,
    sparklineData,
    icon: Icon,
    variant = 'default',
    className
}) => {
    const variantStyles = {
        default: 'bg-violet-50 border-violet-200',
        primary: 'bg-violet-50 border-violet-200',
        success: 'bg-emerald-50 border-emerald-200',
        warning: 'bg-amber-50 border-amber-200',
        danger: 'bg-red-50 border-red-200'
    };

    const valueStyles = {
        default: 'text-violet-800',
        primary: 'text-violet-800',
        success: 'text-emerald-800',
        warning: 'text-amber-800',
        danger: 'text-red-800'
    };

    const trendStyles = {
        positive: 'text-emerald-600 bg-emerald-100',
        negative: 'text-red-600 bg-red-100',
        neutral: 'text-gray-600 bg-gray-100'
    };

    const getTrendStyle = (trendValue?: number) => {
        if (!trendValue) return trendStyles.neutral;
        return trendValue > 0 ? trendStyles.positive : trendStyles.negative;
    };

    return (
        <div className={cn(
            'rounded-3xl p-6 border shadow-sm',
            variantStyles[variant],
            className
        )}>
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-gray-600 text-sm font-medium mb-1">
                        {title}
                    </h3>
                    <div className="flex items-baseline gap-2">
                        <p className={cn("text-2xl font-bold", valueStyles[variant])}>
                            {value}
                        </p>
                        {trend !== undefined && (
                            <div className={cn(
                                "px-2 py-1 rounded-full text-sm font-medium flex items-center gap-1",
                                getTrendStyle(trend)
                            )}>
                                {trend > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                                {Math.abs(trend)}%
                            </div>
                        )}
                    </div>
                </div>
                {Icon && (
                    <div className={cn(
                        "p-3 rounded-2xl",
                        variantStyles[variant]
                    )}>
                        <Icon className={valueStyles[variant]} size={24} />
                    </div>
                )}
            </div>

            {sparklineData && (
                <div className="h-12 mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={sparklineData}>
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke={variant === 'default' ? '#8B5CF6' : '#10B981'}
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}

            {description && (
                <p className="text-gray-500 text-sm mt-2">
                    {description}
                </p>
            )}
        </div>
    );
};

export default StatCard;