import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Habit, HabitLog } from '../../features/habits/types';
import { ChevronRight, Flame, Award, Calendar, Bell, MoreVertical, Trash2 } from 'lucide-react';
import HabitCalendarModal from './HabitCalendarModal';

interface HabitCardProps {
    habit: Habit;
    onComplete: (id: number) => Promise<void>;
    onDelete: (id: number) => Promise<void>;
    isCompletedToday: boolean;
    habitLogs: HabitLog[];
}

const HabitCard: React.FC<HabitCardProps> = ({
    habit,
    onComplete,
    onDelete,
    isCompletedToday,
    habitLogs
}) => {
    const [showMenu, setShowMenu] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);

    const handleDelete = async () => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette habitude ?')) {
            try {
                await onDelete(habit.id);
            } catch (error) {
                console.error('Erreur lors de la suppression:', error);
            }
        }
    };

    return (
        <>
            <Card className="relative overflow-hidden hover:shadow-lg transition-shadow duration-200">
                <div className="p-6">
                    {/* En-tête avec menu */}
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900">{habit.name}</h3>
                            {habit.description && (
                                <p className="text-gray-600 mt-1 text-sm">{habit.description}</p>
                            )}
                        </div>
                        <div className="relative">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowMenu(!showMenu)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <MoreVertical className="w-4 h-4" />
                            </Button>

                            {showMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10 border">
                                    <button
                                        onClick={() => {
                                            setShowCalendar(true);
                                            setShowMenu(false);
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                    >
                                        <Calendar className="w-4 h-4" />
                                        Voir l'historique
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Supprimer l'habitude
                                    </button>
                                </div>
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

                    {/* Rappel */}
                    {habit.reminder_time && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                            <Bell className="w-4 h-4" />
                            <span>Rappel à {habit.reminder_time}</span>
                        </div>
                    )}

                    {/* Boutons d'action */}
                    <div className="grid grid-cols-4 gap-2">
                        {/* Bouton historique */}
                        <Button
                            variant="secondary"
                            onClick={() => setShowCalendar(true)}
                            className="col-span-1"
                        >
                            <Calendar className="w-4 h-4" />
                        </Button>

                        {/* Bouton de complétion */}
                        <Button
                            onClick={() => onComplete(habit.id)}
                            disabled={isCompletedToday}
                            className={`col-span-3 ${isCompletedToday
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

            {/* Modal du calendrier */}
            <HabitCalendarModal
                isOpen={showCalendar}
                onClose={() => setShowCalendar(false)}
                habitId={habit.id}
                habitName={habit.name}
                habitLogs={habitLogs}
            />
        </>
    );
};

export default HabitCard;