import React, { useState } from 'react';
import { Card } from '../common/Card';
import { HabitLog } from '../../features/habits/types';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';

interface HabitCalendarProps {
    habitId: number;
    habitLogs: HabitLog[];
}

const HabitCalendar: React.FC<HabitCalendarProps> = ({ habitLogs }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    // Générer les jours du mois
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // Vérifier si un jour donné a une complétion
    const isDayCompleted = (date: Date) => {
        return habitLogs.some(log =>
            !log.skipped && isSameDay(new Date(log.completed_at), date)
        );
    };

    return (
        <Card className="p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                    {format(currentMonth, 'MMMM yyyy', { locale: fr })}
                </h3>
                <div className="flex gap-2 w-full sm:w-auto">
                    <button
                        onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1))}
                        className="p-2 hover:bg-gray-100 rounded-lg flex-1 sm:flex-none"
                    >
                        ←
                    </button>
                    <button
                        onClick={() => setCurrentMonth(new Date())}
                        className="p-2 hover:bg-gray-100 rounded-lg text-sm flex-1 sm:flex-none"
                    >
                        Aujourd'hui
                    </button>
                    <button
                        onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1))}
                        className="p-2 hover:bg-gray-100 rounded-lg flex-1 sm:flex-none"
                    >
                        →
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1">
                {/* Noms des jours de la semaine */}
                {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
                    <div
                        key={day}
                        className="text-center text-xs sm:text-sm font-medium text-gray-500 py-1 sm:py-2"
                    >
                        {day}
                    </div>
                ))}

                {/* Cases vides pour aligner le premier jour */}
                {Array.from({ length: monthStart.getDay() === 0 ? 6 : monthStart.getDay() - 1 }).map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square" />
                ))}

                {/* Jours du mois */}
                {days.map(day => {
                    const isCompleted = isDayCompleted(day);
                    const isToday = isSameDay(day, new Date());

                    return (
                        <div
                            key={day.toISOString()}
                            className={`
                                aspect-square p-0.5 sm:p-1
                                ${isToday ? 'border-2 border-violet-500' : ''}
                                rounded-lg
                            `}
                        >
                            <div
                                className={`
                                    w-full h-full rounded-lg flex items-center justify-center
                                    text-xs sm:text-sm
                                    ${isCompleted ? 'bg-violet-500 text-white' : 'hover:bg-gray-50'}
                                    ${isToday && !isCompleted ? 'text-violet-500 font-medium' : ''}
                                `}
                            >
                                {format(day, 'd')}
                            </div>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
};

export default HabitCalendar;