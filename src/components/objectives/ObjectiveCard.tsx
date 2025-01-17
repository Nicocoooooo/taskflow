import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
    Calendar,
    CheckCircle2,
    Target,
    Clock,
    AlertCircle,
    BarChart2
} from 'lucide-react';
import { Card } from '../common/Card';
import { ObjectiveStatus, ObjectiveType } from '../../features/objectives/types';
import { EnhancedObjective } from '../../features/objectives/enhanced-types';
import { Badge, BadgeProps } from '../common/Badge';

interface ObjectiveCardProps {
    objective: EnhancedObjective;
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
    onClick,
}) => {
    const {
        title,
        description,
        due_date,
        type,
        status,
        progress,
        steps = [],
        smart_specific,
        smart_measurable,
        smart_achievable,
        smart_realistic,
        target_value,
        current_value,
        measurement_unit,
        priority,
        domain
    } = objective;

    const completedSteps = steps.filter(step => step.is_completed).length;
    const totalSteps = steps.length;

    // Calcul du pourcentage de progression de la valeur cible
    const targetProgress = target_value && target_value > 0
        ? Math.round(((current_value || 0) / target_value) * 100)
        : 0;

    return (
        <Card
            className="hover:scale-[1.02] transition-all duration-200 cursor-pointer group"
            onClick={onClick}
        >
            <div className="flex flex-col gap-4">
                {/* En-tête avec badges */}
                <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
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
                        <Badge
                            variant="default"
                            className="flex items-center gap-1"
                        >
                            <Target className="w-4 h-4" />
                            Priorité {priority}
                        </Badge>
                        {domain && (
                            <Badge
                                variant="default"
                                className="flex items-center gap-1"
                                style={{ backgroundColor: `${domain.color}20`, color: domain.color }}
                            >
                                {domain.name}
                            </Badge>
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

                {/* Informations SMART */}
                {(smart_specific || target_value || smart_achievable || smart_realistic) && (
                    <div className="space-y-3 p-3 bg-gray-50 rounded-xl">
                        {smart_specific && (
                            <div className="space-y-1">
                                <h4 className="text-sm font-medium text-gray-700">Objectif spécifique</h4>
                                <p className="text-sm text-gray-600 line-clamp-2">{smart_specific}</p>
                            </div>
                        )}

                        {/* Mesures et progression */}
                        {typeof target_value === 'number' && target_value > 0 && (
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <BarChart2 className="w-4 h-4" />
                                        <span>
                                            {current_value ?? 0} / {target_value} {measurement_unit}
                                        </span>
                                    </div>
                                    <span className="font-medium">
                                        {targetProgress}%
                                    </span>
                                </div>
                                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-violet-600"
                                        style={{ width: `${targetProgress}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Critères SMART supplémentaires */}
                        {(smart_measurable || smart_achievable || smart_realistic) && (
                            <div className="pt-2 mt-2 border-t border-gray-200 grid grid-cols-2 gap-4">
                                {smart_measurable && (
                                    <div>
                                        <h5 className="text-xs font-medium text-gray-700 mb-1">Mesurable</h5>
                                        <p className="text-xs text-gray-600 line-clamp-2">{smart_measurable}</p>
                                    </div>
                                )}
                                {smart_achievable && (
                                    <div>
                                        <h5 className="text-xs font-medium text-gray-700 mb-1">Atteignable</h5>
                                        <p className="text-xs text-gray-600 line-clamp-2">{smart_achievable}</p>
                                    </div>
                                )}
                                {smart_realistic && (
                                    <div>
                                        <h5 className="text-xs font-medium text-gray-700 mb-1">Réaliste</h5>
                                        <p className="text-xs text-gray-600 line-clamp-2">{smart_realistic}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Informations et progression des étapes */}
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

                    {/* Barre de progression générale */}
                    <div>
                        <div className="flex justify-between text-sm mb-1.5">
                            <span className="text-gray-600 text-sm">Progression globale</span>
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