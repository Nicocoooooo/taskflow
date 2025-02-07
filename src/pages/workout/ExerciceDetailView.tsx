import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { ChevronLeft, Award, TrendingUp, Calendar, Target } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { fetchExercise, fetchExerciseProgress } from '../../features/workout/api';
import { Exercise, WorkoutExercise } from '../../features/workout/types';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

const ExerciseDetailView: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [exercise, setExercise] = useState<Exercise | null>(null);
    const [history, setHistory] = useState<WorkoutExercise[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) loadExerciseData(Number(id));
    }, [id]);

    const loadExerciseData = async (exerciseId: number) => {
        setLoading(true);
        try {
            const [exerciseData, historyData] = await Promise.all([
                fetchExercise(exerciseId),
                fetchExerciseProgress(exerciseId)
            ]);

            if (exerciseData.data) setExercise(exerciseData.data);
            if (historyData.data) setHistory(historyData.data);
        } catch (error) {
            console.error('Erreur lors du chargement des données:', error);
        } finally {
            setLoading(false);
        }
    };

    // Calcul des statistiques
    const calculateStats = () => {
        if (!history.length) return { personalBest: 0, lastWeight: 0, progress: 0, sessionsCount: 0 };

        const weightHistory = history.map(h => h.weight);
        const personalBest = Math.max(...weightHistory);
        const lastWeight = weightHistory[weightHistory.length - 1];
        const firstWeight = weightHistory[0];
        const progress = firstWeight > 0 ? ((lastWeight - firstWeight) / firstWeight) * 100 : 0;

        return {
            personalBest,
            lastWeight,
            progress,
            sessionsCount: history.length
        };
    };

    // Préparation des données pour le graphique
    const chartData = history.map((session) => ({
        date: format(new Date(session.created_at), 'dd/MM/yy'),
        poids: session.weight,
        completion: session.completion_rate
    }));

    if (loading) {
        return <div className="p-6">Chargement...</div>;
    }

    if (!exercise) {
        return <div className="p-6">Exercice non trouvé</div>;
    }

    const { personalBest, lastWeight, progress, sessionsCount } = calculateStats();

    return (
        <div className="p-6">
            {/* En-tête */}
            <div className="flex items-center mb-6">
                <Button
                    variant="ghost"
                    onClick={() => navigate('/workout/exercises')}
                    className="mr-4"
                >
                    <ChevronLeft className="h-5 w-5 mr-1" />
                    Retour
                </Button>
                <h1 className="text-3xl font-semibold text-gray-900">
                    {exercise.name}
                </h1>
            </div>

            {/* Statistiques rapides */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card>
                    <div className="p-4">
                        <div className="flex items-center">
                            <Award className="h-5 w-5 text-violet-500 mr-2" />
                            <span className="text-sm text-gray-500">Record personnel</span>
                        </div>
                        <p className="text-2xl font-semibold mt-2">{personalBest} kg</p>
                    </div>
                </Card>

                <Card>
                    <div className="p-4">
                        <div className="flex items-center">
                            <Target className="h-5 w-5 text-emerald-500 mr-2" />
                            <span className="text-sm text-gray-500">Dernière charge</span>
                        </div>
                        <p className="text-2xl font-semibold mt-2">{lastWeight} kg</p>
                    </div>
                </Card>

                <Card>
                    <div className="p-4">
                        <div className="flex items-center">
                            <TrendingUp className="h-5 w-5 text-blue-500 mr-2" />
                            <span className="text-sm text-gray-500">Progression</span>
                        </div>
                        <p className={`text-2xl font-semibold mt-2 ${progress >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                            {progress.toFixed(1)}%
                        </p>
                    </div>
                </Card>

                <Card>
                    <div className="p-4">
                        <div className="flex items-center">
                            <Calendar className="h-5 w-5 text-orange-500 mr-2" />
                            <span className="text-sm text-gray-500">Nombre de séances</span>
                        </div>
                        <p className="text-2xl font-semibold mt-2">{sessionsCount}</p>
                    </div>
                </Card>
            </div>

            {/* Informations de l'exercice */}
            <Card className="mb-6">
                <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Détails de l'exercice</h2>
                    <p className="text-gray-600 mb-4">{exercise.description || "Pas de description disponible"}</p>

                    {exercise.target_muscles && exercise.target_muscles.length > 0 && (
                        <div>
                            <h3 className="font-medium mb-2">Muscles ciblés</h3>
                            <div className="flex flex-wrap gap-2">
                                {exercise.target_muscles.map((muscle, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-violet-100 text-violet-800"
                                    >
                                        {muscle}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </Card>

            {/* Graphique de progression */}
            {history.length > 0 && (
                <Card className="mb-6">
                    <div className="p-6">
                        <h2 className="text-xl font-semibold mb-4">Progression</h2>
                        <div className="h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis yAxisId="poids" />
                                    <YAxis yAxisId="completion" orientation="right" domain={[0, 100]} />
                                    <Tooltip />
                                    <Legend />
                                    <Line
                                        yAxisId="poids"
                                        type="monotone"
                                        dataKey="poids"
                                        stroke="#8B5CF6"
                                        name="Poids (kg)"
                                        strokeWidth={2}
                                    />
                                    <Line
                                        yAxisId="completion"
                                        type="monotone"
                                        dataKey="completion"
                                        stroke="#10B981"
                                        name="Réussite (%)"
                                        strokeWidth={2}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </Card>
            )}

            {/* Historique des séances */}
            <Card>
                <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Historique des séances</h2>
                    {history.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-3 px-4">Date</th>
                                        <th className="text-left py-3 px-4">Poids</th>
                                        <th className="text-left py-3 px-4">Séries</th>
                                        <th className="text-left py-3 px-4">Répétitions</th>
                                        <th className="text-left py-3 px-4">Réussite</th>
                                        <th className="text-left py-3 px-4">Notes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {history.map((session) => (
                                        <tr key={session.id} className="border-b">
                                            <td className="py-3 px-4">
                                                {format(new Date(session.created_at), 'dd/MM/yyyy', { locale: fr })}
                                            </td>
                                            <td className="py-3 px-4 font-medium">
                                                {session.weight} kg
                                            </td>
                                            <td className="py-3 px-4">
                                                {session.sets}
                                            </td>
                                            <td className="py-3 px-4">
                                                {session.reps}
                                            </td>
                                            <td className="py-3 px-4">
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                                    ${session.completion_rate >= 80 ? 'bg-green-100 text-green-800' :
                                                            session.completion_rate >= 50 ? 'bg-yellow-100 text-yellow-800' :
                                                                'bg-red-100 text-red-800'}`}
                                                >
                                                    {session.completion_rate}%
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-gray-500">
                                                {session.notes || '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-500">Aucune séance enregistrée pour cet exercice.</p>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default ExerciseDetailView;