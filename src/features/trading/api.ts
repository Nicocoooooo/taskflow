// src/features/trading/api.ts

import { supabase } from '../../lib/supabase';
import { Trade, TradeFormData } from './types';

// Récupérer tous les trades
export const fetchTrades = async () => {
    const { data, error } = await supabase
        .from('trades')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Trade[];
};

// Récupérer les trades ouverts
export const fetchOpenTrades = async () => {
    const { data, error } = await supabase
        .from('trades')
        .select('*')
        .eq('status', 'open')
        .order('entry_date', { ascending: false });

    if (error) throw error;
    return data as Trade[];
};

// Créer un nouveau trade
export const createTrade = async (trade: TradeFormData) => {
    const { data, error } = await supabase
        .from('trades')
        .insert([{ ...trade, status: 'open' }])
        .select()
        .single();

    if (error) throw error;
    return data as Trade;
};

// Mettre à jour un trade
export const updateTrade = async (id: string, trade: Partial<TradeFormData>) => {
    const { data, error } = await supabase
        .from('trades')
        .update(trade)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data as Trade;
};

// Supprimer un trade
export const deleteTrade = async (id: string) => {
    const { error } = await supabase
        .from('trades')
        .delete()
        .eq('id', id);

    if (error) throw error;
};

export const closeTrade = async (id: string, closeData: {
    exit_price: number;
    exit_date: Date;
    post_analysis: string;
    emotional_state?: string;
}) => {
    const { data, error } = await supabase
        .from('trades')
        .update({
            ...closeData,
            status: 'closed',
            updated_at: new Date()
        })
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data as Trade;
};