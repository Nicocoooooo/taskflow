import { supabase } from '../../lib/supabase';
import type {
    GlobalStats,
    GeneralStats,
    ProductivityStats,
    TimelineStats,
    StatsQueryParams,
    StatsError
} from './types';

const calculateCompletionRate = (completed: number, total: number): number => {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
};

const getDefaultDateRange = () => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30); // 30 derniers jours par défaut
    return {
        startDate: start.toISOString(),
        endDate: end.toISOString()
    };
};

export async function fetchGeneralStats(params?: StatsQueryParams): Promise<GeneralStats> {
    try {
        const { startDate, endDate } = { ...getDefaultDateRange(), ...params };

        // Récupérer toutes les tâches pour la période
        const { data: tasksData, error: tasksError } = await supabase
            .from('tasks')
            .select('*, categories(id, name)')
            .gte('created_at', startDate)
            .lte('created_at', endDate);

        if (tasksError) throw tasksError;

        // Récupérer les objectifs
        const { data: objectivesData, error: objectivesError } = await supabase
            .from('objectives')
            .select('*')
            .gte('created_at', startDate)
            .lte('created_at', endDate);

        if (objectivesError) throw objectivesError;

        // Récupérer les habitudes
        const { data: habitsData, error: habitsError } = await supabase
            .from('habits')
            .select(`
                *,
                habit_logs!inner(*)
            `)
            .gte('created_at', startDate)
            .lte('created_at', endDate);

        if (habitsError) throw habitsError;

        // Calculer les statistiques par catégorie
        const categoryStats = tasksData.reduce((acc: Record<string, any>, task) => {
            const categoryId = task.category_id;
            const categoryName = task.categories?.name || 'Sans catégorie';

            if (!acc[categoryId]) {
                acc[categoryId] = {
                    categoryId,
                    categoryName,
                    timeSpent: 0,
                    taskCount: 0
                };
            }

            acc[categoryId].timeSpent += task.estimated_time || 0;
            acc[categoryId].taskCount += 1;

            return acc;
        }, {});

        const completedTasks = tasksData.filter(task => task.status === 'done');

        return {
            tasksCompleted: completedTasks.length,
            totalTasks: tasksData.length,
            completionRate: calculateCompletionRate(completedTasks.length, tasksData.length),
            averageCompletionTime: completedTasks.length > 0
                ? Math.round(completedTasks.reduce((acc, task) => acc + (task.estimated_time || 0), 0) / completedTasks.length)
                : 0,
            deadlineRespectRate: completedTasks.length > 0
                ? calculateCompletionRate(
                    completedTasks.filter(task =>
                        task.completed_at && task.due_date &&
                        new Date(task.completed_at) <= new Date(task.due_date)
                    ).length,
                    completedTasks.length
                )
                : 0,
            timePerCategory: Object.values(categoryStats),
            objectivesStats: {
                totalObjectives: objectivesData.length,
                completedObjectives: objectivesData.filter(obj => obj.status === 'completed').length,
                inProgressObjectives: objectivesData.filter(obj => obj.status === 'in_progress').length,
                completionRate: calculateCompletionRate(
                    objectivesData.filter(obj => obj.status === 'completed').length,
                    objectivesData.length
                )
            },
            habitsStats: {
                totalHabits: habitsData.length,
                activeHabits: habitsData.filter(habit => habit.habit_logs?.length > 0).length,
                averageStreak: habitsData.length > 0
                    ? Math.round(habitsData.reduce((acc, habit) => acc + (habit.current_streak || 0), 0) / habitsData.length)
                    : 0,
                bestStreak: habitsData.length > 0
                    ? Math.max(...habitsData.map(habit => habit.best_streak || 0))
                    : 0,
                completionRate: calculateCompletionRate(
                    habitsData.reduce((acc, habit) => acc + (habit.habit_logs?.length || 0), 0),
                    habitsData.length * 30
                )
            }
        };
    } catch (error) {
        console.error('Error fetching general stats:', error);
        throw {
            code: 'GENERAL_STATS_ERROR',
            message: 'Erreur lors de la récupération des statistiques générales',
            details: error
        } as StatsError;
    }
}

export async function fetchProductivityStats(params?: StatsQueryParams): Promise<ProductivityStats> {
    try {
        const { startDate, endDate } = { ...getDefaultDateRange(), ...params };

        // Récupérer les tâches complétées
        const { data: tasksData, error: tasksError } = await supabase
            .from('tasks')
            .select('*, categories(name)')
            .eq('status', 'done')
            .gte('created_at', startDate)
            .lte('created_at', endDate);

        if (tasksError) throw tasksError;

        // Initialiser les statistiques horaires
        const hourlyStats = Array.from({ length: 24 }, (_, hour) => ({
            hour,
            tasksCompleted: 0,
            timeSpent: 0
        }));

        // Initialiser les statistiques journalières
        const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'] as const;
        const dailyStats = days.map(day => ({
            day,
            tasksCompleted: 0,
            timeSpent: 0
        }));

        // Calculer les statistiques temporelles
        tasksData.forEach(task => {
            if (task.completed_at) {
                const completedDate = new Date(task.completed_at);
                const hour = completedDate.getHours();
                const day = completedDate.getDay();

                hourlyStats[hour].tasksCompleted += 1;
                hourlyStats[hour].timeSpent += task.estimated_time || 0;

                dailyStats[day].tasksCompleted += 1;
                dailyStats[day].timeSpent += task.estimated_time || 0;
            }
        });

        // Distribution par type de tâche
        const typeDistribution = tasksData.reduce((acc: Record<string, any>, task) => {
            const type = task.categories?.name || 'Sans catégorie';
            if (!acc[type]) {
                acc[type] = { type, count: 0 };
            }
            acc[type].count += 1;
            return acc;
        }, {});

        const taskTypeDistribution = Object.values(typeDistribution).map((item: any) => ({
            type: item.type,
            count: item.count,
            percentage: Math.round((item.count / tasksData.length) * 100)
        }));

        // Distribution par priorité
        const priorities = ['low', 'medium', 'high', 'urgent'] as const;
        const priorityDistribution = priorities.map(priority => ({
            priority,
            count: tasksData.filter(task => task.priority === priority).length,
            percentage: Math.round(
                (tasksData.filter(task => task.priority === priority).length / tasksData.length) * 100
            )
        }));

        // Calculer les durées moyennes
        const averageTaskDuration = {
            byPriority: priorities.reduce((acc, priority) => {
                const tasks = tasksData.filter(task => task.priority === priority);
                acc[priority] = tasks.length > 0
                    ? Math.round(tasks.reduce((sum, task) => sum + (task.estimated_time || 0), 0) / tasks.length)
                    : 0;
                return acc;
            }, {} as Record<string, number>),

            byCategory: tasksData.reduce((acc: Record<string, number[]>, task) => {
                const category = task.categories?.name || 'Sans catégorie';
                if (!acc[category]) acc[category] = [];
                if (task.estimated_time) acc[category].push(task.estimated_time);
                return acc;
            }, {}),

            overall: tasksData.length > 0
                ? Math.round(tasksData.reduce((acc, task) => acc + (task.estimated_time || 0), 0) / tasksData.length)
                : 0
        };

        // Convertir les tableaux de temps en moyennes
        const byCategoryAverages = Object.entries(averageTaskDuration.byCategory).reduce(
            (acc, [category, times]) => ({
                ...acc,
                [category]: times.length > 0
                    ? Math.round(times.reduce((a, b) => a + b, 0) / times.length)
                    : 0
            }),
            {} as Record<string, number>
        );

        return {
            mostProductiveHours: hourlyStats,
            mostProductiveDays: dailyStats,
            taskTypeDistribution,
            priorityDistribution,
            averageTaskDuration: {
                ...averageTaskDuration,
                byCategory: byCategoryAverages
            }
        };
    } catch (error) {
        console.error('Error fetching productivity stats:', error);
        throw {
            code: 'PRODUCTIVITY_STATS_ERROR',
            message: 'Erreur lors de la récupération des statistiques de productivité',
            details: error
        } as StatsError;
    }
}

export async function fetchTimelineStats(params?: StatsQueryParams): Promise<TimelineStats> {
    try {
        const { startDate, endDate } = { ...getDefaultDateRange(), ...params };

        // Récupérer les données par mois
        const { data: tasksData, error: tasksError } = await supabase
            .from('tasks')
            .select('*, categories(name)')
            .gte('created_at', startDate)
            .lte('created_at', endDate)
            .order('created_at', { ascending: true });

        if (tasksError) throw tasksError;

        // Grouper par mois
        const monthlyData = tasksData.reduce((acc: Record<string, any>, task) => {
            const month = task.created_at.substring(0, 7); // Format: YYYY-MM
            if (!acc[month]) {
                acc[month] = {
                    tasksCompleted: 0,
                    timeSpent: 0,
                    completionRate: 0,
                    objectivesAchieved: 0,
                    habitCompletionRate: 0,
                    totalTasks: 0
                };
            }

            acc[month].totalTasks += 1;
            if (task.status === 'done') {
                acc[month].tasksCompleted += 1;
                acc[month].timeSpent += task.estimated_time || 0;
            }

            return acc;
        }, {});

        // Calculer les taux de complétion
        const monthlyOverview = Object.entries(monthlyData).map(([month, data]: [string, any]) => ({
            month,
            tasksCompleted: data.tasksCompleted,
            timeSpent: data.timeSpent,
            completionRate: calculateCompletionRate(data.tasksCompleted, data.totalTasks),
            objectivesAchieved: 0, // À implémenter si nécessaire
            habitCompletionRate: 0 // À implémenter si nécessaire
        }));

        // Comparaison avec la période précédente
        const currentMetrics = {
            tasksCompleted: tasksData.filter(task => task.status === 'done').length,
            timeSpent: tasksData
                .filter(task => task.status === 'done')
                .reduce((acc, task) => acc + (task.estimated_time || 0), 0),
            completionRate: calculateCompletionRate(
                tasksData.filter(task => task.status === 'done').length,
                tasksData.length
            ),
            objectivesAchieved: 0,
            habitCompletionRate: 0,
            productivityScore: 0
        };

        const previousMetrics = {
            tasksCompleted: 0,
            timeSpent: 0,
            completionRate: 0,
            objectivesAchieved: 0,
            habitCompletionRate: 0,
            productivityScore: 0
        };

        const variation = {
            tasksCompleted: 100,
            timeSpent: 100,
            completionRate: 100,
            objectivesAchieved: 0,
            habitCompletionRate: 0,
            productivityScore: 0
        };

        return {
            monthlyOverview,
            periodComparison: {
                current: {
                    startDate,
                    endDate,
                    metrics: currentMetrics
                },
                previous: {
                    startDate: new Date(new Date(startDate).getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                    endDate: startDate,
                    metrics: previousMetrics
                },
                variation
            }
        };
    } catch (error) {
        console.error('Error fetching timeline stats:', error);
        throw {
            code: 'TIMELINE_STATS_ERROR',
            message: 'Erreur lors de la récupération des statistiques temporelles',
            details: error
        } as StatsError;
    }
}

export async function fetchAllStats(params?: StatsQueryParams): Promise<GlobalStats> {
    try {
        const [general, productivity, timeline] = await Promise.all([
            fetchGeneralStats(params),
            fetchProductivityStats(params),
            fetchTimelineStats(params)
        ]);

        return {
            general,
            productivity,
            timeline,
            lastUpdated: new Date().toISOString()
        };
    } catch (error) {
        console.error('Error fetching all stats:', error);
        throw {
            code: 'GLOBAL_STATS_ERROR',
            message: 'Erreur lors de la récupération des statistiques globales',
            details: error
        } as StatsError;
    }
}