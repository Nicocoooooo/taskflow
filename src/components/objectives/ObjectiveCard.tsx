import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
    Calendar,
    CheckCircle2,
    MoreVertical,
    Trash,
    Target,
    Clock,
    AlertCircle
} from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Objective, ObjectiveStatus, ObjectiveType } from '../../features/objectives/types';
import { Badge, BadgeProps } from '../common/Badge';

interface ObjectiveCardProps {
    objective: Objective;
    onEdit?: () => void;
    onDelete?: () => void;
    onClick?: () => void;
}

const getTypeVariant = (type: ObjectiveType): BadgeProps['variant'] => {
    switch (type) {
        case 'short_term':
            return 'warning';
        case 'medium_term':
            return 'secondary';
        case 'long_term':
            return 'default';
        default:
            return 'default';
    }
};

const getStatusVariant = (status: ObjectiveStatus): BadgeProps['variant'] => {
    switch (status) {
        case 'not_started':
            return 'warning';
        case 'in_progress':
            return 'secondary';
        case 'completed':
            return 'success';
        default:
            return 'default';
    }
};

const getTypeIcon = (type: ObjectiveType) => {
    switch (type) {
        case 'short_term':
            return <Clock className="w-4 h-4" />;
        case 'medium_term':
            return <Target className="w-4 h-4" />;
        case 'long_term':
            return <AlertCircle className="w-4 h-4" />;
        default:
            return null;
    }
};

const ObjectiveCard: React.FC<ObjectiveCardProps> = ({
    objective,
    onEdit,
    onDelete,
    onClick,
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
            className="hover:scale-[1.02] transition-all duration-200 cursor-pointer group"
            onClick={onClick}
        >
            <div className="flex flex-col gap-4">
                {/* En-tête avec badges */}
                <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                        <Badge
                            variant={getTypeVariant(type)}
                            className="capitalize flex items-center gap-1"
                        >
                            {getTypeIcon(type)}
                            {type.replace('_', ' ')}
                        </Badge>
                        <Badge
                            variant={getStatusVariant(status)}
                            className="capitalize"
                        >
                            {status.replace('_', ' ')}
                        </Badge>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {onEdit && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit();
                                }}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <MoreVertical className="w-4 h-4" />
                            </Button>
                        )}
                        {onDelete && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete();
                                }}
                                className="text-gray-500 hover:text-red-600"
                            >
                                <Trash className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                </div>

                {/* Corps */}
                <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-gray-900 line-clamp-1">
                        {title}
                    </h3>
                    {description && (
                        <p className="text-gray-600 line-clamp-2 text-sm">
                            {description}
                        </p>
                    )}
                </div>

                {/* Informations et progression */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                        {due_date && (
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>
                                    {format(new Date(due_date), 'dd MMM yyyy', { locale: fr })}
                                </span>
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>{completedSteps} / {totalSteps} étapes</span>
                        </div>
                    </div>

                    {/* Barre de progression */}
                    <div>
                        <div className="flex justify-between text-sm mb-1.5">
                            <span className="text-gray-600 text-sm">Progression</span>
                            <span className="font-medium text-gray-900">{progress}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all duration-300 ${progress === 100
                                    ? 'bg-green-500'
                                    : progress > 0
                                        ? 'bg-violet-600'
                                        : 'bg-gray-200'
                                    }`}
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default ObjectiveCard;