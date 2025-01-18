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

export interface UpdateObjectiveDto {
    title?: string;
    description?: string;
    due_date?: string;
    category_id?: number;
    domain_id?: number;
    type?: ObjectiveType;
    status?: ObjectiveStatus;
    progress?: number;
    notes?: string;

    // Champs SMART
    smart_specific?: string;
    smart_measurable?: string;
    smart_achievable?: string;
    smart_realistic?: string;
    target_value?: number;
    measurement_unit?: string;
    priority?: number;
}