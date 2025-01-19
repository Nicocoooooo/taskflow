import { supabase } from '../../lib/supabase';
import { Habit, CreateHabitDto, HabitLog } from './types';

export const habitsApi = {
    // Récupérer toutes les habitudes
    async fetchHabits(): Promise<Habit[]> {
        const { data, error } = await supabase
            .from('habits')
            .select(`
        *,
        category:categories(*)
      `)
            .eq('is_active', true)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching habits:', error);
            throw error;
        }

        return data || [];
    },

    // Récupérer une habitude par son ID
    async fetchHabitById(id: number): Promise<Habit> {
        const { data, error } = await supabase
            .from('habits')
            .select(`
        *,
        category:categories(*)
      `)
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching habit:', error);
            throw error;
        }

        if (!data) {
            throw new Error('Habit not found');
        }

        return data;
    },

    // Créer une nouvelle habitude
    async createHabit(habitData: CreateHabitDto): Promise<Habit> {
        const { data, error } = await supabase
            .from('habits')
            .insert([
                {
                    name: habitData.name,
                    description: habitData.description,
                    frequency: habitData.frequency,
                    reminder_time: habitData.frequency.reminderTime,
                    category_id: habitData.category_id,
                    current_streak: 0,
                    best_streak: 0,
                    is_active: true
                }
            ])
            .select()
            .single();

        if (error) {
            console.error('Error creating habit:', error);
            throw error;
        }

        return data;
    },

    // Mettre à jour une habitude
    async updateHabit(id: number, habitData: Partial<CreateHabitDto>): Promise<Habit> {
        const updateData: any = {};

        if (habitData.name) updateData.name = habitData.name;
        if (habitData.description !== undefined) updateData.description = habitData.description;
        if (habitData.frequency) {
            updateData.frequency = habitData.frequency;
            updateData.reminder_time = habitData.frequency.reminderTime;
        }
        if (habitData.category_id !== undefined) updateData.category_id = habitData.category_id;

        const { data, error } = await supabase
            .from('habits')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating habit:', error);
            throw error;
        }

        return data;
    },

    // Supprimer une habitude (soft delete)
    async deleteHabit(id: number): Promise<void> {
        const { error } = await supabase
            .from('habits')
            .update({ is_active: false })
            .eq('id', id);

        if (error) {
            console.error('Error deleting habit:', error);
            throw error;
        }
    },

    // Marquer une habitude comme complétée
    async completeHabit(habitId: number, notes?: string): Promise<void> {
        const { error: logError } = await supabase
            .from('habit_logs')
            .insert([
                {
                    habit_id: habitId,
                    completed_at: new Date().toISOString(),
                    notes
                }
            ]);

        if (logError) {
            console.error('Error completing habit:', logError);
            throw logError;
        }

        // Mise à jour des streaks via la fonction PostgreSQL
        const { error: streakError } = await supabase.rpc('update_habit_streaks', {
            habit_id_param: habitId
        });

        if (streakError) {
            console.error('Error updating streaks:', streakError);
            throw streakError;
        }
    },

    // Vérifier si une habitude a été complétée aujourd'hui
    async isHabitCompletedToday(habitId: number): Promise<boolean> {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const { data, error } = await supabase
            .from('habit_logs')
            .select('id')
            .eq('habit_id', habitId)
            .eq('skipped', false)
            .gte('completed_at', today.toISOString())
            .limit(1);

        if (error) {
            console.error('Error checking habit completion:', error);
            throw error;
        }

        return data.length > 0;
    },

    // Récupérer les logs d'une habitude
    async getHabitLogs(habitId: number, limit: number = 30): Promise<HabitLog[]> {
        const { data, error } = await supabase
            .from('habit_logs')
            .select('*')
            .eq('habit_id', habitId)
            .order('completed_at', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('Error fetching habit logs:', error);
            throw error;
        }

        return data || [];
    },

    // Récupérer les statistiques d'une habitude
    async getHabitStats(habitId: number): Promise<{
        current_streak: number;
        best_streak: number;
        total_completions: number;
    }> {
        const { data: habit, error } = await supabase
            .from('habits')
            .select('current_streak, best_streak')
            .eq('id', habitId)
            .single();

        if (error) {
            console.error('Error fetching habit stats:', error);
            throw error;
        }

        const { count } = await supabase
            .from('habit_logs')
            .select('id', { count: 'exact', head: true })
            .eq('habit_id', habitId)
            .eq('skipped', false);

        return {
            current_streak: habit.current_streak,
            best_streak: habit.best_streak,
            total_completions: count || 0
        };
    }
};