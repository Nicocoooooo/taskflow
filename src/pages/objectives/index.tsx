import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../../components/common/Button';
import ObjectiveCard from '../../components/objectives/ObjectiveCard';
import EnhancedObjectiveForm from '../../components/objectives/EnhancedObjectiveForm';
import { Objective } from '../../features/objectives/types';
import { objectivesApi } from '../../features/objectives/api';
import { CreateEnhancedObjectiveDto, EnhancedObjective } from '../../features/objectives/enhanced-types';
import { Category, categoriesApi } from '../../features/categories/api';

const ObjectivesPage = () => {
    const [objectives, setObjectives] = useState<Objective[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [editingObjective, setEditingObjective] = useState<EnhancedObjective | undefined>(undefined);

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

    const fetchCategories = async () => {
        try {
            const data = await categoriesApi.fetchAll();
            setCategories(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        }
    };

    useEffect(() => {
        Promise.all([fetchObjectives(), fetchCategories()]);
    }, []);

    const handleFormClose = () => {
        setShowForm(false);
        setEditingObjective(undefined);
    };

    const handleFormSubmit = async (data: CreateEnhancedObjectiveDto) => {
        try {
            if (editingObjective) {
                await objectivesApi.update(editingObjective.id, {
                    title: data.title,
                    description: data.description ?? undefined,
                    type: data.type,
                    due_date: data.due_date ?? undefined,
                    category_id: data.domain_id ?? undefined,
                    status: editingObjective.status,
                    progress: editingObjective.progress
                });
            } else {
                await objectivesApi.create({
                    title: data.title,
                    description: data.description ?? undefined,
                    type: data.type,
                    due_date: data.due_date ?? undefined,
                    category_id: data.domain_id ?? undefined
                });
            }
            handleFormClose();
            fetchObjectives();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        }
    };

    const handleEdit = (objective: Objective) => {
        const enhancedObjective: EnhancedObjective = {
            id: objective.id,
            title: objective.title,
            description: objective.description ?? undefined,
            due_date: objective.due_date ?? undefined,
            type: objective.type,
            status: objective.status,
            progress: objective.progress,
            domain_id: objective.category_id ?? undefined,
            category_id: objective.category_id ?? undefined,
            created_at: objective.created_at,
            priority: 1,
            smart_specific: '',
            smart_measurable: '',
            smart_achievable: '',
            smart_realistic: '',
            target_value: 0,
            measurement_unit: '',
            kpis: [],
            milestones: [],
            notes: objective.notes ?? undefined,
            steps: objective.steps ?? [],
            linked_tasks: objective.linked_tasks?.map(id => ({
                task_id: id,
                impact_weight: 1
            })) ?? []
        };
        setEditingObjective(enhancedObjective);
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
                    <EnhancedObjectiveForm
                        objective={editingObjective}
                        onSubmit={handleFormSubmit}
                        onCancel={handleFormClose}
                        domains={categories}
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