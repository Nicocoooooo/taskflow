import React from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Habit } from '../../features/habits/types';
import { ChevronRight, Flame, Award, Calendar, Bell } from 'lucide-react';

interface HabitCardProps {
    habit: Habit;
    onComplete: (id: number) => Promise<void>;
    isCompletedToday: boolean;
}

const formatFrequency = (frequency: any): string => {
    switch (frequency.type) {
        case 'daily':
            return 'Tous les jours';
        case 'weekly':
            return 'Certains jours de la semaine';
        case 'monthly':
            return 'Certains jours du mois';
        case 'custom':
            return `Tous les ${frequency.custom?.intervalDays} jours`;
        default:
            return 'Fréquence non définie';
    }
};

const HabitCard: React.FC<HabitCardProps> = ({ habit, onComplete, isCompletedToday }) => {
    const handleComplete = async () => {
        if (!isCompletedToday) {
            try {
                await onComplete(habit.id);
            } catch (error) {
                console.error('Erreur lors de la completion de l\'habitude:', error);
            }
        }
    };

    return (
        <Card className="relative overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <div className="p-6">
                {/* En-tête avec stats */}
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900">{habit.name}</h3>
                        {habit.description && (
                            <p className="text-gray-600 mt-1 text-sm">{habit.description}</p>
                        )}
                    </div>
                </div>

                {/* Stats en ligne */}
                <div className="flex gap-6 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                        <Flame className="w-4 h-4 text-orange-500" />
                        <span className="flex gap-1">
                            <span className="font-medium">{habit.current_streak}</span>
                            <span className="text-gray-600">jours de suite</span>
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <Award className="w-4 h-4 text-violet-500" />
                        <span className="flex gap-1">
                            <span className="font-medium">{habit.best_streak}</span>
                            <span className="text-gray-600">record</span>
                        </span>
                    </div>
                </div>

                {/* Fréquence et rappel */}
                <div className="flex flex-col gap-2 text-sm text-gray-600 mb-6">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formatFrequency(habit.frequency)}</span>
                    </div>
                    {habit.reminder_time && (
                        <div className="flex items-center gap-2">
                            <Bell className="w-4 h-4" />
                            <span>Rappel à {habit.reminder_time}</span>
                        </div>
                    )}
                </div>

                {/* Bouton de complétion */}
                <Button
                    onClick={handleComplete}
                    disabled={isCompletedToday}
                    className={`w-full ${isCompletedToday
                            ? 'bg-green-100 text-green-700 hover:bg-green-100'
                            : 'bg-violet-600 text-white hover:bg-violet-700'
                        }`}
                >
                    {isCompletedToday ? (
                        <div className="flex items-center justify-center gap-2">
                            <span>Complété aujourd'hui</span>
                            <ChevronRight className="w-4 h-4" />
                        </div>
                    ) : (
                        'Marquer comme fait'
                    )}
                </Button>
            </div>

            {/* Badge streak */}
            {habit.current_streak > 0 && (
                <div className="absolute top-4 right-4">
                    <div className="bg-orange-500 text-white text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center">
                        {habit.current_streak}
                    </div>
                </div>
            )}
        </Card>
    );
};

export default HabitCard;