import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import ExerciseForm from '../../components/workout/ExerciseForm';
import WorkoutProgress from '../../components/workout/WorkoutProgress';
import Modal from '../../components/common/Modal';
import { ChevronLeft, Plus } from 'lucide-react';
import {
    fetchWorkoutSession,
    addExerciseToSession,
    fetchExerciseProgress,
    fetchExercises
} from '../../features/workout/api';
import {
    WorkoutSession,
    Exercise,
    WorkoutExercise,
    CreateWorkoutExerciseDTO,
    ExerciseFormData // Ajoutez cette ligne
} from '../../features/workout/types';

const SessionView: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // États
    const [session, setSession] = useState<WorkoutSession | null>(null);
    const [loading, setLoading] = useState(true);
    const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);
    const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
    const [exerciseHistory, setExerciseHistory] = useState<WorkoutExercise[]>([]);

    // États des modales
    const [showExerciseSelectionModal, setShowExerciseSelectionModal] = useState(false);
    const [showExerciseModal, setShowExerciseModal] = useState(false);
    const [showProgressModal, setShowProgressModal] = useState(false);

    // Chargement initial
    useEffect(() => {
        if (id) {
            loadSession();
            loadAvailableExercises();
        }
    }, [id]);

    const loadSession = async () => {
        if (!id) return;

        setLoading(true);
        const { data, error } = await fetchWorkoutSession(Number(id));

        if (error) {
            console.error('Error loading session:', error);
            return;
        }

        if (data) {
            setSession(data);
        }

        setLoading(false);
    };

    const loadAvailableExercises = async () => {
        const { data, error } = await fetchExercises();

        if (error) {
            console.error('Error loading exercises:', error);
            return;
        }

        if (data) {
            setAvailableExercises(data);
        }
    };

    const handleExerciseSelection = (exercise: Exercise) => {
        setSelectedExercise(exercise);
        setShowExerciseSelectionModal(false);
        setShowExerciseModal(true);
    };

    const handleAddExercise = async (exerciseData: ExerciseFormData) => {
        if (!session || !selectedExercise) return;

        const fullExerciseData: CreateWorkoutExerciseDTO = {
            ...exerciseData,
            session_id: session.id,
            exercise_id: selectedExercise.id
        };

        const { data: newExercise, error } = await addExerciseToSession(fullExerciseData);

        if (error) {
            console.error('Error adding exercise:', error);
            return;
        }

        if (newExercise) {
            setSession(prev => prev ? {
                ...prev,
                exercises: [...(prev.exercises || []), newExercise]
            } : null);
            setShowExerciseModal(false);
            setSelectedExercise(null);
        }
    };

    const handleViewProgress = async (exercise: Exercise) => {
        const { data, error } = await fetchExerciseProgress(exercise.id);

        if (error) {
            console.error('Error fetching progress:', error);
            return;
        }

        if (data) {
            setExerciseHistory(data);
            setSelectedExercise(exercise);
            setShowProgressModal(true);
        }
    };

    if (loading) {
        return <div className="p-6">Chargement...</div>;
    }

    if (!session) {
        return <div className="p-6">Séance non trouvée</div>;
    }

    return (
        <div className="p-6">
            {/* En-tête */}
            <div className="flex items-center mb-6">
                <Button
                    variant="ghost"
                    onClick={() => navigate('/workout')}
                    className="mr-4"
                >
                    <ChevronLeft className="h-5 w-5 mr-1" />
                    Retour
                </Button>
                <h1 className="text-3xl font-semibold text-gray-900">
                    Séance {session.workout_type?.name}
                </h1>
            </div>

            {/* Exercices de la séance */}
            <div className="space-y-4">
                <Card>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Exercices</h2>
                        <Button onClick={() => setShowExerciseSelectionModal(true)}>
                            <Plus className="h-5 w-5 mr-2" />
                            Ajouter un exercice
                        </Button>
                    </div>

                    {session.exercises && session.exercises.length > 0 ? (
                        <div className="space-y-4">
                            {session.exercises.map((exerciseSession) => (
                                <div
                                    key={exerciseSession.id}
                                    className="p-4 bg-gray-50 rounded-xl"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-medium text-gray-900">
                                                {exerciseSession.exercise?.name}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {exerciseSession.weight}kg × {exerciseSession.sets} séries × {exerciseSession.reps} répétitions
                                            </p>
                                            {exerciseSession.notes && (
                                                <p className="text-sm text-gray-500 mt-1">
                                                    Note: {exerciseSession.notes}
                                                </p>
                                            )}
                                        </div>
                                        <Button
                                            variant="ghost"
                                            onClick={() => exerciseSession.exercise && handleViewProgress(exerciseSession.exercise)}
                                        >
                                            Voir la progression
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">Aucun exercice enregistré</p>
                    )}
                </Card>
            </div>

            {/* Modale de sélection d'exercice */}
            <Modal
                isOpen={showExerciseSelectionModal}
                onClose={() => setShowExerciseSelectionModal(false)}
                title="Sélectionner un exercice"
            >
                <div className="space-y-4">
                    {availableExercises.map(exercise => (
                        <div
                            key={exercise.id}
                            className="p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors"
                            onClick={() => handleExerciseSelection(exercise)}
                        >
                            <h3 className="font-medium text-gray-900">{exercise.name}</h3>
                            {exercise.description && (
                                <p className="text-sm text-gray-500">{exercise.description}</p>
                            )}
                            {exercise.target_muscles && exercise.target_muscles.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
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
                    ))}
                </div>
            </Modal>

            {/* Modale d'ajout d'exercice */}
            <Modal
                isOpen={showExerciseModal}
                onClose={() => {
                    setShowExerciseModal(false);
                    setSelectedExercise(null);
                }}
                title="Ajouter un exercice"
            >
                {selectedExercise && (
                    <ExerciseForm
                        sessionId={session.id}
                        exercise={selectedExercise}
                        onSubmit={handleAddExercise}
                        onCancel={() => {
                            setShowExerciseModal(false);
                            setSelectedExercise(null);
                        }}
                    />
                )}
            </Modal>

            {/* Modale de progression */}
            <Modal
                isOpen={showProgressModal}
                onClose={() => {
                    setShowProgressModal(false);
                    setSelectedExercise(null);
                }}
                title="Progression"
                size="lg"
            >
                {selectedExercise && (
                    <WorkoutProgress
                        exerciseHistory={exerciseHistory}
                        exerciseName={selectedExercise.name}
                    />
                )}
            </Modal>
        </div>
    );
};

export default SessionView;