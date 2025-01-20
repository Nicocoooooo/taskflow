// Types pour les statistiques générales
export interface GeneralStats {
    // Statistiques des tâches
    tasksCompleted: number;
    totalTasks: number;
    completionRate: number;
    averageCompletionTime: number; // en minutes
    deadlineRespectRate: number;

    // Statistiques par catégorie
    timePerCategory: Array<{
        categoryId: number;
        categoryName: string;
        timeSpent: number; // en minutes
        taskCount: number;
    }>;

    // Statistiques des objectifs
    objectivesStats: {
        totalObjectives: number;
        completedObjectives: number;
        inProgressObjectives: number;
        completionRate: number;
    };

    // Statistiques des habitudes
    habitsStats: {
        totalHabits: number;
        activeHabits: number;
        averageStreak: number;
        bestStreak: number;
        completionRate: number;
    };
}

// Types pour les analyses de productivité
export interface ProductivityStats {
    // Statistiques par période
    mostProductiveHours: Array<{
        hour: number;
        tasksCompleted: number;
        timeSpent: number;
    }>;

    mostProductiveDays: Array<{
        day: string; // 'MONDAY', 'TUESDAY', etc.
        tasksCompleted: number;
        timeSpent: number;
    }>;

    // Distribution des tâches
    taskTypeDistribution: Array<{
        type: string;
        count: number;
        percentage: number;
    }>;

    priorityDistribution: Array<{
        priority: 'low' | 'medium' | 'high' | 'urgent';
        count: number;
        percentage: number;
    }>;

    // Moyennes
    averageTaskDuration: {
        byPriority: Record<string, number>;
        byCategory: Record<string, number>;
        overall: number;
    };
}

// Types pour les analyses temporelles
export interface TimelineStats {
    // Données mensuelles
    monthlyOverview: Array<{
        month: string; // format 'YYYY-MM'
        tasksCompleted: number;
        timeSpent: number;
        completionRate: number;
        objectivesAchieved: number;
        habitCompletionRate: number;
    }>;

    // Comparaisons
    periodComparison: {
        current: {
            startDate: string;
            endDate: string;
            metrics: PeriodMetrics;
        };
        previous: {
            startDate: string;
            endDate: string;
            metrics: PeriodMetrics;
        };
        variation: PeriodMetrics; // pourcentages de variation
    };
}

// Métriques pour une période
export interface PeriodMetrics {
    tasksCompleted: number;
    timeSpent: number;
    completionRate: number;
    objectivesAchieved: number;
    habitCompletionRate: number;
    productivityScore: number;
}

// Type global pour les statistiques
export interface GlobalStats {
    general: GeneralStats;
    productivity: ProductivityStats;
    timeline: TimelineStats;
    lastUpdated: string; // ISO date string
}

// Types pour les requêtes de statistiques
export interface StatsQueryParams {
    startDate?: string;
    endDate?: string;
    category?: number;
    groupBy?: 'day' | 'week' | 'month' | 'year';
    includeCompleted?: boolean;
    includeInProgress?: boolean;
}

// Types pour les erreurs de statistiques
export interface StatsError {
    code: string;
    message: string;
    details?: unknown;
}