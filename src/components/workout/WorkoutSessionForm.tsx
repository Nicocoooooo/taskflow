import React, { FormEvent, useState, useEffect } from 'react';
import { Button } from '../common/Button';
import { WorkoutType, CreateWorkoutSessionDTO } from '../../features/workout/types';
import { fetchWorkoutTypes } from '../../features/workout/api';

interface WorkoutSessionFormProps {
    onSubmit: (data: CreateWorkoutSessionDTO) => void;
    onCancel: () => void;
}

const WorkoutSessionForm: React.FC<WorkoutSessionFormProps> = ({ onSubmit, onCancel }) => {
    const [workoutTypes, setWorkoutTypes] = useState<WorkoutType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadWorkoutTypes = async () => {
            const { data } = await fetchWorkoutTypes();
            setWorkoutTypes(data || []);
            setLoading(false);
        };
        loadWorkoutTypes();
    }, []);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const sessionData: CreateWorkoutSessionDTO = {
            workout_type_id: Number(formData.get('workout_type_id')),
            date: new Date(formData.get('date') as string),
            overall_feeling: Number(formData.get('overall_feeling')),
            notes: formData.get('notes') as string
        };

        onSubmit(sessionData);
    };

    if (loading) {
        return <div>Chargement...</div>;
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Type de séance */}
            <div>
                <label htmlFor="workout_type_id" className="block text-sm font-medium text-gray-700">
                    Type de séance *
                </label>
                <select
                    name="workout_type_id"
                    id="workout_type_id"
                    required
                    className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500"
                >
                    {workoutTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                            {type.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Date */}
            <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                    Date *
                </label>
                <input
                    type="datetime-local"
                    name="date"
                    id="date"
                    required
                    defaultValue={new Date().toISOString().slice(0, 16)}
                    className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500"
                />
            </div>

            {/* Ressenti général */}
            <div>
                <label htmlFor="overall_feeling" className="block text-sm font-medium text-gray-700">
                    Ressenti général *
                </label>
                <div className="mt-1 flex justify-between items-center bg-gray-50 rounded-xl p-4">
                    {[1, 2, 3, 4, 5].map((value) => (
                        <label key={value} className="cursor-pointer flex flex-col items-center">
                            <input
                                type="radio"
                                name="overall_feeling"
                                value={value}
                                className="sr-only"
                                defaultChecked={value === 3}
                            />
                            <span className="text-2xl mb-1">
                                {['😫', '😕', '😐', '🙂', '🤩'][value - 1]}
                            </span>
                            <span className="text-sm text-gray-600">
                                {['Très faible', 'Faible', 'Moyen', 'Bon', 'Excellent'][value - 1]}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Notes */}
            <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                    Notes
                </label>
                <textarea
                    name="notes"
                    id="notes"
                    rows={3}
                    className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500"
                    placeholder="Commentaires sur la séance..."
                />
            </div>

            {/* Boutons d'action */}
            <div className="flex justify-end gap-4">
                <Button variant="ghost" onClick={onCancel}>
                    Annuler
                </Button>
                <Button type="submit">
                    Commencer la séance
                </Button>
            </div>
        </form>
    );
};

export default WorkoutSessionForm;