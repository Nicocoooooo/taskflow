import React from 'react';
import { Card } from '../common/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { WorkoutExercise } from '../../features/workout/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface WorkoutProgressProps {
    exerciseHistory: WorkoutExercise[];
    exerciseName: string;
}

const WorkoutProgress: React.FC<WorkoutProgressProps> = ({
    exerciseHistory,
    exerciseName
}) => {
    // S'assurer que exerciseHistory est trié par date
    const sortedHistory = [...exerciseHistory].sort(
        (a, b) => a.session.date.getTime() - b.session.date.getTime()
    );

    // Formater les données pour le graphique
    const chartData = sortedHistory.map(record => ({
        date: format(record.session.date, 'd MMM', { locale: fr }),
        weight: record.weight,
        completion: record.completion_rate
    }));

    // Calculer les statistiques
    const latestWeight = sortedHistory[sortedHistory.length - 1]?.weight ?? 0;
    const initialWeight = sortedHistory[0]?.weight ?? 0;
    const progression = latestWeight - initialWeight;
    const bestWeight = Math.max(...sortedHistory.map(record => record.weight));

    return (
        <div className="space-y-6">
            {/* Statistiques */}
            <div className="grid grid-cols-3 gap-4">
                <Card className="!p-4">
                    <p className="text-sm text-violet-600 font-medium">Progression</p>
                    <p className="text-2xl font-semibold text-violet-900">
                        {progression > 0 ? '+' : ''}{progression} kg
                    </p>
                </Card>
                <Card className="!p-4">
                    <p className="text-sm text-emerald-600 font-medium">Meilleure charge</p>
                    <p className="text-2xl font-semibold text-emerald-900">
                        {bestWeight} kg
                    </p>
                </Card>
                <Card className="!p-4">
                    <p className="text-sm text-orange-600 font-medium">Séances</p>
                    <p className="text-2xl font-semibold text-orange-900">
                        {exerciseHistory.length}
                    </p>
                </Card>
            </div>

            {/* Graphique de progression */}
            <Card>
                <h3 className="text-lg font-semibold mb-4">
                    Progression - {exerciseName}
                </h3>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis yAxisId="weight" orientation="left" />
                            <YAxis yAxisId="completion" orientation="right" domain={[0, 100]} />
                            <Tooltip />

                            {/* Ligne de poids */}
                            <Line
                                yAxisId="weight"
                                type="monotone"
                                dataKey="weight"
                                stroke="#8B5CF6"
                                name="Poids (kg)"
                                strokeWidth={2}
                                dot={{ r: 4 }}
                                activeDot={{ r: 6 }}
                            />

                            {/* Ligne de completion */}
                            <Line
                                yAxisId="completion"
                                type="monotone"
                                dataKey="completion"
                                stroke="#10B981"
                                name="Réussite (%)"
                                strokeWidth={2}
                                dot={{ r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="mt-4 flex justify-center gap-6">
                    <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-violet-500 mr-2" />
                        <span className="text-sm text-gray-600">Poids</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2" />
                        <span className="text-sm text-gray-600">Taux de réussite</span>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default WorkoutProgress;