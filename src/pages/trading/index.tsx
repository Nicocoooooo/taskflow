// src/pages/trading/index.tsx
import { useState } from 'react';
import { Button } from '../../components/common/Button';
import { Plus, LineChart } from 'lucide-react';
import { useTrades } from '../../features/trading/hooks';
import TradeForm from '../../components/trading/TradeForm';
import CloseTradeForm from '../../components/trading/CloseTradeForm';
import PerformanceChart from '../../components/trading/PerformanceChart';
import { Trade, TradeFormData } from '../../features/trading/types';

const TradingDashboard = () => {
    const { trades, isLoading, error, addTrade, closeTrade } = useTrades();
    const [showForm, setShowForm] = useState(false);
    const [selectedTradeForClose, setSelectedTradeForClose] = useState<Trade | null>(null);

    const handleCreateTrade = async (tradeData: TradeFormData) => {
        try {
            await addTrade(tradeData);
            setShowForm(false);
        } catch (error) {
            console.error('Erreur lors de la création du trade:', error);
        }
    };

    const handleCloseTrade = async (tradeId: string, closeData: {
        exit_price: number;
        exit_date: Date;
        post_analysis: string;
        emotional_state?: string;
    }) => {
        try {
            await closeTrade(tradeId, closeData);
            setSelectedTradeForClose(null);
        } catch (error) {
            console.error('Erreur lors de la clôture du trade:', error);
        }
    };

    const openTrades = trades.filter(trade => trade.status === 'open');
    const closedTrades = trades.filter(trade => trade.status === 'closed');

    // Calcul des statistiques basiques
    const winningTrades = closedTrades.filter(trade => {
        const profit = trade.exit_price && trade.entry_price
            ? (trade.direction === 'LONG'
                ? trade.exit_price - trade.entry_price
                : trade.entry_price - trade.exit_price)
            : 0;
        return profit > 0;
    });

    const winRate = closedTrades.length > 0
        ? ((winningTrades.length / closedTrades.length) * 100).toFixed(1)
        : '0';

    if (isLoading) return <div className="p-4 sm:px-6 lg:px-8 pt-20">Chargement...</div>;
    if (error) return <div className="p-4 sm:px-6 lg:px-8 pt-20 text-red-500">Erreur: {error.message}</div>;

    return (
        <div className="p-4 sm:px-6 lg:px-8 pt-20">
            {/* En-tête */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Trading Dashboard</h1>
                <Button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Nouveau Trade
                </Button>
            </div>

            {/* Formulaire de création */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="max-w-2xl w-full">
                        <TradeForm
                            onSubmit={handleCreateTrade}
                            onCancel={() => setShowForm(false)}
                        />
                    </div>
                </div>
            )}

            {/* Formulaire de clôture */}
            {selectedTradeForClose && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="max-w-2xl w-full">
                        <CloseTradeForm
                            trade={selectedTradeForClose}
                            onSubmit={handleCloseTrade}
                            onCancel={() => setSelectedTradeForClose(null)}
                        />
                    </div>
                </div>
            )}

            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-3xl shadow p-6">
                    <div className="text-sm text-gray-600">Trades en cours</div>
                    <div className="text-2xl font-semibold mt-2">{openTrades.length}</div>
                </div>

                <div className="bg-white rounded-3xl shadow p-6">
                    <div className="text-sm text-gray-600">Win Rate</div>
                    <div className="text-2xl font-semibold mt-2 text-emerald-600">{winRate}%</div>
                </div>

                <div className="bg-white rounded-3xl shadow p-6">
                    <div className="text-sm text-gray-600">Total Trades</div>
                    <div className="text-2xl font-semibold mt-2">{trades.length}</div>
                </div>
            </div>

            {/* Trades en cours */}
            <div className="bg-white rounded-3xl shadow mb-6">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-semibold">Trades en cours</h2>
                </div>
                <div className="p-6">
                    {openTrades.length === 0 ? (
                        <div className="text-gray-500 text-center py-4">
                            Aucun trade en cours
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="text-sm text-gray-600">
                                    <tr>
                                        <th className="text-left py-3">Paire</th>
                                        <th className="text-left py-3">Direction</th>
                                        <th className="text-left py-3">Prix d'entrée</th>
                                        <th className="text-left py-3">Stop Loss</th>
                                        <th className="text-left py-3">Take Profit</th>
                                        <th className="text-left py-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {openTrades.map((trade) => (
                                        <tr key={trade.id} className="border-t border-gray-100">
                                            <td className="py-4">{trade.pair}</td>
                                            <td className={`py-4 ${trade.direction === 'LONG' ? 'text-emerald-600' : 'text-red-600'
                                                }`}>
                                                {trade.direction}
                                            </td>
                                            <td className="py-4">{trade.entry_price}</td>
                                            <td className="py-4">{trade.stop_loss}</td>
                                            <td className="py-4">{trade.take_profit}</td>
                                            <td className="py-4">
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() => setSelectedTradeForClose(trade)}
                                                >
                                                    Clôturer
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Graphique des performances */}
            <div className="bg-white rounded-3xl shadow">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Performances</h2>
                    <Button variant="secondary" size="sm" className="flex items-center gap-2">
                        <LineChart className="w-4 h-4" />
                        Voir les statistiques
                    </Button>
                </div>
                <div className="p-6 h-64">
                    <PerformanceChart trades={trades} />
                </div>
            </div>
        </div>
    );
};

export default TradingDashboard;