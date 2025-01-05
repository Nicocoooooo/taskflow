import TaskCard from '../../components/tasks/TaskCard';
import TaskForm from '../../components/tasks/TaskForm';
import { Task, TaskFormData } from '../../features/tasks/types';

// Données de test pour la TaskCard
const sampleTask: Task = {
    id: '1',
    name: 'Implémenter le système de tâches',
    description: 'Créer les composants nécessaires pour la gestion des tâches: TaskCard, TaskForm, et les différentes vues.',
    due_date: new Date('2024-03-20'),
    estimated_time: 180, // 3 heures
    priority: 'high',
    is_urgent: true,
    is_important: true,
    status: 'in_progress',
    created_at: new Date(),
    people: [
        { id: '1', name: 'Nicolas' },
        { id: '2', name: 'Thomas' }
    ]
};

const DashboardPage = () => {
    const handleTaskSubmit = (data: TaskFormData) => {
        console.log('Données du formulaire:', data);
        alert('Formulaire soumis ! Voir la console pour les détails.');
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-semibold mb-6">Test des Composants de Tâches</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Test de TaskCard */}
                    <div>
                        <h2 className="text-xl mb-4">TaskCard</h2>
                        <div className="max-w-md">
                            <TaskCard
                                task={sampleTask}
                                onClick={() => alert('Carte cliquée!')}
                            />
                        </div>
                    </div>

                    {/* Test de TaskCard avec différentes priorités */}
                    <div>
                        <h2 className="text-xl mb-4">TaskCard - Variations de priorités</h2>
                        <div className="space-y-4 max-w-md">
                            {(['low', 'medium', 'high', 'urgent'] as const).map(priority => (
                                <TaskCard
                                    key={priority}
                                    task={{
                                        ...sampleTask,
                                        id: priority,
                                        priority,
                                        name: `Tâche ${priority}`,
                                        is_urgent: priority === 'urgent',
                                        is_important: ['high', 'urgent'].includes(priority)
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Test du TaskForm */}
                <div className="mt-12">
                    <h2 className="text-xl mb-4">TaskForm</h2>
                    <div className="max-w-2xl bg-white p-6 rounded-2xl border border-gray-200">
                        <TaskForm
                            onSubmit={handleTaskSubmit}
                            onCancel={() => alert('Formulaire annulé!')}
                        />
                    </div>
                </div>

                {/* Test du TaskForm en mode édition */}
                <div className="mt-12">
                    <h2 className="text-xl mb-4">TaskForm - Mode édition</h2>
                    <div className="max-w-2xl bg-white p-6 rounded-2xl border border-gray-200">
                        <TaskForm
                            initialData={{
                                name: 'Tâche à modifier',
                                description: 'Description de la tâche existante',
                                priority: 'medium',
                                is_urgent: false,
                                is_important: true,
                                status: 'todo',
                                due_date: new Date('2024-03-25'),
                                estimated_time: 120
                            }}
                            onSubmit={handleTaskSubmit}
                            onCancel={() => alert('Édition annulée!')}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;