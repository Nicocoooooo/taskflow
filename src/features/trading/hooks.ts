// src/features/trading/hooks.ts
import { useState, useEffect } from 'react';
import { Trade, TradeFormData } from './types';
import * as api from './api';

export const useTrades = () => {
    const [trades, setTrades] = useState<Trade[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const loadTrades = async () => {
        try {
            setIsLoading(true);
            const data = await api.fetchTrades();
            setTrades(data);
        } catch (e) {
            setError(e as Error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadTrades();
    }, []);

    // Modifions le type de tradeData pour être précis
    const addTrade = async (tradeData: TradeFormData) => {
        try {
            const newTrade = await api.createTrade(tradeData);
            setTrades(prev => [newTrade, ...prev]);
            return newTrade;
        } catch (e) {
            setError(e as Error);
            throw e;
        }
    };

    const closeTrade = async (
        tradeId: string,
        closeData: {
            exit_price: number;
            exit_date: Date;
            post_analysis: string;
            emotional_state?: string;
        }
    ) => {
        try {
            const updatedTrade = await api.closeTrade(tradeId, closeData);
            setTrades(prev => prev.map(t =>
                t.id === tradeId ? updatedTrade : t
            ));
            return updatedTrade;
        } catch (e) {
            setError(e as Error);
            throw e;
        }
    };

    return {
        trades,
        isLoading,
        error,
        loadTrades,
        addTrade,
        closeTrade  // Ajout de la nouvelle fonction
    };
};