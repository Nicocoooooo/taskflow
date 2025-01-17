import { ObjectiveType, ObjectiveStatus, ObjectiveStep, CreateObjectiveStepDto } from './types';

export interface LifeDomain {
    id: number;
    name: string;
    color: string;
    icon?: string;
    created_at: string;
}

export interface ObjectiveKPI {
    id: number;
    objective_id: number;
    name: string;
    target_value: number;
    current_value: number;
    unit?: string;
    created_at: string;
}

export interface ObjectiveMilestone {
    id: number;
    objective_id: number;
    title: string;
    target_value?: number;
    achieved_at?: string;
    celebration_message?: string;
    created_at: string;
}

export interface EnhancedObjective {
    id: number;
    title: string;
    description?: string;
    domain_id?: number;
    parent_id?: number;
    type: ObjectiveType;
    status: ObjectiveStatus;
    progress: number;
    due_date?: string;
    category_id?: number;

    // SMART details
    smart_specific?: string;
    smart_measurable?: string;
    smart_achievable?: string;
    smart_realistic?: string;
    target_value?: number;
    current_value?: number;
    measurement_unit?: string;

    // Motivation features
    motivation_quote?: string;
    reminder_frequency?: string;
    last_reminder_at?: string;
    celebration_message?: string;
    priority: number;

    // Relations
    domain?: LifeDomain;
    parent_objective?: EnhancedObjective;
    sub_objectives?: EnhancedObjective[];
    kpis?: ObjectiveKPI[];
    milestones?: ObjectiveMilestone[];
    linked_tasks?: LinkedTask[];
    steps?: ObjectiveStep[];

    created_at: string;
    notes?: string;
}

export interface LinkedTask {
    task_id: number;
    impact_weight: number;
    notes?: string;
    task?: {
        id: number;
        title: string;
        status: string;
        due_date?: string;
        priority: string;
    };
}

export interface CreateEnhancedObjectiveDto {
    title: string;
    description?: string;
    domain_id?: number;
    category_id?: number; // Ajout du champ
    type: ObjectiveType;
    due_date?: string;
    priority: number;

    // Les champs SMART sont maintenant optionnels
    smart_specific?: string;
    smart_measurable?: string;
    smart_achievable?: string;
    smart_realistic?: string;
    target_value?: number;
    measurement_unit?: string;

    // Relations
    steps?: CreateObjectiveStepDto[];
    kpis?: Array<{
        name: string;
        target_value: number;
        unit?: string;
    }>;
    milestones?: Array<{
        title: string;
        target_value?: number;
        celebration_message?: string;
    }>;
}