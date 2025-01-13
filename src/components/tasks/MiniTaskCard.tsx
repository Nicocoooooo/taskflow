import { AlertCircle, Star } from 'lucide-react';
import { Task, TaskPriority } from '../../features/tasks/types';

const priorityColors: Record<TaskPriority, { bg: string; text: string }> = {
    low: { bg: 'bg-green-100', text: 'text-green-800' },
    medium: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
    high: { bg: 'bg-orange-100', text: 'text-orange-800' },
    urgent: { bg: 'bg-red-100', text: 'text-red-800' }
};

interface MiniTaskCardProps {
    task: Task;
    onClick?: () => void;
}

const MiniTaskCard = ({ task, onClick }: MiniTaskCardProps) => {
    const priorityStyle = priorityColors[task.priority];

    return (
        <div
            onClick={onClick}
            className="bg-white rounded-xl border border-gray-200 p-2 hover:shadow-sm transition-all cursor-pointer mb-1 group"
        >
            <div className="flex items-center gap-2">
                {/* Indicateurs */}
                <div className="flex shrink-0 -space-x-1">
                    {task.is_urgent && (
                        <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                    {task.is_important && (
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    )}
                </div>

                {/* Titre avec ellipsis */}
                <div className="flex-grow min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate group-hover:text-violet-600">
                        {task.name}
                    </h4>
                </div>

                {/* Priorité */}
                <div className={`px-2 py-0.5 text-xs rounded-full shrink-0 ${priorityStyle.bg} ${priorityStyle.text}`}>
                    {task.priority.slice(0, 3)}
                </div>
            </div>

            {/* Seconde ligne optionnelle pour catégorie */}
            {task.category && (
                <div className="mt-1 flex items-center gap-2">
                    <div
                        className="text-xs px-2 py-0.5 rounded-full truncate"
                        style={{
                            backgroundColor: `${task.category.color}20`,
                            color: task.category.color
                        }}
                    >
                        {task.category.name}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MiniTaskCard;