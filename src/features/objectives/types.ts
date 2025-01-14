// Types d'objectifs
export type ObjectiveType = 'short_term' | 'medium_term' | 'long_term';
export type ObjectiveStatus = 'not_started' | 'in_progress' | 'completed';

// Structure d'une étape d'objectif
export interface ObjectiveStep {
    id: number;
    objective_id: number;
    title: string;
    description: string | null;
    order_index: number;
    is_completed: boolean;
    completed_at: string | null;
}

// Structure principale d'un objectif
export interface Objective {
    id: number;
    title: string;
    description: string | null;
    due_date: string | null;
    category_id: number | null;
    type: ObjectiveType;
    status: ObjectiveStatus;
    progress: number;
    notes: string | null;
    created_at: string;
    steps?: ObjectiveStep[];
    linked_tasks?: number[]; // IDs des tâches liées
}

// Interface pour la création d'un objectif
export interface CreateObjectiveDto {
    title: string;
    description?: string;
    due_date?: string;
    category_id?: number;
    type: ObjectiveType;
    notes?: string;
    steps?: CreateObjectiveStepDto[];
}

// Interface pour la mise à jour d'un objectif
export interface UpdateObjectiveDto {
    title?: string;
    description?: string;
    due_date?: string;
    category_id?: number;
    type?: ObjectiveType;
    status?: ObjectiveStatus;
    progress?: number;
    notes?: string;
}

// Interface pour la création d'une étape
export interface CreateObjectiveStepDto {
    title: string;
    description?: string;
    order_index: number;
}

// Interface pour la mise à jour d'une étape
export interface UpdateObjectiveStepDto {
    title?: string;
    description?: string;
    order_index?: number;
    is_completed?: boolean;
}