import React from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { WorkoutSession } from '../../features/workout/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Activity } from 'lucide-react';

interface WorkoutCardProps {
    session: WorkoutSession;
    onView?: () => void;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({ session, onView }) => {
    // Calcul du taux de complétion moyen
    const averageCompletion =
        (session.exercises?.reduce((acc, ex) => acc + ex.completion_rate, 0) ?? 0) /
        (session.exercises?.length ?? 1);

    // Nombre d'exercices complétés à 100%
    const perfectExercises = session.exercises?.filter(ex => ex.completion_rate === 100).length ?? 0;

    return (
        <Card className="relative">
            {/* En-tête */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: session.workout_type?.color || '#8B5CF6' }}
                    >
                        <Activity className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            {session.workout_type?.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                            {format(session.date, 'EEEE d MMMM yyyy', { locale: fr })}
                        </p>
                    </div>
                </div>
                <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span
                            key={star}
                            className={`h-4 w-4 ${star <= session.overall_feeling ? 'text-yellow-400' : 'text-gray-300'}`}
                        >
                            ★
                        </span>
                    ))}
                </div>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-violet-50 rounded-xl p-3">
                    <p className="text-sm text-violet-600 font-medium">Exercices</p>
                    <p className="text-2xl font-semibold text-violet-900">
                        {session.exercises?.length ?? 0}
                    </p>
                </div>
                <div className="bg-emerald-50 rounded-xl p-3">
                    <p className="text-sm text-emerald-600 font-medium">Complétion</p>
                    <p className="text-2xl font-semibold text-emerald-900">
                        {averageCompletion.toFixed(0)}%
                    </p>
                </div>
                <div className="bg-orange-50 rounded-xl p-3">
                    <p className="text-sm text-orange-600 font-medium">PR</p>
                    <p className="text-2xl font-semibold text-orange-900">
                        {perfectExercises}
                    </p>
                </div>
            </div>

            {/* Notes */}
            {session.notes && (
                <div className="mb-4">
                    <p className="text-sm text-gray-500">{session.notes}</p>
                </div>
            )}

            {/* Actions */}
            <div className="flex justify-end">
                <Button variant="secondary" onClick={onView}>
                    Voir les détails
                </Button>
            </div>
        </Card>
    );
};

export default WorkoutCard;