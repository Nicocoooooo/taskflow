// features/workout/api.ts
import { supabase } from '../../lib/supabase';
import {
    WorkoutType,
    WorkoutSession,
    WorkoutExercise,
    CreateWorkoutSessionDTO,
    CreateWorkoutExerciseDTO,
    Exercise
} from './types';
import { ApiResponse } from '../tasks/api';

// Récupérer toutes les séances
export const fetchWorkoutSessions = async (limit = 10): Promise<ApiResponse<WorkoutSession[]>> => {
    const { data, error } = await supabase
        .from('workout_sessions')
        .select(`
            *,
            workout_type:workout_types(*),
            exercises:workout_exercises(
                *,
                exercise:exercises(*)
            )
        `)
        .order('date', { ascending: false })
        .limit(limit);

    if (error) return { data: null, error };

    const formattedData = data.map(session => ({
        ...session,
        date: new Date(session.date),
        created_at: new Date(session.created_at),
        exercises: session.exercises?.map((ex: any) => ({
            ...ex,
            created_at: new Date(ex.created_at)
        }))
    }));

    return { data: formattedData, error: null };
};

// Récupérer une séance spécifique
export const fetchWorkoutSession = async (id: number): Promise<ApiResponse<WorkoutSession>> => {
    const { data, error } = await supabase
        .from('workout_sessions')
        .select(`
            *,
            workout_type:workout_types(*),
            exercises:workout_exercises(
                *,
                exercise:exercises(*)
            )
        `)
        .eq('id', id)
        .single();

    if (error) return { data: null, error };

    const formattedData = {
        ...data,
        date: new Date(data.date),
        created_at: new Date(data.created_at),
        exercises: data.exercises?.map((ex: any) => ({
            ...ex,
            created_at: new Date(ex.created_at)
        }))
    };

    return { data: formattedData, error: null };
};

// Créer une nouvelle séance
export const createWorkoutSession = async (sessionData: CreateWorkoutSessionDTO): Promise<ApiResponse<WorkoutSession>> => {
    const { data, error } = await supabase
        .from('workout_sessions')
        .insert({
            workout_type_id: sessionData.workout_type_id,
            date: sessionData.date.toISOString(),
            overall_feeling: sessionData.overall_feeling,
            notes: sessionData.notes
        })
        .select(`
            *,
            workout_type:workout_types(*)
        `)
        .single();

    if (error) return { data: null, error };

    const formattedData = {
        ...data,
        date: new Date(data.date),
        created_at: new Date(data.created_at)
    };

    return { data: formattedData, error: null };
};

// Ajouter un exercice à une séance
export const addExerciseToSession = async (exerciseData: CreateWorkoutExerciseDTO): Promise<ApiResponse<WorkoutExercise>> => {
    const { data, error } = await supabase
        .from('workout_exercises')
        .insert({
            session_id: exerciseData.session_id,
            exercise_id: exerciseData.exercise_id,
            weight: exerciseData.weight,
            sets: exerciseData.sets,
            reps: exerciseData.reps,
            completion_rate: exerciseData.completion_rate,
            notes: exerciseData.notes
        })
        .select(`
            *,
            exercise:exercises(*)
        `)
        .single();

    if (error) return { data: null, error };

    const formattedData = {
        ...data,
        created_at: new Date(data.created_at)
    };

    return { data: formattedData, error: null };
};

// Récupérer tous les types de séances
export const fetchWorkoutTypes = async (): Promise<ApiResponse<WorkoutType[]>> => {
    const { data, error } = await supabase
        .from('workout_types')
        .select('*')
        .order('name');

    if (error) return { data: null, error };

    const formattedData = data.map(type => ({
        ...type,
        created_at: new Date(type.created_at)
    }));

    return { data: formattedData, error: null };
};

// Récupérer tous les exercices
export const fetchExercises = async (workoutTypeId?: number): Promise<ApiResponse<Exercise[]>> => {
    let query = supabase
        .from('exercises')
        .select('*')
        .order('order_index');

    if (workoutTypeId) {
        query = query.eq('workout_type_id', workoutTypeId);
    }

    const { data, error } = await query;

    if (error) return { data: null, error };

    const formattedData = data.map(exercise => ({
        ...exercise,
        created_at: new Date(exercise.created_at)
    }));

    return { data: formattedData, error: null };
};

// Récupérer l'historique d'un exercice
export const fetchExerciseProgress = async (exerciseId: number): Promise<ApiResponse<WorkoutExercise[]>> => {
    const { data, error } = await supabase
        .from('workout_exercises')
        .select(`
            *,
            session:workout_sessions(date)
        `)
        .eq('exercise_id', exerciseId)
        .order('created_at', { ascending: true });

    if (error) return { data: null, error };

    const formattedData = data.map(exercise => ({
        ...exercise,
        created_at: new Date(exercise.created_at),
        session: {
            ...exercise.session,
            date: new Date(exercise.session.date)
        }
    }));

    return { data: formattedData, error: null };
};

// Dans features/workout/api.ts

export const createExercise = async (exerciseData: Omit<Exercise, 'id' | 'created_at'>): Promise<ApiResponse<Exercise>> => {
    const { data, error } = await supabase
        .from('exercises')
        .insert([exerciseData])
        .select()
        .single();

    return { data, error };
};

export const updateExercise = async (id: number, exerciseData: Omit<Exercise, 'id' | 'created_at'>): Promise<ApiResponse<Exercise>> => {
    const { data, error } = await supabase
        .from('exercises')
        .update(exerciseData)
        .eq('id', id)
        .select()
        .single();

    return { data, error };
};

export const deleteExercise = async (id: number): Promise<ApiResponse<null>> => {
    const { error } = await supabase
        .from('exercises')
        .delete()
        .eq('id', id);

    return { data: null, error };
};

export const fetchExercise = async (id: number): Promise<ApiResponse<Exercise>> => {
    const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .eq('id', id)
        .single();

    return { data, error };
};