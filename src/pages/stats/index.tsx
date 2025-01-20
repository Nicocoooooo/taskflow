import { useStats } from '../../features/stats/hooks';
import StatCard from '../../components/stats/StatCard';
import StatChart from '../../components/stats/StatChart';
import { CheckCircle, Clock, Award, Target } from 'lucide-react';

const StatsOverview: React.FC = () => {
    const { data, isLoading, error } = useStats();

    if (isLoading) {
        return <div>Chargement des statistiques...</div>;
    }

    if (error) {
        return <div>Erreur lors du chargement des statistiques : {error.message}</div>;
    }

    if (!data) {
        return <div>Aucune donnée disponible</div>;
    }

    // Formatage des données pour les graphiques
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
        <div className="p-6 space-y-6">
            {/* En-tête avec les KPIs principaux */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

            {/* Graphiques */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <StatChart
                    type="line"
                    data={timelineData}
                    title="Évolution des Tâches Complétées"
                    description="Progression sur la période"
                    variant="primary"
                />

                <StatChart
                    type="bar"
                    data={productivityByDay}
                    title="Productivité par Jour"
                    description="Nombre de tâches complétées par jour"
                    variant="success"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <StatChart
                    type="pie"
                    data={categoryDistribution}
                    title="Distribution par Catégorie"
                    description="Répartition des tâches par catégorie"
                    variant="warning"
                />

                <div className="space-y-6">
                    {data.general.timePerCategory.map((category, index) => (
                        <StatCard
                            key={category.categoryId}
                            title={category.categoryName}
                            value={`${category.taskCount} tâches`}
                            description={`${Math.round(category.timeSpent / 60)}h de temps total`}
                            variant={index % 2 === 0 ? 'default' : 'primary'}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StatsOverview;