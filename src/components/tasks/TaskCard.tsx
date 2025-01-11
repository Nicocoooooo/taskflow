// src/components/tasks/TaskCard.tsx
import { Clock, Calendar, AlertCircle, Star } from 'lucide-react';
import { Task, TaskPriority, TaskStatus } from '../../features/tasks/types';

const priorityColors: Record<TaskPriority, { bg: string; text: string }> = {
    low: { bg: 'bg-green-100', text: 'text-green-800' },
    medium: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
    high: { bg: 'bg-orange-100', text: 'text-orange-800' },
    urgent: { bg: 'bg-red-100', text: 'text-red-800' }
};

const statusColors: Record<TaskStatus, string> = {
    todo: 'bg-amber-100',          // Plus visible que bg-yellow-50/50
    in_progress: 'bg-cyan-100',     // Plus visible que bg-blue-50/50
    done: 'bg-green-100'          // Plus visible que bg-emerald-50/50
};

interface TaskCardProps {
    task: Task;
    onClick?: () => void;
}

const TaskCard = ({ task, onClick }: TaskCardProps) => {
    const priorityStyle = priorityColors[task.priority];
    const statusStyle = statusColors[task.status];

    const formatTime = (minutes: number): string => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h${mins ? ` ${mins}m` : ''}`;
    };

    return (
        <div
            onClick={onClick}
            className={`${statusStyle} rounded-2xl border border-gray-200 p-4 hover:shadow-md transition-all hover:scale-[1.02] cursor-pointer`}
        >
            {/* En-tête avec priorité et indicateurs */}
            <div className="flex items-center justify-between mb-3">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${priorityStyle.bg} ${priorityStyle.text}`}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </div>
                <div className="flex gap-2">
                    {task.is_urgent && (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                    )}
                    {task.is_important && (
                        <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    )}
                </div>
            </div>

            {/* Titre de la tâche */}
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {task.name}
            </h3>

            {/* Catégorie */}
            {task.category && (
                <div
                    className="inline-block px-2 py-1 mb-2 text-sm rounded-full"
                    style={{
                        backgroundColor: `${task.category.color}20`,
                        color: task.category.color
                    }}
                >
                    {task.category.name}
                </div>
            )}

            {/* Description (si présente) */}
            {task.description && (
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {task.description}
                </p>
            )}

            {/* Informations complémentaires */}
            <div className="flex items-center gap-4 text-sm text-gray-500">
                {task.estimated_time && (
                    <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{formatTime(task.estimated_time)}</span>
                    </div>
                )}
                {task.due_date && (
                    <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(task.due_date).toLocaleDateString()}</span>
                    </div>
                )}
            </div>

            {/* Personnes assignées */}
            {task.people && task.people.length > 0 && (
                <div className="mt-3 flex -space-x-2">
                    {task.people.map((person) => (
                        <div
                            key={person.id}
                            className="w-8 h-8 rounded-full bg-violet-100 border-2 border-white flex items-center justify-center"
                            title={person.name}
                        >
                            <span className="text-sm font-medium text-violet-700">
                                {person.name.charAt(0)}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TaskCard;