// features/workout/types.ts
export type WorkoutType = {
    id: number;
    name: string;
    description: string | null;
    color: string;
    created_at: Date;
};

export type Exercise = {
    id: number;
    workout_type_id: number;
    name: string;
    description: string | null;
    target_muscles: string[];
    notes: string | null;
    order_index: number;
    created_at: Date;
};

export type WorkoutSession = {
    id: number;
    workout_type_id: number;
    workout_type?: WorkoutType;
    date: Date;
    overall_feeling: number;
    notes: string | null;
    created_at: Date;
    exercises?: WorkoutExercise[];
};

export type WorkoutExercise = {
    id: number;
    session_id: number;
    session: WorkoutSession;
    exercise_id: number;
    exercise?: Exercise;
    weight: number;
    sets: number;
    reps: number;
    completion_rate: number;
    notes: string | null;
    created_at: Date;
};

export type CreateWorkoutSessionDTO = {
    workout_type_id: number;
    date: Date;
    overall_feeling: number;
    notes: string | null;
};

export type CreateWorkoutExerciseDTO = {
    session_id: number;
    exercise_id: number;
    weight: number;
    sets: number;
    reps: number;
    completion_rate: number;
    notes: string | null;
};

export type ExerciseFormData = {
    weight: number;
    sets: number;
    reps: number;
    completion_rate: number;
    notes: string;
};