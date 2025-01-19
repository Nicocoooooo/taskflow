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
        <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                    {format(currentMonth, 'MMMM yyyy', { locale: fr })}
                </h3>
                <div className="flex gap-2">
                    <button
                        onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1))}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                        ←
                    </button>
                    <button
                        onClick={() => setCurrentMonth(new Date())}
                        className="p-2 hover:bg-gray-100 rounded-lg text-sm"
                    >
                        Aujourd'hui
                    </button>
                    <button
                        onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1))}
                        className="p-2 hover:bg-gray-100 rounded-lg"
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
                        className="text-center text-sm font-medium text-gray-500 py-2"
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
                aspect-square p-1
                ${isToday ? 'border-2 border-violet-500' : ''}
                rounded-lg
              `}
                        >
                            <div
                                className={`
                  w-full h-full rounded-lg flex items-center justify-center text-sm
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