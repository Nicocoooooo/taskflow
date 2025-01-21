import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import {
    CreateHabitDto,
    FrequencyType,
    initialHabitFormState
} from '../../features/habits/types';

interface HabitFormProps {
    onSubmit: (habit: CreateHabitDto) => void;
    initialData?: CreateHabitDto;
    isLoading?: boolean;
    onCancel?: () => void;
}

const DAYS_OF_WEEK = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

export const HabitForm: React.FC<HabitFormProps> = ({
    onSubmit,
    initialData,
    isLoading = false,
    onCancel
}) => {
    const [formData, setFormData] = useState<CreateHabitDto>(
        initialData || initialHabitFormState
    );

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFrequencyChange = (newType: FrequencyType) => {
        setFormData((prev) => ({
            ...prev,
            frequency: {
                ...prev.frequency,
                type: newType,
                weekly: newType === 'weekly' ? { days: Array(7).fill(false) } : undefined,
                monthly: newType === 'monthly' ? { dates: [] } : undefined,
                custom: newType === 'custom' ? { intervalDays: 1 } : undefined,
            },
        }));
    };

    const handleDayToggle = (index: number) => {
        if (formData.frequency.type !== 'weekly') return;

        const currentDays = formData.frequency.weekly?.days || Array(7).fill(false);
        const newDays = [...currentDays];
        newDays[index] = !newDays[index];

        setFormData((prev) => ({
            ...prev,
            frequency: {
                ...prev.frequency,
                weekly: {
                    days: newDays
                }
            }
        }));
    };

    const handleReminderTimeChange = (time: string) => {
        setFormData((prev) => ({
            ...prev,
            frequency: {
                ...prev.frequency,
                reminderTime: time
            }
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Card className="max-w-2xl mx-auto p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* En-tête */}
                <div className="pb-4 sm:pb-6 border-b border-gray-200">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                        {initialData ? 'Modifier l\'habitude' : 'Nouvelle habitude'}
                    </h2>
                </div>

                <div className="space-y-4">
                    {/* Nom */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Nom de l'habitude *
                        </label>
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm"
                            placeholder="Ex: Méditation quotidienne"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm"
                            rows={3}
                            placeholder="Description de votre habitude"
                        />
                    </div>

                    {/* Fréquence */}
                    <div className="bg-gray-50 p-4 rounded-xl space-y-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Fréquence *
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                            {(['daily', 'weekly', 'monthly', 'custom'] as FrequencyType[]).map((type) => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => handleFrequencyChange(type)}
                                    className={`
                                        px-3 py-2 rounded-lg text-sm border transition-colors
                                        ${formData.frequency.type === type
                                            ? 'bg-violet-100 border-violet-200 text-violet-700'
                                            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                                        }
                                    `}
                                >
                                    {type === 'daily' && 'Quotidien'}
                                    {type === 'weekly' && 'Hebdomadaire'}
                                    {type === 'monthly' && 'Mensuel'}
                                    {type === 'custom' && 'Personnalisé'}
                                </button>
                            ))}
                        </div>

                        {/* Options spécifiques selon le type de fréquence */}
                        {formData.frequency.type === 'weekly' && (
                            <div className="pt-2 border-t border-gray-200 space-y-3">
                                <label className="block text-sm font-medium text-gray-700">
                                    Jours de la semaine *
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                                    {DAYS_OF_WEEK.map((day, index) => (
                                        <label
                                            key={day}
                                            className={`
                                                flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors
                                                ${formData.frequency.weekly?.days[index]
                                                    ? 'bg-violet-50 border-violet-200'
                                                    : 'bg-white border-gray-200 hover:bg-gray-50'
                                                }
                                            `}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={formData.frequency.weekly?.days[index] || false}
                                                onChange={() => handleDayToggle(index)}
                                                className="rounded border-gray-300 text-violet-500 focus:ring-violet-500"
                                            />
                                            <span className="text-sm">{day}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        {formData.frequency.type === 'custom' && (
                            <div className="pt-2 border-t border-gray-200">
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Intervalle (jours) *
                                </label>
                                <input
                                    type="number"
                                    min={1}
                                    value={formData.frequency.custom?.intervalDays || 1}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        frequency: {
                                            ...prev.frequency,
                                            custom: {
                                                intervalDays: parseInt(e.target.value)
                                            }
                                        }
                                    }))}
                                    className="w-full sm:w-32 px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm"
                                />
                            </div>
                        )}
                    </div>

                    {/* Heure de rappel */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Heure de rappel
                        </label>
                        <input
                            type="time"
                            value={formData.frequency.reminderTime}
                            onChange={(e) => handleReminderTimeChange(e.target.value)}
                            className="w-full sm:w-32 px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            Optionnel - Une notification vous sera envoyée à cette heure
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col-reverse sm:flex-row justify-end items-center gap-2 sm:gap-3 pt-4 sm:pt-6 border-t border-gray-200">
                    {onCancel && (
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onCancel}
                            className="w-full sm:w-auto"
                            disabled={isLoading}
                        >
                            Annuler
                        </Button>
                    )}
                    <Button
                        type="submit"
                        isLoading={isLoading}
                        className="w-full sm:w-auto"
                    >
                        {initialData ? 'Mettre à jour' : 'Créer l\'habitude'}
                    </Button>
                </div>
            </form>
        </Card>
    );
};

export default HabitForm;