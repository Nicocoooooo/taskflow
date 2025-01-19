import React from 'react';
import { X } from 'lucide-react';
import { Card } from '../common/Card';
import HabitCalendar from './HabitCalendar';
import { HabitLog } from '../../features/habits/types';

interface HabitCalendarModalProps {
    isOpen: boolean;
    onClose: () => void;
    habitId: number;
    habitName: string;
    habitLogs: HabitLog[];
}

const HabitCalendarModal: React.FC<HabitCalendarModalProps> = ({
    isOpen,
    onClose,
    habitId,
    habitName,
    habitLogs
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="w-full max-w-2xl m-4">
                <Card className="relative">
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="p-6">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                            Historique - {habitName}
                        </h2>
                        <HabitCalendar habitId={habitId} habitLogs={habitLogs} />
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default HabitCalendarModal;