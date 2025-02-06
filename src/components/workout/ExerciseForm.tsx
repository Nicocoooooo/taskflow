import React, { FormEvent } from 'react';
import { Button } from '../common/Button';
import { Exercise, ExerciseFormData } from '../../features/workout/types';

interface ExerciseFormProps {
    sessionId: number;
    exercise: Exercise;
    onSubmit: (data: ExerciseFormData) => void;
    onCancel: () => void;
}

const ExerciseForm: React.FC<ExerciseFormProps> = ({ exercise, onSubmit, onCancel }) => {
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const exerciseData: ExerciseFormData = {
            weight: Number(formData.get('weight')),
            sets: Number(formData.get('sets')),
            reps: Number(formData.get('reps')),
            completion_rate: Number(formData.get('completion_rate')),
            notes: formData.get('notes') as string ?? ''
        };

        onSubmit(exerciseData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-violet-50 rounded-xl p-4 mb-6">
                <h3 className="text-lg font-semibold text-violet-900 mb-2">
                    {exercise.name}
                </h3>
                {exercise.description && (
                    <p className="text-sm text-violet-700 mb-2">{exercise.description}</p>
                )}
                <div className="flex flex-wrap gap-2">
                    {exercise.target_muscles.map((muscle, index) => (
                        <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-800"
                        >
                            {muscle}
                        </span>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {/* Poids */}
                <div>
                    <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                        Poids (kg) *
                    </label>
                    <input
                        type="number"
                        name="weight"
                        id="weight"
                        required
                        min="0"
                        step="0.5"
                        className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500"
                    />
                </div>

                {/* Séries */}
                <div>
                    <label htmlFor="sets" className="block text-sm font-medium text-gray-700">
                        Séries *
                    </label>
                    <input
                        type="number"
                        name="sets"
                        id="sets"
                        required
                        min="1"
                        className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500"
                    />
                </div>
            </div>

            {/* Répétitions */}
            <div>
                <label htmlFor="reps" className="block text-sm font-medium text-gray-700">
                    Répétitions par série *
                </label>
                <input
                    type="number"
                    name="reps"
                    id="reps"
                    required
                    min="1"
                    className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500"
                />
            </div>

            {/* Taux de réussite */}
            <div>
                <label htmlFor="completion_rate" className="block text-sm font-medium text-gray-700">
                    Taux de réussite (%) *
                </label>
                <input
                    type="range"
                    name="completion_rate"
                    id="completion_rate"
                    min="0"
                    max="100"
                    step="5"
                    defaultValue="100"
                    className="mt-1 block w-full"
                />
                <div className="mt-1 flex justify-between text-xs text-gray-500">
                    <span>0%</span>
                    <span>25%</span>
                    <span>50%</span>
                    <span>75%</span>
                    <span>100%</span>
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
                    placeholder="Commentaires sur l'exercice..."
                />
            </div>

            {/* Boutons d'action */}
            <div className="flex justify-end gap-4">
                <Button variant="ghost" onClick={onCancel}>
                    Annuler
                </Button>
                <Button type="submit">
                    Valider
                </Button>
            </div>
        </form>
    );
};

export default ExerciseForm;