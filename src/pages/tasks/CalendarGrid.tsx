import React from 'react';
import { Task } from '../../features/tasks/types';
import MiniTaskCard from '../../components/tasks/MiniTaskCard';
import {
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    format,
    isToday,
    isSameDay,
} from 'date-fns';
import { fr } from 'date-fns/locale';

interface CalendarGridProps {
    currentDate: Date;
    tasks: Task[];
    onDateClick: (date: Date) => void;
    onTaskClick?: (task: Task) => void;
    onTaskDelete?: (task: Task) => void;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({
    currentDate,
    tasks,
    onDateClick,
    onTaskClick,
    onTaskDelete
}) => {
    const weekStart = startOfWeek(currentDate, { locale: fr });
    const weekEnd = endOfWeek(currentDate, { locale: fr });
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

    const getTasksForDate = (date: Date) => {
        return tasks.filter(task => {
            if (!task.due_date) return false;
            return isSameDay(new Date(task.due_date), date);
        });
    };

    const formatTime = (minutes: number): string => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h${mins ? ` ${mins}m` : ''}`;
    };

    const getTotalTimeForDate = (tasks: Task[]): number => {
        return tasks.reduce((total, task) => total + (task.estimated_time || 0), 0);
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-x-auto">
            <div className="min-w-[768px]">
                {/* En-tête des jours de la semaine */}
                <div className="grid grid-cols-7 border-b border-gray-200">
                    {days.map((day) => (
                        <div
                            key={day.toISOString()}
                            className="p-2 text-center border-r last:border-r-0 border-gray-200"
                        >
                            <div className="text-sm font-medium text-gray-500">
                                {format(day, 'EEE', { locale: fr })}
                            </div>
                            <div className={`text-lg sm:text-xl font-semibold ${isToday(day) ? 'text-violet-600' : 'text-gray-900'}`}>
                                {format(day, 'd')}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Grille des jours avec leurs tâches */}
                <div className="grid grid-cols-7 min-h-[500px] sm:min-h-[600px]">
                    {days.map((day) => {
                        const dayTasks = getTasksForDate(day);
                        const isCurrentDay = isToday(day);
                        const totalTime = getTotalTimeForDate(dayTasks);

                        return (
                            <div
                                key={day.toISOString()}
                                className={`
                                    p-2 border-r last:border-r-0 border-gray-200
                                    ${isCurrentDay ? 'bg-violet-50/50' : ''}
                                `}
                            >
                                {/* Zone drop */}
                                <div
                                    onClick={() => onDateClick(day)}
                                    className="min-h-[50px] rounded-lg border-2 border-dashed border-transparent hover:border-violet-200 transition-colors cursor-pointer"
                                />

                                {/* Temps total estimé */}
                                {totalTime > 0 && (
                                    <div className="mb-2 text-xs font-medium text-gray-500 flex items-center gap-1">
                                        <span className="inline-block w-2 h-2 bg-violet-200 rounded-full"></span>
                                        {formatTime(totalTime)}
                                    </div>
                                )}

                                {/* Liste des tâches */}
                                <div className="space-y-1.5">
                                    {dayTasks.map((task) => (
                                        <MiniTaskCard
                                            key={task.id}
                                            task={task}
                                            onClick={() => onTaskClick?.(task)}
                                            onDelete={onTaskDelete ? () => onTaskDelete(task) : undefined}
                                        />
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default CalendarGrid;