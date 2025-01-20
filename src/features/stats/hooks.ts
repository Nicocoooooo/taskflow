import { useState, useEffect } from 'react';
import { fetchAllStats } from './api';
import type { GlobalStats, StatsError, StatsQueryParams } from './types';

interface UseStatsResult {
    data: GlobalStats | null;
    isLoading: boolean;
    error: StatsError | null;
    refresh: () => Promise<void>;
}

export const useStats = (params?: StatsQueryParams): UseStatsResult => {
    const [data, setData] = useState<GlobalStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<StatsError | null>(null);

    const loadStats = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const stats = await fetchAllStats(params);
            setData(stats);
        } catch (err) {
            setError(err as StatsError);
            setData(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadStats();
    }, [params]);

    const refresh = async () => {
        await loadStats();
    };

    return {
        data,
        isLoading,
        error,
        refresh
    };
};