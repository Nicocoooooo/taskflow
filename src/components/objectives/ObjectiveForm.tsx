import React, { useState, useEffect } from 'react';
import { Plus, X, GripVertical } from 'lucide-react';

import { Card } from '../common/Card';
import { Button } from '../common/Button';
import type {
    Objective,
    CreateObjectiveDto,
    ObjectiveType,
    CreateObjectiveStepDto
} from '../../features/objectives/types';
import { objectivesApi } from '../../features/objectives/api';

interface ObjectiveFormProps {
    objective?: Objective;
    onSubmit: () => void;
    onCancel: () => void;
}

const ObjectiveForm: React.FC<ObjectiveFormProps> = ({
    objective,
    onSubmit,
    onCancel,
}) => {
    const [formData, setFormData] = useState<CreateObjectiveDto>({
        title: '',
        description: '',
        type: 'short_term',
        due_date: '',
        steps: [] as CreateObjectiveStepDto[]
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Initialiser le formulaire avec les données de l'objectif si en mode édition
    useEffect(() => {
        if (objective) {
            const formattedSteps: CreateObjectiveStepDto[] = (objective.steps || []).map(step => ({
                title: step.title,
                description: step.description || '',
                order_index: step.order_index
            }));

            setFormData({
                title: objective.title,
                description: objective.description || '',
                type: objective.type,
                due_date: objective.due_date || '',
                steps: formattedSteps
            });
        }
    }, [objective]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            if (objective) {
                await objectivesApi.update(objective.id, formData);
            } else {
                await objectivesApi.create(formData);
            }
            onSubmit();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddStep = () => {
        setFormData(prev => ({
            ...prev,
            steps: [
                ...prev.steps || [],
                {
                    title: '',
                    description: '',
                    order_index: (prev.steps?.length || 0)
                }
            ]
        }));
    };

    const handleRemoveStep = (index: number) => {
        setFormData(prev => ({
            ...prev,
            steps: prev.steps?.filter((_, i) => i !== index)
        }));
    };

    return (
        <Card className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Titre */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Titre
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        placeholder="Titre de l'objectif"
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        rows={3}
                        placeholder="Description détaillée de l'objectif"
                    />
                </div>

                {/* Type */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Type
                    </label>
                    <select
                        value={formData.type}
                        onChange={e => setFormData(prev => ({ ...prev, type: e.target.value as ObjectiveType }))}
                        className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    >
                        <option value="short_term">Court terme</option>
                        <option value="medium_term">Moyen terme</option>
                        <option value="long_term">Long terme</option>
                    </select>
                </div>

                {/* Date d'échéance */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date d'échéance
                    </label>
                    <input
                        type="date"
                        value={formData.due_date}
                        onChange={e => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
                        className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    />
                </div>

                {/* Étapes */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Étapes
                        </label>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleAddStep}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Ajouter une étape
                        </Button>
                    </div>

                    <div className="space-y-3">
                        {formData.steps?.map((step, index) => (
                            <div
                                key={index}
                                className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl"
                            >
                                <GripVertical className="w-5 h-5 mt-2 text-gray-400" />
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        value={step.title}
                                        onChange={e => {
                                            const newSteps = [...(formData.steps || [])];
                                            newSteps[index] = { ...newSteps[index], title: e.target.value };
                                            setFormData(prev => ({ ...prev, steps: newSteps }));
                                        }}
                                        className="w-full px-3 py-1.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent mb-2"
                                        placeholder="Titre de l'étape"
                                    />
                                    <textarea
                                        value={step.description || ''}
                                        onChange={e => {
                                            const newSteps = [...(formData.steps || [])];
                                            newSteps[index] = { ...newSteps[index], description: e.target.value };
                                            setFormData(prev => ({ ...prev, steps: newSteps }));
                                        }}
                                        className="w-full px-3 py-1.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                        placeholder="Description de l'étape"
                                        rows={2}
                                    />
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveStep(index)}
                                    className="text-red-600 hover:text-red-700"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Messages d'erreur */}
                {error && (
                    <div className="text-red-600 text-sm">
                        {error}
                    </div>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onCancel}
                    >
                        Annuler
                    </Button>
                    <Button
                        type="submit"
                        isLoading={isLoading}
                    >
                        {objective ? 'Mettre à jour' : 'Créer'}
                    </Button>
                </div>
            </form>
        </Card>
    );
};

export default ObjectiveForm;