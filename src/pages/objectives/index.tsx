import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../../components/common/Button';
import ObjectiveCard from '../../components/objectives/ObjectiveCard';
import EnhancedObjectiveForm from '../../components/objectives/EnhancedObjectiveForm';
import Modal from '../../components/common/Modal'; // Correction de l'import
import { objectivesApi } from '../../features/objectives/api';
import { CreateEnhancedObjectiveDto, EnhancedObjective, LifeDomain } from '../../features/objectives/enhanced-types';
import { lifeDomainsApi } from '../../features/life-domains/api';

const ObjectivesPage = () => {
    // États
    const [objectives, setObjectives] = useState<EnhancedObjective[]>([]);
    const [domains, setDomains] = useState<LifeDomain[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [editingObjective, setEditingObjective] = useState<EnhancedObjective | undefined>(undefined);
    const [objectiveToDelete, setObjectiveToDelete] = useState<EnhancedObjective | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Chargement des données
    const fetchObjectives = async () => {
        try {
            const data = await objectivesApi.fetchAll();
            setObjectives(data);
        } catch (err) {
            console.error("Erreur lors du chargement des objectifs");
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchDomains = async () => {
        try {
            const data = await lifeDomainsApi.fetchAll();
            setDomains(data);
        } catch (err) {
            console.error("Erreur lors du chargement des domaines");
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        }
    };

    useEffect(() => {
        fetchObjectives();
        fetchDomains();
    }, []);

    // Gestionnaires d'événements
    const handleFormClose = () => {
        setShowForm(false);
        setEditingObjective(undefined);
    };

    const handleFormSubmit = async (data: CreateEnhancedObjectiveDto) => {
        setIsSubmitting(true);
        try {
            if (editingObjective) {
                await objectivesApi.update(editingObjective.id, {
                    title: data.title,
                    description: data.description ?? undefined,
                    due_date: data.due_date ?? undefined,
                    domain_id: data.domain_id ?? undefined,
                    type: data.type,
                    smart_specific: data.smart_specific ?? undefined,
                    smart_measurable: data.smart_measurable ?? undefined,
                    smart_achievable: data.smart_achievable ?? undefined,
                    smart_realistic: data.smart_realistic ?? undefined,
                    target_value: data.target_value ?? undefined,
                    measurement_unit: data.measurement_unit ?? undefined,
                    priority: data.priority
                });
                console.log("Objectif mis à jour avec succès");
            } else {
                await objectivesApi.create(data);
                console.log("Objectif créé avec succès");
            }
            handleFormClose();
            fetchObjectives();
        } catch (err) {
            console.error(err instanceof Error ? err.message : 'Une erreur est survenue');
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (objective: EnhancedObjective) => {
        setEditingObjective(objective);
        setShowForm(true);
    };

    const handleDelete = async (objective: EnhancedObjective) => {
        setObjectiveToDelete(objective);
    };

    const handleDeleteConfirm = async () => {
        if (!objectiveToDelete) return;

        try {
            await objectivesApi.delete(objectiveToDelete.id);
            console.log("Objectif supprimé avec succès");
            setObjectiveToDelete(null);
            fetchObjectives();
        } catch (err) {
            console.error("Erreur lors de la suppression de l'objectif");
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        }
    };

    // Rendu conditionnel pour le chargement et les erreurs
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-gray-500">Chargement...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 text-red-600 flex items-center justify-center">
                <div className="text-center">
                    <p className="font-medium mb-2">Une erreur est survenue</p>
                    <p className="text-sm">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* En-tête */}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-semibold text-gray-900">Objectifs</h1>
                <Button
                    onClick={() => setShowForm(true)}
                    disabled={isSubmitting}
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Nouvel objectif
                </Button>
            </div>

            {/* Formulaire */}
            {showForm && (
                <div className="mb-6">
                    <EnhancedObjectiveForm
                        objective={editingObjective}
                        onSubmit={handleFormSubmit}
                        onCancel={handleFormClose}
                        domains={domains}
                    />
                </div>
            )}

            {/* Liste des objectifs */}
            {objectives.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 mb-2">Aucun objectif pour le moment</p>
                    <p className="text-sm text-gray-400">
                        Commencez par créer votre premier objectif !
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {objectives.map(objective => (
                        <ObjectiveCard
                            key={objective.id}
                            objective={objective}
                            onClick={() => handleEdit(objective)}
                            onDelete={() => handleDelete(objective)}
                        />
                    ))}
                </div>
            )}

            {/* Modal de confirmation de suppression */}
            <Modal
                isOpen={!!objectiveToDelete}
                onClose={() => setObjectiveToDelete(null)}
                title="Supprimer l'objectif"
            >
                <div className="p-6">
                    <p className="text-gray-600 mb-6">
                        Êtes-vous sûr de vouloir supprimer l'objectif "{objectiveToDelete?.title}" ?<br />
                        Cette action est irréversible.
                    </p>
                    <div className="flex justify-end gap-4">
                        <Button
                            variant="ghost"
                            onClick={() => setObjectiveToDelete(null)}
                        >
                            Annuler
                        </Button>
                        <Button
                            variant="danger"
                            onClick={handleDeleteConfirm}
                        >
                            Supprimer
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ObjectivesPage;