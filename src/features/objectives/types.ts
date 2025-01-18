export type ObjectiveType = 'short_term' | 'medium_term' | 'long_term';
export type ObjectiveStatus = 'not_started' | 'in_progress' | 'completed';

export interface ObjectiveStep {
    id: number;
    objective_id: number;
    title: string;
    description: string | null;
    order_index: number;
    is_completed: boolean;
    completed_at: string | null;
}

export interface CreateObjectiveStepDto {
    title: string;
    description?: string;
    order_index: number;
}

export interface UpdateObjectiveStepDto {
    title?: string;
    description?: string;
    order_index?: number;
    is_completed?: boolean;
}