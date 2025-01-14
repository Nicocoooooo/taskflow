import React from 'react';
import { format } from 'date-fns';
import { ChevronRight, Calendar, CheckCircle2, MoreVertical, Trash } from 'lucide-react';
import { Objective, ObjectiveStatus } from '../../features/objectives/types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

interface ObjectiveCardProps {
    objective: Objective;
    onEdit?: () => void;
    onDelete?: () => void;
    onClick?: () => void;
}

const getStatusColor = (status: ObjectiveStatus) => {
    switch (status) {
        case 'not_started':
            return 'bg-gray-100 text-gray-700';
        case 'in_progress':
            return 'bg-blue-100 text-blue-700';
        case 'completed':
            return 'bg-green-100 text-green-700';
    }
};

const getTypeColor = (type: string) => {
    switch (type) {
        case 'short_term':
            return 'bg-violet-100 text-violet-700';
        case 'medium_term':
            return 'bg-orange-100 text-orange-700';
        case 'long_term':
            return 'bg-indigo-100 text-indigo-700';
    }
};

const ObjectiveCard: React.FC<ObjectiveCardProps> = ({
    objective,
    onEdit,
    onDelete,
    onClick
}) => {
    const {
        title,
        description,
        due_date,
        type,
        status,
        progress,
        steps = []
    } = objective;

    const completedSteps = steps.filter(step => step.is_completed).length;
    const totalSteps = steps.length;

    return (
        <Card
            className="hover:scale-[1.02] transition-transform duration-200 cursor-pointer"
            onClick={onClick}
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <Badge className={getTypeColor(type)}>
                            {type.replace('_', ' ')}
                        </Badge>
                        <Badge className={getStatusColor(status)}>
                            {status.replace('_', ' ')}
                        </Badge>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {title}
                    </h3>

                    {description && (
                        <p className="text-gray-600 mb-4 line-clamp-2">
                            {description}
                        </p>
                    )}

                    {due_date && (
                        <div className="flex items-center gap-2 text-gray-500 mb-4">
                            <Calendar size={16} />
                            <span>{format(new Date(due_date), 'dd MMM yyyy')}</span>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {onEdit && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit();
                            }}
                        >
                            <MoreVertical size={16} />
                        </Button>
                    )}
                    {onDelete && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete();
                            }}
                        >
                            <Trash size={16} />
                        </Button>
                    )}
                </div>
            </div>

            <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle2 size={16} />
                        <span>{completedSteps} / {totalSteps} étapes</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                        {progress}%
                    </span>
                </div>

                {/* Barre de progression */}
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-violet-600 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Flèche indiquant que la carte est cliquable */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                <ChevronRight size={20} />
            </div>
        </Card>
    );
};

export default ObjectiveCard;