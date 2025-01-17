import { supabase } from '../../lib/supabase';
import {
    ObjectiveStep,
    CreateObjectiveStepDto,
    UpdateObjectiveDto,
    UpdateObjectiveStepDto,
} from './types';

import {
    CreateEnhancedObjectiveDto,
    EnhancedObjective
} from './enhanced-types';

// Fonctions utilitaires
const calculateProgress = (steps: ObjectiveStep[]): number => {
    if (steps.length === 0) return 0;
    const completedSteps = steps.filter(step => step.is_completed).length;
    return Math.round((completedSteps / steps.length) * 100);
};

// API Objectives
export const objectivesApi = {
    // Récupérer tous les objectifs avec leurs étapes
    async fetchAll(): Promise<EnhancedObjective[]> {
        const { data: objectives, error } = await supabase
            .from('objectives')
            .select(`
                *,
                steps:objective_steps(*),
                linked_tasks:objective_tasks(task_id),
                domain:life_domains(*)
            `)
            .order('created_at', { ascending: false });

        if (error) throw new Error(error.message);
        return objectives || [];
    },

    // Récupérer un objectif par ID
    async fetchById(id: number): Promise<EnhancedObjective | null> {
        const { data, error } = await supabase
            .from('objectives')
            .select(`
                *,
                steps:objective_steps(*),
                linked_tasks:objective_tasks(task_id),
                domain:life_domains(*)
            `)
            .eq('id', id)
            .single();

        if (error) throw new Error(error.message);
        return data;
    },

    // Créer un nouvel objectif avec les champs SMART
    async create(dto: CreateEnhancedObjectiveDto): Promise<EnhancedObjective> {
        // Séparer les steps des autres données
        const { steps, ...restData } = dto;

        // Créer l'objectif en passant directement toutes les données nécessaires
        const { data: objective, error } = await supabase
            .from('objectives')
            .insert([{
                title: restData.title,
                description: restData.description,
                due_date: restData.due_date,
                type: restData.type,
                domain_id: restData.domain_id,
                status: 'not_started',
                progress: 0,
                priority: restData.priority,
                smart_specific: restData.smart_specific,
                smart_measurable: restData.smart_measurable,
                smart_achievable: restData.smart_achievable,
                smart_realistic: restData.smart_realistic,
                target_value: restData.target_value,
                measurement_unit: restData.measurement_unit,
                current_value: 0  // Initialiser la valeur courante à 0
            }])
            .select(`
                *,
                steps:objective_steps(*),
                domain:life_domains(*)
            `)
            .single();

        if (error) {
            console.error("Erreur lors de la création de l'objectif:", error);
            throw new Error(error.message);
        }

        // Créer les étapes si nécessaire
        if (steps && steps.length > 0) {
            const { error: stepsError } = await supabase
                .from('objective_steps')
                .insert(
                    steps.map((step: CreateObjectiveStepDto, index: number) => ({
                        objective_id: objective.id,
                        title: step.title,
                        description: step.description,
                        order_index: index,
                        is_completed: false
                    }))
                );

            if (stepsError) {
                console.error("Erreur lors de la création des étapes:", stepsError);
                throw new Error(stepsError.message);
            }
        }

        // Récupérer l'objectif complet avec toutes ses relations
        const { data: finalObjective, error: fetchError } = await supabase
            .from('objectives')
            .select(`
                *,
                steps:objective_steps(*),
                domain:life_domains(*)
            `)
            .eq('id', objective.id)
            .single();

        if (fetchError) throw new Error(fetchError.message);
        return finalObjective;
    },

    // Mettre à jour un objectif
    async update(id: number, dto: UpdateObjectiveDto): Promise<EnhancedObjective> {
        // Mise à jour de l'objectif avec tous les champs possibles
        const { data, error } = await supabase
            .from('objectives')
            .update({
                ...dto,
                // Si le status passe à 'completed', mettre à jour la date de complétion
                ...(dto.status === 'completed' ? { completed_at: new Date().toISOString() } : {})
            })
            .eq('id', id)
            .select(`
                *,
                steps:objective_steps(*),
                domain:life_domains(*)
            `)
            .single();

        if (error) throw new Error(error.message);
        return data;
    },

    // Supprimer un objectif et toutes ses relations
    async delete(id: number): Promise<void> {
        // 1. Supprimer les étapes
        const { error: stepsError } = await supabase
            .from('objective_steps')
            .delete()
            .eq('objective_id', id);

        if (stepsError) throw new Error(stepsError.message);

        // 2. Supprimer les liens avec les tâches
        const { error: tasksError } = await supabase
            .from('objective_tasks')
            .delete()
            .eq('objective_id', id);

        if (tasksError) throw new Error(tasksError.message);

        // 3. Supprimer l'objectif
        const { error } = await supabase
            .from('objectives')
            .delete()
            .eq('id', id);

        if (error) throw new Error(error.message);
    },

    // Lier une tâche à un objectif
    async linkTask(objectiveId: number, taskId: number): Promise<void> {
        const { error } = await supabase
            .from('objective_tasks')
            .insert([{ objective_id: objectiveId, task_id: taskId }])
            .select()
            .single();

        if (error) throw new Error(error.message);
    },

    // Délier une tâche d'un objectif
    async unlinkTask(objectiveId: number, taskId: number): Promise<void> {
        const { error } = await supabase
            .from('objective_tasks')
            .delete()
            .match({ objective_id: objectiveId, task_id: taskId });

        if (error) throw new Error(error.message);
    },

    // Mettre à jour le progrès d'un objectif
    async updateProgress(id: number): Promise<void> {
        const { data: steps, error: stepsError } = await supabase
            .from('objective_steps')
            .select('*')
            .eq('objective_id', id);

        if (stepsError) throw new Error(stepsError.message);

        const progress = calculateProgress(steps || []);

        const { error } = await supabase
            .from('objectives')
            .update({ progress })
            .eq('id', id);

        if (error) throw new Error(error.message);
    }
};

// API Steps
export const objectiveStepsApi = {
    // Créer une nouvelle étape
    async create(objectiveId: number, dto: CreateObjectiveStepDto): Promise<ObjectiveStep> {
        const { data, error } = await supabase
            .from('objective_steps')
            .insert([{
                ...dto,
                objective_id: objectiveId,
                is_completed: false
            }])
            .select()
            .single();

        if (error) throw new Error(error.message);

        // Mettre à jour le progrès de l'objectif
        await objectivesApi.updateProgress(objectiveId);

        return data;
    },

    // Mettre à jour une étape
    async update(id: number, dto: UpdateObjectiveStepDto): Promise<ObjectiveStep> {
        // 1. Récupérer l'objective_id avant la mise à jour
        const { data: currentStep, error: fetchError } = await supabase
            .from('objective_steps')
            .select('objective_id')
            .eq('id', id)
            .single();

        if (fetchError) throw new Error(fetchError.message);

        // 2. Mettre à jour l'étape
        const { data, error } = await supabase
            .from('objective_steps')
            .update({
                ...dto,
                // Si l'étape est marquée comme complétée, ajouter la date
                ...(dto.is_completed ? { completed_at: new Date().toISOString() } : {})
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw new Error(error.message);

        // 3. Mettre à jour le progrès de l'objectif parent
        await objectivesApi.updateProgress(currentStep.objective_id);

        return data;
    },

    // Supprimer une étape
    async delete(id: number): Promise<void> {
        // 1. Récupérer l'objective_id avant la suppression
        const { data: step, error: fetchError } = await supabase
            .from('objective_steps')
            .select('objective_id')
            .eq('id', id)
            .single();

        if (fetchError) throw new Error(fetchError.message);

        // 2. Supprimer l'étape
        const { error } = await supabase
            .from('objective_steps')
            .delete()
            .eq('id', id);

        if (error) throw new Error(error.message);

        // 3. Mettre à jour le progrès de l'objectif parent
        await objectivesApi.updateProgress(step.objective_id);
    },

    // Réordonner les étapes
    async reorder(steps: { id: number; order_index: number }[]): Promise<void> {
        const { error } = await supabase
            .from('objective_steps')
            .upsert(
                steps.map(step => ({
                    id: step.id,
                    order_index: step.order_index
                }))
            );

        if (error) throw new Error(error.message);
    }
};