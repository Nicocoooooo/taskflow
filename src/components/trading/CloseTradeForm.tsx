// src/components/trading/CloseTradeForm.tsx
import React from 'react';
import { Button } from '../common/Button';
import { Trade } from '../../features/trading/types';
import { X } from 'lucide-react';

interface CloseTradeFormProps {
    trade: Trade;
    onSubmit: (tradeId: string, data: {
        exit_price: number;
        exit_date: Date;
        post_analysis: string;
        emotional_state?: string;
    }) => Promise<void>;
    onCancel: () => void;
}

const CloseTradeForm: React.FC<CloseTradeFormProps> = ({ trade, onSubmit, onCancel }) => {
    const [formData, setFormData] = React.useState({
        exit_price: 0,
        exit_date: new Date(),
        post_analysis: '',
        emotional_state: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await onSubmit(trade.id, formData);
        } catch (error) {
            console.error('Erreur lors de la clôture:', error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const calculateProfit = () => {
        if (!formData.exit_price) return 0;
        const profit = trade.direction === 'LONG'
            ? formData.exit_price - trade.entry_price
            : trade.entry_price - formData.exit_price;
        return profit;
    };

    const profit = calculateProfit();
    const profitPercentage = ((profit / trade.entry_price) * 100).toFixed(2);

    return (
        <div className="bg-white rounded-3xl shadow p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">
                    Clôturer le trade : {trade.pair}
                </h2>
                <button
                    onClick={onCancel}
                    className="text-gray-400 hover:text-gray-500"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Prix de sortie */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Prix de sortie
                    </label>
                    <input
                        type="number"
                        step="0.00001"
                        name="exit_price"
                        value={formData.exit_price}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-gray-300 px-3 py-2"
                        required
                    />
                    {formData.exit_price > 0 && (
                        <div className={`text-sm mt-1 ${profit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                            P&L: {profit.toFixed(5)} ({profitPercentage}%)
                        </div>
                    )}
                </div>

                {/* Analyse post-trade */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Analyse post-trade
                    </label>
                    <textarea
                        name="post_analysis"
                        value={formData.post_analysis}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-gray-300 px-3 py-2 min-h-[100px]"
                        required
                        placeholder="Qu'avez-vous appris de ce trade ?"
                    />
                </div>

                {/* État émotionnel */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        État émotionnel
                    </label>
                    <input
                        type="text"
                        name="emotional_state"
                        value={formData.emotional_state}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-gray-300 px-3 py-2"
                        placeholder="Comment vous sentiez-vous pendant ce trade ?"
                    />
                </div>

                <div className="flex justify-end gap-4 pt-4">
                    <Button
                        type="button"
                        onClick={onCancel}
                        variant="secondary"
                    >
                        Annuler
                    </Button>
                    <Button type="submit">
                        Clôturer le trade
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CloseTradeForm;