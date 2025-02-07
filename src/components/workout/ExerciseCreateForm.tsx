import React, { FormEvent, useState, useEffect } from 'react';
import { Button } from '../common/Button';
import { Exercise, WorkoutType } from '../../features/workout/types';
import { fetchWorkoutTypes } from '../../features/workout/api';
import { X, Plus } from 'lucide-react';

interface ExerciseCreateFormProps {
    exercise: Exercise | null; // Changez de Exercise | undefined à Exercise | null
    onSubmit: (data: Omit<Exercise, 'id' | 'created_at'>) => void;
    onCancel: () => void;
}

const ExerciseCreateForm: React.FC<ExerciseCreateFormProps> = ({
    exercise,
    onSubmit,
    onCancel
}) => {
    const [workoutTypes, setWorkoutTypes] = useState<WorkoutType[]>([]);
    const [loading, setLoading] = useState(true);
    const [muscles, setMuscles] = useState<string[]>(exercise?.target_muscles || []);
    const [newMuscle, setNewMuscle] = useState('');

    useEffect(() => {
        loadWorkoutTypes();
    }, []);

    const loadWorkoutTypes = async () => {
        const { data } = await fetchWorkoutTypes();
        if (data) {
            setWorkoutTypes(data);
        }
        setLoading(false);
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const exerciseData = {
            name: formData.get('name') as string,
            description: formData.get('description') as string,
            workout_type_id: Number(formData.get('workout_type_id')),
            target_muscles: muscles,
            notes: formData.get('notes') as string,
            order_index: exercise?.order_index || 0
        };

        onSubmit(exerciseData);
    };

    const handleAddMuscle = () => {
        if (newMuscle.trim() && !muscles.includes(newMuscle.trim())) {
            setMuscles([...muscles, newMuscle.trim()]);
            setNewMuscle('');
        }
    };

    const handleRemoveMuscle = (muscleToRemove: string) => {
        setMuscles(muscles.filter(muscle => muscle !== muscleToRemove));
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
                    defaultValue={exercise?.workout_type_id}
                    className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500"
                >
                    {workoutTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                            {type.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Nom */}
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Nom de l'exercice *
                </label>
                <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    defaultValue={exercise?.name}
                    className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500"
                    placeholder="Ex: Développé couché"
                />
            </div>

            {/* Description */}
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                </label>
                <textarea
                    name="description"
                    id="description"
                    rows={3}
                    defaultValue={exercise?.description || ''}
                    className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500"
                    placeholder="Description de l'exercice et conseils d'exécution..."
                />
            </div>

            {/* Muscles ciblés */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Muscles ciblés
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                    {muscles.map((muscle, index) => (
                        <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-violet-100 text-violet-800"
                        >
                            {muscle}
                            <button
                                type="button"
                                onClick={() => handleRemoveMuscle(muscle)}
                                className="ml-2 focus:outline-none"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </span>
                    ))}
                </div>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newMuscle}
                        onChange={(e) => setNewMuscle(e.target.value)}
                        className="flex-1 rounded-xl border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500"
                        placeholder="Ex: Pectoraux"
                    />
                    <Button
                        type="button"
                        onClick={handleAddMuscle}
                        disabled={!newMuscle.trim()}
                    >
                        <Plus className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            {/* Notes */}
            <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                    Notes additionnelles
                </label>
                <textarea
                    name="notes"
                    id="notes"
                    rows={2}
                    defaultValue={exercise?.notes || ''}
                    className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500"
                    placeholder="Notes ou commentaires supplémentaires..."
                />
            </div>

            {/* Boutons d'action */}
            <div className="flex justify-end gap-4">
                <Button variant="ghost" onClick={onCancel}>
                    Annuler
                </Button>
                <Button type="submit">
                    {exercise ? "Modifier" : "Créer"} l'exercice
                </Button>
            </div>
        </form>
    );
};

export default ExerciseCreateForm;