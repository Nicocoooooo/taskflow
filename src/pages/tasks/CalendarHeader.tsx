import React from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import { fr } from 'date-fns/locale';

interface CalendarHeaderProps {
    currentDate: Date;
    onPreviousWeek: () => void;
    onNextWeek: () => void;
    onThisWeek: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
    currentDate,
    onPreviousWeek,
    onNextWeek,
    onThisWeek
}) => {
    const weekStart = startOfWeek(currentDate, { locale: fr });
    const weekEnd = endOfWeek(currentDate, { locale: fr });

    const formatDateRange = () => {
        if (weekStart.getMonth() === weekEnd.getMonth()) {
            return `${format(weekStart, 'd')} - ${format(weekEnd, 'd')} ${format(weekEnd, 'MMMM yyyy', { locale: fr })}`;
        }
        if (weekStart.getFullYear() === weekEnd.getFullYear()) {
            return `${format(weekStart, 'd MMMM', { locale: fr })} - ${format(weekEnd, 'd MMMM yyyy', { locale: fr })}`;
        }
        return `${format(weekStart, 'd MMMM yyyy', { locale: fr })} - ${format(weekEnd, 'd MMMM yyyy', { locale: fr })}`;
    };

    return (
        <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">
                {formatDateRange()}
            </h1>
            <div className="flex items-center gap-2">
                <button
                    onClick={onThisWeek}
                    className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium text-violet-600 hover:bg-violet-50 transition-colors"
                >
                    <Calendar className="h-4 w-4" />
                    Cette semaine
                </button>
                <div className="h-6 w-px bg-gray-200" /> {/* Séparateur vertical */}
                <button
                    onClick={onPreviousWeek}
                    className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                >
                    <ChevronLeft className="h-5 w-5 text-gray-600" />
                </button>
                <button
                    onClick={onNextWeek}
                    className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                >
                    <ChevronRight className="h-5 w-5 text-gray-600" />
                </button>
            </div>
        </div>
    );
};

export default CalendarHeader;