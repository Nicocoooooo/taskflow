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
        <Card className="max-w-2xl mx-auto p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="pb-6 border-b border-gray-200">
                    <h2 className="text-2xl font-semibold text-gray-900">
                        {initialData ? 'Modifier l\'habitude' : 'Nouvelle habitude'}
                    </h2>
                </div>

                <div className="space-y-4">
                    {/* Nom */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nom de l'habitude
                        </label>
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                            placeholder="Ex: Méditation quotidienne"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                            rows={3}
                            placeholder="Description de votre habitude"
                        />
                    </div>

                    {/* Fréquence */}
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">
                            Fréquence
                        </label>
                        <div className="space-y-2">
                            {/* Radio buttons pour chaque type de fréquence */}
                            {(['daily', 'weekly', 'monthly', 'custom'] as FrequencyType[]).map((type) => (
                                <div key={type} className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        id={type}
                                        checked={formData.frequency.type === type}
                                        onChange={() => handleFrequencyChange(type)}
                                        className="rounded-full border-gray-300 text-violet-500 focus:ring-violet-500"
                                    />
                                    <label htmlFor={type} className="text-sm text-gray-700">
                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Options spécifiques selon le type de fréquence */}
                    {formData.frequency.type === 'weekly' && (
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Jours de la semaine
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {DAYS_OF_WEEK.map((day, index) => (
                                    <div key={day} className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id={`day-${index}`}
                                            checked={formData.frequency.weekly?.days[index] || false}
                                            onChange={() => handleDayToggle(index)}
                                            className="rounded border-gray-300 text-violet-500 focus:ring-violet-500"
                                        />
                                        <label htmlFor={`day-${index}`} className="text-sm text-gray-700">
                                            {day}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {formData.frequency.type === 'custom' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Intervalle (jours)
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
                                className="w-32 px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                            />
                        </div>
                    )}

                    {/* Heure de rappel */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Heure de rappel
                        </label>
                        <input
                            type="time"
                            value={formData.frequency.reminderTime}
                            onChange={(e) => handleReminderTimeChange(e.target.value)}
                            className="w-32 px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                    {onCancel && (
                        <Button type="button" variant="ghost" onClick={onCancel}>
                            Annuler
                        </Button>
                    )}
                    <Button type="submit" isLoading={isLoading}>
                        {initialData ? 'Mettre à jour' : 'Créer l\'habitude'}
                    </Button>
                </div>
            </form>
        </Card>
    );
};

export default HabitForm;