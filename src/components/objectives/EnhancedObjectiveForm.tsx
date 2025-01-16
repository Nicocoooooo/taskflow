import React, { useState, useEffect } from 'react';
import { Target, BarChart2, Clock, Plus, GripVertical } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import {
    CreateEnhancedObjectiveDto,
    EnhancedObjective,
    LifeDomain
} from '../../features/objectives/enhanced-types';
import { ObjectiveType } from '../../features/objectives/types';

interface EnhancedObjectiveFormProps {
    objective?: EnhancedObjective;
    onSubmit: (data: CreateEnhancedObjectiveDto) => Promise<void>;
    onCancel: () => void;
    domains: LifeDomain[];
}

const defaultFormData: CreateEnhancedObjectiveDto = {
    title: '',
    description: '',
    type: 'short_term' as ObjectiveType,
    domain_id: undefined,
    due_date: '',
    smart_specific: '',
    smart_measurable: '',
    smart_achievable: '',
    smart_realistic: '',
    target_value: 0,
    measurement_unit: '',
    priority: 1,
    steps: [],
    kpis: [],
    milestones: []
};

interface TabButtonProps {
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: (e: React.MouseEvent) => void;
}

const TabButton: React.FC<TabButtonProps> = ({ icon, label, isActive, onClick }) => (
    <Button
        type="button"
        variant={isActive ? 'secondary' : 'ghost'}
        size="sm"
        onClick={onClick}
        className="flex items-center gap-2"
    >
        {icon}
        {label}
    </Button>
);

const EnhancedObjectiveForm: React.FC<EnhancedObjectiveFormProps> = ({
    objective,
    onSubmit,
    onCancel,
    domains
}) => {
    const [formData, setFormData] = useState<CreateEnhancedObjectiveDto>(defaultFormData);
    const [activeTab, setActiveTab] = useState<'basic' | 'smart' | 'steps'>('basic');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (objective) {
            setFormData({
                ...defaultFormData,
                title: objective.title,
                description: objective.description ?? '',
                type: objective.type,
                domain_id: objective.domain_id,
                due_date: objective.due_date ?? '',
                smart_specific: objective.smart_specific ?? '',
                smart_measurable: objective.smart_measurable ?? '',
                smart_achievable: objective.smart_achievable ?? '',
                smart_realistic: objective.smart_realistic ?? '',
                target_value: objective.target_value ?? 0,
                measurement_unit: objective.measurement_unit ?? '',
                priority: objective.priority ?? 1,
                steps: objective.steps?.map(step => ({
                    title: step.title,
                    description: step.description ?? '',
                    order_index: step.order_index
                })) ?? [],
                kpis: objective.kpis ?? [],
                milestones: objective.milestones ?? []
            });
        }
    }, [objective]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await onSubmit(formData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        } finally {
            setIsLoading(false);
        }
    };

    const handleTabClick = (e: React.MouseEvent, newTab: 'basic' | 'smart' | 'steps') => {
        e.preventDefault();
        setActiveTab(newTab);
    };

    const handleAddStep = () => {
        setFormData(prev => ({
            ...prev,
            steps: [
                ...(prev.steps || []),
                {
                    title: '',
                    description: '',
                    order_index: prev.steps?.length || 0
                }
            ]
        }));
    };

    const handleRemoveStep = (index: number) => {
        setFormData(prev => ({
            ...prev,
            steps: prev.steps?.filter((_, i) => i !== index) || []
        }));
    };

    return (
        <Card className="max-w-4xl mx-auto p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* En-tête */}
                <div className="pb-6 border-b border-gray-200">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                        {objective ? 'Modifier l\'objectif' : 'Nouvel objectif'}
                    </h2>

                    {/* Navigation des onglets */}
                    <div className="flex gap-2">
                        <TabButton
                            icon={<Target className="w-4 h-4" />}
                            label="Informations de base"
                            isActive={activeTab === 'basic'}
                            onClick={(e) => handleTabClick(e, 'basic')}
                        />
                        <TabButton
                            icon={<BarChart2 className="w-4 h-4" />}
                            label="Méthode SMART"
                            isActive={activeTab === 'smart'}
                            onClick={(e) => handleTabClick(e, 'smart')}
                        />
                        <TabButton
                            icon={<Clock className="w-4 h-4" />}
                            label="Étapes"
                            isActive={activeTab === 'steps'}
                            onClick={(e) => handleTabClick(e, 'steps')}
                        />
                    </div>
                </div>

                {/* Onglet : Informations de base */}
                {activeTab === 'basic' && (
                    <div className="space-y-6">
                        <div className="space-y-4">
                            {/* Titre */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Titre
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                    placeholder="Nom de l'objectif"
                                    required
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

                            {/* Type et Domaine */}
                            <div className="grid grid-cols-2 gap-4">
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

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Domaine de vie
                                    </label>
                                    <select
                                        value={formData.domain_id}
                                        onChange={e => setFormData(prev => ({ ...prev, domain_id: Number(e.target.value) }))}
                                        className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                    >
                                        <option value="">Sélectionnez un domaine</option>
                                        {domains.map(domain => (
                                            <option key={domain.id} value={domain.id}>
                                                {domain.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Date et Priorité */}
                            <div className="grid grid-cols-2 gap-4">
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

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Priorité
                                    </label>
                                    <select
                                        value={formData.priority}
                                        onChange={e => setFormData(prev => ({ ...prev, priority: Number(e.target.value) }))}
                                        className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                    >
                                        <option value={1}>Basse</option>
                                        <option value={2}>Moyenne</option>
                                        <option value={3}>Haute</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Onglet : Méthode SMART */}
                {activeTab === 'smart' && (
                    <div className="space-y-6">
                        {/* Spécifique */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Spécifique (Que voulez-vous accomplir exactement ?)
                            </label>
                            <textarea
                                value={formData.smart_specific}
                                onChange={e => setFormData(prev => ({ ...prev, smart_specific: e.target.value }))}
                                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                rows={2}
                                placeholder="Décrivez votre objectif de manière précise et détaillée"
                            />
                        </div>

                        {/* Mesurable */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Mesurable (Comment mesurerez-vous le progrès ?)
                                </label>
                                <textarea
                                    value={formData.smart_measurable}
                                    onChange={e => setFormData(prev => ({ ...prev, smart_measurable: e.target.value }))}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                    rows={2}
                                    placeholder="Définissez des critères quantifiables"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Valeur cible
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.target_value}
                                        onChange={e => setFormData(prev => ({ ...prev, target_value: Number(e.target.value) }))}
                                        className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                        placeholder="Valeur à atteindre"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Unité de mesure
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.measurement_unit}
                                        onChange={e => setFormData(prev => ({ ...prev, measurement_unit: e.target.value }))}
                                        className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                        placeholder="ex: kg, km, heures..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Atteignable */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Atteignable (Quelles ressources ou soutien avez-vous ?)
                            </label>
                            <textarea
                                value={formData.smart_achievable}
                                onChange={e => setFormData(prev => ({ ...prev, smart_achievable: e.target.value }))}
                                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                rows={2}
                                placeholder="Listez les moyens à votre disposition"
                            />
                        </div>

                        {/* Réaliste */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Réaliste (Est-ce aligné avec vos autres objectifs ?)
                            </label>
                            <textarea
                                value={formData.smart_realistic}
                                onChange={e => setFormData(prev => ({ ...prev, smart_realistic: e.target.value }))}
                                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                rows={2}
                                placeholder="Expliquez pourquoi cet objectif est réalisable"
                            />
                        </div>
                    </div>
                )}

                {/* Onglet : Étapes */}
                {activeTab === 'steps' && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium text-gray-900">Étapes à suivre</h3>
                            <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                onClick={handleAddStep}
                                className="flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Ajouter une étape
                            </Button>
                        </div>

                        <div className="space-y-3">
                            {formData.steps?.map((step, index) => (
                                <div
                                    key={index}
                                    className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl group"
                                >
                                    <GripVertical className="w-5 h-5 mt-2 text-gray-400 flex-shrink-0" />
                                    <div className="flex-1 space-y-3">
                                        <input
                                            type="text"
                                            value={step.title}
                                            onChange={e => {
                                                const newSteps = [...(formData.steps || [])];
                                                newSteps[index] = { ...newSteps[index], title: e.target.value };
                                                setFormData(prev => ({ ...prev, steps: newSteps }));
                                            }}
                                            className="w-full px-3 py-1.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                            placeholder="Titre de l'étape"
                                        />
                                        <textarea
                                            value={step.description}
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
                                        className="text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <GripVertical className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}

                            {formData.steps?.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    Aucune étape définie. Commencez par en ajouter une !
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                    <Button type="button" variant="ghost" onClick={onCancel}>
                        Annuler
                    </Button>
                    <Button type="submit" isLoading={isLoading}>
                        {objective ? 'Mettre à jour' : 'Créer l\'objectif'}
                    </Button>
                </div>

                {error && (
                    <div className="text-sm text-red-600 mt-2">
                        {error}
                    </div>
                )}
            </form>
        </Card>
    );
};

export default EnhancedObjectiveForm;