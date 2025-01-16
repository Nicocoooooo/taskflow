import { supabase } from '../../lib/supabase';

export interface Category {
    id: number;
    name: string;
    color: string;
    parent_id?: number;
    created_at: string;
}

export const categoriesApi = {
    async fetchAll(): Promise<Category[]> {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('name');

        if (error) throw new Error(error.message);
        return data || [];
    }
};