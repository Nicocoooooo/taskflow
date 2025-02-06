import React, { useState, useEffect } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { fetchWorkoutTypes, fetchExercises } from '../../features/workout/api';
import { WorkoutType, Exercise } from '../../features/workout/types';

const ExercisesView: React.FC = () => {
    // États
    const [workoutTypes, setWorkoutTypes] = useState<WorkoutType[]>([]);
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [selectedType, setSelectedType] = useState<number | null>(null);
    const [showNewExerciseModal, setShowNewExerciseModal] = useState(false);
    const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
    const [loading, setLoading] = useState(true);

    // Chargement initial
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const [typesResponse, exercisesResponse] = await Promise.all([
            fetchWorkoutTypes(),
            fetchExercises()
        ]);

        if (typesResponse.data) setWorkoutTypes(typesResponse.data);
        if (exercisesResponse.data) setExercises(exercisesResponse.data);
        setLoading(false);
    };

    const filteredExercises = selectedType
        ? exercises.filter(ex => ex.workout_type_id === selectedType)
        : exercises;

    const handleNewExercise = () => {
        setSelectedExercise(null);
        setShowNewExerciseModal(true);
    };

    const handleEditExercise = (exercise: Exercise) => {
        setSelectedExercise(exercise);
        setShowNewExerciseModal(true);
    };

    if (loading) {
        return <div className="p-6">Chargement...</div>;
    }

    return (
        <div className="p-6">
            {/* En-tête */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-semibold text-gray-900">
                    Gestion des exercices
                </h1>
                <Button onClick={handleNewExercise}>
                    <Plus className="h-5 w-5 mr-2" />
                    Nouvel exercice
                </Button>
            </div>

            {/* Filtres */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                <Button
                    variant={selectedType === null ? 'primary' : 'ghost'}
                    onClick={() => setSelectedType(null)}
                >
                    Tous
                </Button>
                {workoutTypes.map(type => (
                    <Button
                        key={type.id}
                        variant={selectedType === type.id ? 'primary' : 'ghost'}
                        onClick={() => setSelectedType(type.id)}
                    >
                        {type.name}
                    </Button>
                ))}
            </div>

            {/* Liste des exercices */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredExercises.map(exercise => (
                    <Card key={exercise.id} className="hover:shadow-lg transition-shadow">
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {exercise.name}
                                </h3>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEditExercise(exercise)}
                                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <Edit2 className="h-4 w-4 text-gray-500" />
                                    </button>
                                    <button
                                        className="p-1 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </button>
                                </div>
                            </div>

                            {exercise.description && (
                                <p className="text-sm text-gray-600 mb-3">
                                    {exercise.description}
                                </p>
                            )}

                            {exercise.target_muscles && exercise.target_muscles.length > 0 && (
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
                            )}
                        </div>
                    </Card>
                ))}
            </div>

            {/* Modal pour ajouter/éditer un exercice */}
            <Modal
                isOpen={showNewExerciseModal}
                onClose={() => setShowNewExerciseModal(false)}
                title={selectedExercise ? "Modifier l'exercice" : "Nouvel exercice"}
            >
                {/* Form à implémenter */}
                <div className="p-4">
                    <p className="text-gray-500">Formulaire à implémenter</p>
                </div>
            </Modal>
        </div>
    );
};

export default ExercisesView;