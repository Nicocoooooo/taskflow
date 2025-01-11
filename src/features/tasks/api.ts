import { supabase } from '../../lib/supabase';
import { Task, TaskFormData, Person, Category } from './types';
import { PostgrestError } from '@supabase/supabase-js';

export type ApiResponse<T> = {
    data: T | null;
    error: PostgrestError | null;
};

// Récupérer toutes les tâches avec leurs personnes associées
export const fetchTasks = async (): Promise<ApiResponse<Task[]>> => {
    const { data: tasks, error } = await supabase
        .from('tasks')
        .select(`
            *,
            category:categories(id, name, color),
            people:task_persons(person_name)
        `)
        .order('created_at', { ascending: false });

    if (error) {
        return { data: null, error };
    }

    // Transformer les données pour correspondre à notre type Task
    const formattedTasks = tasks.map(task => ({
        ...task,
        due_date: task.due_date ? new Date(task.due_date) : undefined,
        created_at: new Date(task.created_at),
        completed_at: task.completed_at ? new Date(task.completed_at) : undefined,
        people: task.people.map((p: { person_name: string }) => ({
            id: p.person_name, // Utiliser le nom comme ID pour simplifier
            name: p.person_name
        }))
    }));

    return { data: formattedTasks, error: null };
};

// Récupérer une tâche spécifique
export const fetchTaskById = async (id: string): Promise<ApiResponse<Task>> => {
    const { data: task, error } = await supabase
        .from('tasks')
        .select(`
            *,
            category:categories(id, name, color),
            people:task_persons(person_name)
        `)
        .eq('id', id)
        .single();

    if (error) {
        return { data: null, error };
    }

    // Transformer la tâche
    const formattedTask = {
        ...task,
        due_date: task.due_date ? new Date(task.due_date) : undefined,
        created_at: new Date(task.created_at),
        completed_at: task.completed_at ? new Date(task.completed_at) : undefined,
        people: task.people.map((p: { person_name: string }) => ({
            id: p.person_name,
            name: p.person_name
        }))
    };

    return { data: formattedTask, error: null };
};

// Créer une nouvelle tâche
export const createTask = async (taskData: TaskFormData): Promise<ApiResponse<Task>> => {
    // Commencer une transaction
    const { data: task, error: taskError } = await supabase
        .from('tasks')
        .insert({
            name: taskData.name,
            description: taskData.description,
            due_date: taskData.due_date?.toISOString(),
            estimated_time: taskData.estimated_time,
            priority: taskData.priority,
            is_urgent: taskData.is_urgent,
            is_important: taskData.is_important,
            category_id: taskData.category_id,
            status: taskData.status,
            notes: taskData.notes
        })
        .select()
        .single();

    if (taskError) {
        return { data: null, error: taskError };
    }

    // Ajouter les personnes associées si présentes
    if (taskData.people && taskData.people.length > 0) {
        const peopleToInsert = taskData.people.map(person => ({
            task_id: task.id,
            person_name: person.name
        }));

        const { error: peopleError } = await supabase
            .from('task_persons')
            .insert(peopleToInsert);

        if (peopleError) {
            return { data: null, error: peopleError };
        }
    }

    // Récupérer la tâche complète avec ses relations
    return fetchTaskById(task.id);
};

// Mettre à jour une tâche existante
export const updateTask = async (id: string, taskData: TaskFormData): Promise<ApiResponse<Task>> => {
    // Mettre à jour la tâche principale
    const { error: taskError } = await supabase
        .from('tasks')
        .update({
            name: taskData.name,
            description: taskData.description,
            due_date: taskData.due_date?.toISOString(),
            estimated_time: taskData.estimated_time,
            priority: taskData.priority,
            is_urgent: taskData.is_urgent,
            is_important: taskData.is_important,
            category_id: taskData.category_id,
            status: taskData.status,
            notes: taskData.notes,
            completed_at: taskData.status === 'done' ? new Date().toISOString() : null
        })
        .eq('id', id);

    if (taskError) {
        return { data: null, error: taskError };
    }

    // Mettre à jour les personnes associées
    if (taskData.people) {
        // Supprimer les anciennes associations
        await supabase
            .from('task_persons')
            .delete()
            .eq('task_id', id);

        // Ajouter les nouvelles
        if (taskData.people.length > 0) {
            const peopleToInsert = taskData.people.map(person => ({
                task_id: id,
                person_name: person.name
            }));

            const { error: peopleError } = await supabase
                .from('task_persons')
                .insert(peopleToInsert);

            if (peopleError) {
                return { data: null, error: peopleError };
            }
        }
    }

    // Récupérer la tâche mise à jour
    return fetchTaskById(id);
};

// Supprimer une tâche
export const deleteTask = async (id: string): Promise<ApiResponse<null>> => {
    // Supprimer d'abord les personnes associées
    await supabase
        .from('task_persons')
        .delete()
        .eq('task_id', id);

    // Puis supprimer la tâche
    const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

    return { data: null, error };
};

// Récupérer toutes les catégories
export const fetchCategories = async (): Promise<ApiResponse<Category[]>> => {
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

    return { data, error };
};

// Récupérer toutes les personnes uniques
export const fetchPeople = async (): Promise<ApiResponse<Person[]>> => {
    const { data, error } = await supabase
        .from('task_persons')
        .select('person_name')
        .eq('person_name', 'person_name') // Au lieu de distinct()
        .then(result => ({
            ...result,
            data: result.data ? Array.from(new Set(result.data.map(p => p.person_name))).map(name => ({
                person_name: name
            })) : []
        }));

    if (error) {
        return { data: null, error };
    }

    const formattedPeople = data.map((p: { person_name: string }) => ({
        id: p.person_name,
        name: p.person_name
    }));

    return { data: formattedPeople, error: null };
};