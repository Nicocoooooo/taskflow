import React from 'react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { cn, type ColorVariant } from '../../utils/cn';

// Types pour les différents formats de données
type TimelineData = Array<{
    date: string;
    value: number;
}>;

type CategoryData = Array<{
    name: string;
    value: number;
}>;

type ComparisonData = Array<{
    category: string;
    value: number;
}>;

interface StatChartProps {
    type: 'line' | 'bar' | 'pie';
    data: TimelineData | CategoryData | ComparisonData;
    title: string;
    description?: string;
    variant?: ColorVariant;
    className?: string;
    height?: number;
}

const StatChart: React.FC<StatChartProps> = ({
    type,
    data,
    title,
    description,
    variant = 'default',
    className,
    height = 300
}) => {
    // Couleurs selon la charte graphique
    const colors = {
        default: ['#8B5CF6', '#A78BFA', '#C4B5FD', '#DDD6FE'],
        primary: ['#8B5CF6', '#A78BFA', '#C4B5FD', '#DDD6FE'],
        success: ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0'],
        warning: ['#FB923C', '#FDBA74', '#FED7AA', '#FFEDD5'],
        danger: ['#EF4444', '#F87171', '#FCA5A5', '#FECACA']
    };

    const renderChart = () => {
        switch (type) {
            case 'line':
                return (
                    <ResponsiveContainer width="100%" height={height}>
                        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                            <XAxis
                                dataKey="date"
                                className="text-gray-600"
                                tick={{ fontSize: 12 }}
                            />
                            <YAxis
                                className="text-gray-600"
                                tick={{ fontSize: 12 }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#fff',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '0.5rem'
                                }}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke={colors[variant][0]}
                                strokeWidth={2}
                                dot={{ fill: colors[variant][0] }}
                                activeDot={{ r: 6, fill: colors[variant][0] }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                );

            case 'bar':
                return (
                    <ResponsiveContainer width="100%" height={height}>
                        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                            <XAxis
                                dataKey="category"
                                className="text-gray-600"
                                tick={{ fontSize: 12 }}
                            />
                            <YAxis
                                className="text-gray-600"
                                tick={{ fontSize: 12 }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#fff',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '0.5rem'
                                }}
                            />
                            <Legend />
                            <Bar
                                dataKey="value"
                                fill={colors[variant][0]}
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                );

            case 'pie':
                return (
                    <ResponsiveContainer width="100%" height={height}>
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({
                                    cx,
                                    cy,
                                    midAngle,
                                    innerRadius,
                                    outerRadius,
                                    percent,
                                    name
                                }) => {
                                    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                                    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

                                    return (
                                        <text
                                            x={x}
                                            y={y}
                                            fill="white"
                                            textAnchor={x > cx ? 'start' : 'end'}
                                            dominantBaseline="central"
                                            className="text-xs font-medium"
                                        >
                                            {`${name} ${(percent * 100).toFixed(0)}%`}
                                        </text>
                                    );
                                }}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {data.map((_entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={colors[variant][index % colors[variant].length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#fff',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '0.5rem'
                                }}
                            />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                );
        }
    };

    return (
        <div className={cn(
            'rounded-3xl p-6 border shadow-sm bg-white',
            className
        )}>
            <h3 className="text-gray-800 font-semibold mb-1">{title}</h3>
            {description && (
                <p className="text-gray-500 text-sm mb-4">{description}</p>
            )}
            {renderChart()}
        </div>
    );
};

export default StatChart;