export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface Person {
    id: string;
    name: string;
}

export interface Category {
    id: string;
    name: string;
    color: string;
    parent_id?: string;
}

export interface Task {
    id: string;
    name: string;
    description?: string;
    due_date?: Date;
    estimated_time?: number; // en minutes
    priority: TaskPriority;
    people?: Person[];
    is_urgent: boolean;
    is_important: boolean;
    category_id?: string;
    status: TaskStatus;
    notes?: string;
    created_at: Date;
    completed_at?: Date;
}

export interface TaskFormData extends Omit<Task, 'id' | 'created_at' | 'completed_at'> {
    id?: string;
}