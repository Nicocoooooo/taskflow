import { useStats } from '../../features/stats/hooks';
import StatCard from '../../components/stats/StatCard';
import StatChart from '../../components/stats/StatChart';
import { CheckCircle, Clock, Award, Target } from 'lucide-react';

const StatsOverview: React.FC = () => {
    const { data, isLoading, error } = useStats();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-4rem)] p-4">
                <div className="text-gray-500">Chargement des statistiques...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 sm:p-6 flex items-center justify-center">
                <div className="text-red-600 text-center">
                    <p className="font-medium mb-2">Une erreur est survenue</p>
                    <p className="text-sm">{error.message}</p>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="p-4 sm:p-6 flex items-center justify-center">
                <div className="text-gray-500 text-center">Aucune donnée disponible</div>
            </div>
        );
    }

    const timelineData = data.timeline.monthlyOverview.map(item => ({
        date: item.month,
        value: item.tasksCompleted
    }));

    const productivityByDay = data.productivity.mostProductiveDays.map(day => ({
        category: day.day,
        value: day.tasksCompleted
    }));

    const categoryDistribution = data.general.timePerCategory.map(cat => ({
        name: cat.categoryName,
        value: cat.taskCount
    }));

    return (
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                <StatCard
                    title="Tâches Complétées"
                    value={data.general.tasksCompleted}
                    trend={data.timeline.periodComparison.variation.tasksCompleted}
                    icon={CheckCircle}
                    variant="success"
                />

                <StatCard
                    title="Temps Total"
                    value={`${Math.round(data.general.timePerCategory.reduce((acc, cat) => acc + cat.timeSpent, 0) / 60)}h`}
                    icon={Clock}
                    variant="primary"
                />

                <StatCard
                    title="Taux de Complétion"
                    value={`${data.general.completionRate}%`}
                    trend={data.timeline.periodComparison.variation.completionRate}
                    icon={Target}
                    variant="warning"
                />

                <StatCard
                    title="Meilleur Streak"
                    value={data.general.habitsStats.bestStreak}
                    icon={Award}
                    variant="default"
                />
            </div>

            {/* Graphiques principaux */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                <StatChart
                    type="line"
                    data={timelineData}
                    title="Évolution des Tâches"
                    description="Progression sur la période"
                    variant="primary"
                    height={250}
                    className="overflow-hidden"
                />

                <StatChart
                    type="bar"
                    data={productivityByDay}
                    title="Productivité par Jour"
                    description="Tâches complétées par jour"
                    variant="success"
                    height={250}
                    className="overflow-hidden"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                <StatChart
                    type="pie"
                    data={categoryDistribution}
                    title="Distribution par Catégorie"
                    description="Répartition des tâches"
                    variant="warning"
                    height={300}
                />

                <div className="space-y-3 sm:space-y-4">
                    {data.general.timePerCategory.map((category, index) => (
                        <StatCard
                            key={category.categoryId}
                            title={category.categoryName}
                            value={`${category.taskCount} tâches`}
                            description={`${Math.round(category.timeSpent / 60)}h de temps total`}
                            variant={index % 2 === 0 ? 'default' : 'primary'}
                            className="h-auto"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StatsOverview;