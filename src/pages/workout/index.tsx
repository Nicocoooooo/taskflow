import React, { useState, useEffect } from 'react';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import WorkoutCard from '../../components/workout/WorkoutCard';
import WorkoutSessionForm from '../../components/workout/WorkoutSessionForm';
import Modal from '../../components/common/Modal';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchWorkoutSessions, createWorkoutSession } from '../../features/workout/api';
import { WorkoutSession, CreateWorkoutSessionDTO } from '../../features/workout/types';

const WorkoutIndexView: React.FC = () => {
    const navigate = useNavigate();
    const [sessions, setSessions] = useState<WorkoutSession[]>([]);
    const [loading, setLoading] = useState(true);
    const [showNewSessionModal, setShowNewSessionModal] = useState(false);

    const loadSessions = async () => {
        setLoading(true);
        try {
            const { data } = await fetchWorkoutSessions();
            if (data) {
                setSessions(data);
            }
        } catch (e) {
            console.error('Erreur lors du chargement des sessions:', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSessions();
    }, []);

    const handleNewSession = async (data: CreateWorkoutSessionDTO) => {
        try {
            const { data: newSession } = await createWorkoutSession(data);
            if (newSession) {
                setSessions(prev => [newSession, ...prev]);
                setShowNewSessionModal(false);
                navigate(`/workout/session/${newSession.id}`);
            }
        } catch (e) {
            console.error('Erreur lors de la création de la session:', e);
        }
    };

    if (loading) {
        return (
            <div className="h-full w-full flex items-center justify-center">
                <div className="text-gray-500">Chargement...</div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* En-tête */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-semibold text-gray-900">Séances de sport</h1>
                <div className="flex gap-4">
                    <Button
                        variant="secondary"
                        onClick={() => navigate('/workout/exercises')}
                    >
                        Gérer les exercices
                    </Button>
                    <Button onClick={() => setShowNewSessionModal(true)}>
                        <Plus className="h-5 w-5 mr-2" />
                        Nouvelle séance
                    </Button>
                </div>
            </div>

            {/* Liste des séances */}
            <div className="space-y-4">
                {sessions.length === 0 ? (
                    <Card>
                        <div className="text-center py-12">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Aucune séance enregistrée
                            </h3>
                            <p className="text-gray-500 mb-4">
                                Commencez par créer votre première séance d'entraînement
                            </p>
                            <Button onClick={() => setShowNewSessionModal(true)}>
                                <Plus className="h-5 w-5 mr-2" />
                                Créer une séance
                            </Button>
                        </div>
                    </Card>
                ) : (
                    sessions.map(session => (
                        <WorkoutCard
                            key={session.id}
                            session={session}
                            onView={() => navigate(`/workout/session/${session.id}`)}
                        />
                    ))
                )}
            </div>

            {/* Modal nouvelle séance */}
            <Modal
                isOpen={showNewSessionModal}
                onClose={() => setShowNewSessionModal(false)}
                title="Nouvelle séance"
            >
                <WorkoutSessionForm
                    onSubmit={handleNewSession}
                    onCancel={() => setShowNewSessionModal(false)}
                />
            </Modal>
        </div>
    );
};

export default WorkoutIndexView;