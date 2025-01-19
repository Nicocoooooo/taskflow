import React, { useState, useEffect } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Plus } from 'lucide-react';
import HabitForm from '../../components/habits/HabitForm';
import HabitCard from '../../components/habits/HabitCard';
import { CreateHabitDto, Habit, HabitLog } from '../../features/habits/types';
import { habitsApi } from '../../features/habits/api';

const HabitsPage: React.FC = () => {
    // États
    const [showForm, setShowForm] = useState(false);
    const [habits, setHabits] = useState<Habit[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [completedHabits, setCompletedHabits] = useState<Record<number, boolean>>({});
    const [habitLogs, setHabitLogs] = useState<Record<number, HabitLog[]>>({});

    // Charger les habitudes et leurs logs
    const fetchHabits = async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Récupérer les habitudes
            const habitsData = await habitsApi.fetchHabits();
            setHabits(habitsData);

            // Vérifier les habitudes complétées aujourd'hui
            const completedStatus: Record<number, boolean> = {};
            const logsData: Record<number, HabitLog[]> = {};

            await Promise.all(
                habitsData.map(async (habit) => {
                    // Vérifier si complétée aujourd'hui
                    completedStatus[habit.id] = await habitsApi.isHabitCompletedToday(habit.id);
                    // Récupérer les logs
                    logsData[habit.id] = await habitsApi.getHabitLogs(habit.id);
                })
            );

            setCompletedHabits(completedStatus);
            setHabitLogs(logsData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
            console.error('Erreur lors du chargement des habitudes:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // Charger les données au montage
    useEffect(() => {
        fetchHabits();
    }, []);

    // Créer une nouvelle habitude
    const handleCreateHabit = async (habitData: CreateHabitDto) => {
        try {
            setError(null);
            await habitsApi.createHabit(habitData);
            setShowForm(false);
            fetchHabits(); // Recharger la liste
        } catch (error) {
            console.error('Erreur lors de la création de l\'habitude:', error);
            setError('Erreur lors de la création de l\'habitude');
        }
    };

    // Marquer une habitude comme complétée
    const handleCompleteHabit = async (habitId: number) => {
        try {
            setError(null);
            await habitsApi.completeHabit(habitId);
            setCompletedHabits(prev => ({
                ...prev,
                [habitId]: true
            }));
            // Rafraîchir les données pour mettre à jour les streaks et logs
            fetchHabits();
        } catch (error) {
            console.error('Erreur lors de la complétion de l\'habitude:', error);
            setError('Erreur lors de la complétion de l\'habitude');
        }
    };

    // Supprimer une habitude
    const handleDeleteHabit = async (habitId: number) => {
        try {
            setError(null);
            await habitsApi.deleteHabit(habitId);
            fetchHabits(); // Recharger la liste
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'habitude:', error);
            setError('Erreur lors de la suppression de l\'habitude');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* En-tête */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Mes Habitudes</h1>
                <Button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Nouvelle habitude
                </Button>
            </div>

            {/* Formulaire de création */}
            {showForm && (
                <Card className="mb-8">
                    <div className="p-6">
                        <HabitForm
                            onSubmit={handleCreateHabit}
                            onCancel={() => setShowForm(false)}
                        />
                    </div>
                </Card>
            )}

            {/* Message d'erreur */}
            {error && (
                <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-lg">
                    {error}
                </div>
            )}

            {/* État de chargement */}
            {isLoading ? (
                <div className="text-center py-8">
                    <p className="text-gray-600">Chargement des habitudes...</p>
                </div>
            ) : habits.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-600 text-lg mb-4">
                        Aucune habitude pour le moment.
                    </p>
                    <Button onClick={() => setShowForm(true)}>
                        Commencer par en créer une !
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {habits.map((habit) => (
                        <HabitCard
                            key={habit.id}
                            habit={habit}
                            onComplete={handleCompleteHabit}
                            onDelete={handleDeleteHabit}
                            isCompletedToday={completedHabits[habit.id] || false}
                            habitLogs={habitLogs[habit.id] || []}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default HabitsPage;