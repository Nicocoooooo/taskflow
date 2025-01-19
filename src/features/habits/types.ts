// Types de fréquence
export type FrequencyType = 'daily' | 'weekly' | 'monthly' | 'custom';

// Configuration hebdomadaire
export type WeeklyConfig = {
    days: boolean[];  // [dimanche, lundi, ..., samedi]
};

// Configuration mensuelle
export type MonthlyConfig = {
    dates: number[];  // [1, 15, 30] pour le 1er, 15 et 30 du mois
};

// Configuration personnalisée
export type CustomConfig = {
    intervalDays: number;  // Tous les X jours
};

// Configuration de la fréquence
export type FrequencyConfig = {
    type: FrequencyType;
    reminderTime: string;  // Format HH:mm
    weekly?: WeeklyConfig;
    monthly?: MonthlyConfig;
    custom?: CustomConfig;
};

// Structure complète d'une habitude
export interface Habit {
    id: number;
    name: string;
    description: string | null;
    frequency: FrequencyConfig;
    reminder_time: string | null;  // Format HH:mm
    category_id: number | null;
    current_streak: number;
    best_streak: number;
    created_at: string;
    is_active: boolean;
    category?: {
        id: number;
        name: string;
        color: string;
    };
}

// DTO pour la création d'une habitude
export type CreateHabitDto = {
    name: string;
    description?: string;
    frequency: FrequencyConfig;
    category_id?: number;
};

// Structure d'un log d'habitude
export interface HabitLog {
    id: number;
    habit_id: number;
    completed_at: string;
    skipped: boolean;
    notes: string | null;
}

// État initial du formulaire d'habitude
export const initialHabitFormState: CreateHabitDto = {
    name: '',
    description: '',
    frequency: {
        type: 'daily',
        reminderTime: '09:00'
    }
};