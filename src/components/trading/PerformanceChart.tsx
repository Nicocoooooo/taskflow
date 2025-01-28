// src/components/trading/PerformanceChart.tsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Trade } from '../../features/trading/types';

interface PerformanceChartProps {
    trades: Trade[];
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ trades }) => {
    // Préparation des données pour le graphique
    const performanceData = trades
        .filter(trade => trade.status === 'closed' && trade.exit_price)
        .sort((a, b) => new Date(a.exit_date!).getTime() - new Date(b.exit_date!).getTime())
        .reduce((acc: { date: string; performance: number }[], trade) => {
            const profit = trade.direction === 'LONG'
                ? (trade.exit_price! - trade.entry_price) * trade.position_size
                : (trade.entry_price - trade.exit_price!) * trade.position_size;

            const lastPerformance = acc.length > 0 ? acc[acc.length - 1].performance : 0;
            const newPerformance = lastPerformance + profit;

            return [...acc, {
                date: new Date(trade.exit_date!).toLocaleDateString(),
                performance: Number(newPerformance.toFixed(2))
            }];
        }, []);

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart
                data={performanceData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                    dataKey="date"
                    stroke="#6B7280"
                    fontSize={12}
                />
                <YAxis
                    stroke="#6B7280"
                    fontSize={12}
                    tickFormatter={(value) => `${value}%`}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px'
                    }}
                    formatter={(value: number) => [`${value}%`, 'Performance']}
                />
                <Line
                    type="monotone"
                    dataKey="performance"
                    stroke="#8B5CF6"
                    strokeWidth={2}
                    dot={false}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default PerformanceChart;