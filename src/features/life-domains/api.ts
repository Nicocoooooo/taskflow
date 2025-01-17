import { supabase } from '../../lib/supabase';
import { LifeDomain } from '../objectives/enhanced-types';

export const lifeDomainsApi = {
    async fetchAll(): Promise<LifeDomain[]> {
        const { data, error } = await supabase
            .from('life_domains')
            .select('*')
            .order('name');

        if (error) throw new Error(error.message);
        return data || [];
    },

    async create(domain: Pick<LifeDomain, 'name' | 'color'>): Promise<LifeDomain> {
        const { data, error } = await supabase
            .from('life_domains')
            .insert([domain])
            .select()
            .single();

        if (error) throw new Error(error.message);
        return data;
    }
};