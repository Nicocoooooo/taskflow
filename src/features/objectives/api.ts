import { supabase } from '../../lib/supabase';
import {
    Objective,
    CreateObjectiveDto,
    UpdateObjectiveDto,
    ObjectiveStep,
    CreateObjectiveStepDto,
    UpdateObjectiveStepDto,
} from './types';

// Fonctions utilitaires
const calculateProgress = (steps: ObjectiveStep[]): number => {
    if (steps.length === 0) return 0;
    const completedSteps = steps.filter(step => step.is_completed).length;
    return Math.round((completedSteps / steps.length) * 100);
};

// API Objectives
export const objectivesApi = {
    // Récupérer tous les objectifs avec leurs étapes
    async fetchAll(): Promise<Objective[]> {
        const { data: objectives, error } = await supabase
            .from('objectives')
            .select(`
                *,
                steps:objective_steps(*)
            `)
            .order('created_at', { ascending: false });

        if (error) throw new Error(error.message);
        return objectives || [];
    },

    // Récupérer un objectif par ID
    async fetchById(id: number): Promise<Objective | null> {
        const { data, error } = await supabase
            .from('objectives')
            .select(`
                *,
                steps:objective_steps(*),
                linked_tasks:objective_tasks(task_id)
            `)
            .eq('id', id)
            .single();

        if (error) throw new Error(error.message);
        return data;
    },

    // Créer un nouvel objectif
    async create(dto: CreateObjectiveDto): Promise<Objective> {
        // Séparer les étapes du reste des données
        const { steps, ...objectiveData } = dto;

        // 1. Créer l'objectif
        const { data: objective, error } = await supabase
            .from('objectives')
            .insert([{
                ...objectiveData,
                status: 'not_started',
                progress: 0
            }])
            .select()
            .single();

        if (error) throw new Error(error.message);

        // 2. Si des étapes sont fournies, les créer
        if (steps && steps.length > 0) {
            const { error: stepsError } = await supabase
                .from('objective_steps')
                .insert(
                    steps.map((step, index) => ({
                        title: step.title,
                        description: step.description,
                        order_index: index,
                        objective_id: objective.id,
                        is_completed: false
                    }))
                );

            if (stepsError) throw new Error(stepsError.message);
        }

        // 3. Récupérer l'objectif complet avec ses étapes
        const { data: finalObjective, error: fetchError } = await supabase
            .from('objectives')
            .select(`
                *,
                steps:objective_steps(*)
            `)
            .eq('id', objective.id)
            .single();

        if (fetchError) throw new Error(fetchError.message);
        return finalObjective;
    },

    // Mettre à jour un objectif
    async update(id: number, dto: UpdateObjectiveDto): Promise<Objective> {
        const { data, error } = await supabase
            .from('objectives')
            .update(dto)
            .eq('id', id)
            .select()
            .single();

        if (error) throw new Error(error.message);
        return data;
    },

    // Supprimer un objectif
    async delete(id: number): Promise<void> {
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
            .insert([{ objective_id: objectiveId, task_id: taskId }]);

        if (error) throw new Error(error.message);
    },

    // Délier une tâche d'un objectif
    async unlinkTask(objectiveId: number, taskId: number): Promise<void> {
        const { error } = await supabase
            .from('objective_tasks')
            .delete()
            .match({ objective_id: objectiveId, task_id: taskId });

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
        const { data: steps } = await supabase
            .from('objective_steps')
            .select('*')
            .eq('objective_id', objectiveId);

        if (steps) {
            await objectivesApi.update(objectiveId, {
                progress: calculateProgress(steps)
            });
        }

        return data;
    },

    // Mettre à jour une étape
    async update(id: number, dto: UpdateObjectiveStepDto): Promise<ObjectiveStep> {
        const { data, error } = await supabase
            .from('objective_steps')
            .update(dto)
            .eq('id', id)
            .select()
            .single();

        if (error) throw new Error(error.message);

        // Si le statut de complétion a changé, mettre à jour le progrès de l'objectif
        if (dto.is_completed !== undefined) {
            const { data: step } = await supabase
                .from('objective_steps')
                .select('objective_id')
                .eq('id', id)
                .single();

            if (step) {
                const { data: steps } = await supabase
                    .from('objective_steps')
                    .select('*')
                    .eq('objective_id', step.objective_id);

                if (steps) {
                    await objectivesApi.update(step.objective_id, {
                        progress: calculateProgress(steps)
                    });
                }
            }
        }

        return data;
    },

    // Supprimer une étape
    async delete(id: number): Promise<void> {
        const { error } = await supabase
            .from('objective_steps')
            .delete()
            .eq('id', id);

        if (error) throw new Error(error.message);
    }
};