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

// Interface principale de l'objectif avec les champs SMART
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

    // Champs SMART
    smart_specific: string | null;
    smart_measurable: string | null;
    smart_achievable: string | null;
    smart_realistic: string | null;
    target_value: number | null;
    measurement_unit: string | null;
    priority: number;

    // Relations
    steps?: ObjectiveStep[];
    linked_tasks?: number[];
}

// Interface pour la création avec les champs SMART
export interface CreateObjectiveDto {
    title: string;
    description?: string;
    due_date?: string;
    category_id?: number;
    type: ObjectiveType;
    notes?: string;
    steps?: CreateObjectiveStepDto[];

    // Champs SMART
    smart_specific: string;
    smart_measurable: string;
    smart_achievable: string;
    smart_realistic: string;
    target_value: number;
    measurement_unit: string;
    priority: number;
}

export interface UpdateObjectiveDto {
    title?: string;
    description?: string;
    due_date?: string;
    category_id?: number;
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