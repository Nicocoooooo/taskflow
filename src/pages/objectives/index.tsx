import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../../components/common/Button';
import ObjectiveCard from '../../components/objectives/ObjectiveCard';
import ObjectiveForm from '../../components/objectives/ObjectiveForm';
import { Objective } from '../../features/objectives/types';
import { objectivesApi } from '../../features/objectives/api';

const ObjectivesPage = () => {
    const [objectives, setObjectives] = useState<Objective[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [editingObjective, setEditingObjective] = useState<Objective | undefined>(undefined);

    const fetchObjectives = async () => {
        try {
            const data = await objectivesApi.fetchAll();
            setObjectives(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchObjectives();
    }, []);

    const handleFormClose = () => {
        setShowForm(false);
        setEditingObjective(undefined);
    };

    const handleFormSubmit = () => {
        handleFormClose();
        fetchObjectives();
    };

    const handleEdit = (objective: Objective) => {
        setEditingObjective(objective);
        setShowForm(true);
    };

    const handleDelete = async (objectiveId: number) => {
        try {
            await objectivesApi.delete(objectiveId);
            await fetchObjectives();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        }
    };

    if (isLoading) {
        return <div className="p-6">Chargement...</div>;
    }

    if (error) {
        return <div className="p-6 text-red-600">{error}</div>;
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-semibold text-gray-900">Objectifs</h1>
                <Button onClick={() => setShowForm(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Nouvel objectif
                </Button>
            </div>

            {showForm && (
                <div className="mb-6">
                    <ObjectiveForm
                        objective={editingObjective}
                        onSubmit={handleFormSubmit}
                        onCancel={handleFormClose}
                    />
                </div>
            )}

            {objectives.length === 0 ? (
                <div className="text-center text-gray-500 mt-12">
                    Aucun objectif pour le moment.<br />
                    Commencez par en créer un !
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {objectives.map(objective => (
                        <ObjectiveCard
                            key={objective.id}
                            objective={objective}
                            onEdit={() => handleEdit(objective)}
                            onDelete={() => handleDelete(objective.id)}
                            onClick={() => handleEdit(objective)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ObjectivesPage;