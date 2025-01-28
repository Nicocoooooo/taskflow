// src/components/trading/TradeForm.tsx
import React from 'react';
import { Button } from '../common/Button';
import { Trade, TradeFormData } from '../../features/trading/types';
import { X } from 'lucide-react';

interface TradeFormProps {
    onSubmit: (data: TradeFormData) => Promise<void>;
    onCancel: () => void;
    initialData?: Partial<Trade>;
}

const TradeForm: React.FC<TradeFormProps> = ({ onSubmit, onCancel, initialData }) => {
    const [formData, setFormData] = React.useState<TradeFormData>({
        name: initialData?.name || '',
        pair: initialData?.pair || '',
        direction: initialData?.direction || 'LONG',
        entry_price: initialData?.entry_price || 0,
        stop_loss: initialData?.stop_loss || 0,
        take_profit: initialData?.take_profit || 0,
        position_size: initialData?.position_size || 0,
        entry_date: initialData?.entry_date || new Date(),
        pre_analysis: initialData?.pre_analysis || '',
        status: 'open'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await onSubmit(formData);
        } catch (error) {
            console.error('Erreur lors de la soumission:', error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="bg-white rounded-3xl shadow p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">
                    {initialData ? 'Modifier le trade' : 'Nouveau trade'}
                </h2>
                <button
                    onClick={onCancel}
                    className="text-gray-400 hover:text-gray-500"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Nom du trade */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nom
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-gray-300 px-3 py-2"
                        required
                    />
                </div>

                {/* Paire */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Paire
                    </label>
                    <input
                        type="text"
                        name="pair"
                        value={formData.pair}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-gray-300 px-3 py-2"
                        required
                    />
                </div>

                {/* Direction */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Direction
                    </label>
                    <select
                        name="direction"
                        value={formData.direction}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-gray-300 px-3 py-2"
                    >
                        <option value="LONG">LONG</option>
                        <option value="SHORT">SHORT</option>
                    </select>
                </div>

                {/* Prix d'entrée */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Prix d'entrée
                    </label>
                    <input
                        type="number"
                        step="0.00001"
                        name="entry_price"
                        value={formData.entry_price}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-gray-300 px-3 py-2"
                        required
                    />
                </div>

                {/* Stop Loss */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Stop Loss
                    </label>
                    <input
                        type="number"
                        step="0.00001"
                        name="stop_loss"
                        value={formData.stop_loss}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-gray-300 px-3 py-2"
                        required
                    />
                </div>

                {/* Take Profit */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Take Profit
                    </label>
                    <input
                        type="number"
                        step="0.00001"
                        name="take_profit"
                        value={formData.take_profit}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-gray-300 px-3 py-2"
                        required
                    />
                </div>

                {/* Taille de position */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Taille de position
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        name="position_size"
                        value={formData.position_size}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-gray-300 px-3 py-2"
                        required
                    />
                </div>

                {/* Analyse pré-trade */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Analyse pré-trade
                    </label>
                    <textarea
                        name="pre_analysis"
                        value={formData.pre_analysis}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-gray-300 px-3 py-2 min-h-[100px]"
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
                        {initialData ? 'Modifier' : 'Créer'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default TradeForm;