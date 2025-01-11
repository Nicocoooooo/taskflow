// src/components/tasks/TaskList.tsx
import { useEffect, useState } from 'react';
import { createTask, fetchTasks, fetchPeople } from '../../features/tasks/api';
import { Task, Person } from '../../features/tasks/types';
import TaskCard from './TaskCard';

const TaskList = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [people, setPeople] = useState<Person[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Test de création d'une tâche
    const testCreateTask = async () => {
        const result = await createTask({
            name: "Tâche de test",
            description: "Description de la tâche de test",
            priority: "medium",
            is_urgent: false,
            is_important: true,
            status: "todo"
        });

        if (result.error) {
            console.error("Erreur création tâche:", result.error);
            setError("Erreur lors de la création de la tâche");
        } else {
            console.log("Tâche créée avec succès:", result.data);
            // Rafraîchir la liste des tâches
            loadTasks();
        }
    };

    // Chargement des tâches
    const loadTasks = async () => {
        const result = await fetchTasks();
        if (result.error) {
            console.error("Erreur chargement tâches:", result.error);
            setError("Erreur lors du chargement des tâches");
        } else {
            console.log("Tâches chargées:", result.data);
            setTasks(result.data || []);
        }
    };

    // Chargement des personnes
    const loadPeople = async () => {
        const result = await fetchPeople();
        if (result.error) {
            console.error("Erreur chargement personnes:", result.error);
            setError("Erreur lors du chargement des personnes");
        } else {
            console.log("Personnes chargées:", result.data);
            setPeople(result.data || []);
        }
    };

    // Chargement initial
    useEffect(() => {
        const init = async () => {
            try {
                setLoading(true);
                await loadTasks();
                await loadPeople();
            } catch (err) {
                console.error("Erreur lors de l'initialisation:", err);
                setError("Erreur lors du chargement des données");
            } finally {
                setLoading(false);
            }
        };

        init();
    }, []);

    if (loading) return <div className="p-4">Chargement...</div>;
    if (error) return <div className="p-4 text-red-500">{error}</div>;

    return (
        <div className="p-4">
            {/* Bouton de test pour créer une tâche */}
            <button
                onClick={testCreateTask}
                className="mb-4 bg-violet-600 text-white px-4 py-2 rounded-xl hover:bg-violet-700"
            >
                Créer une tâche de test
            </button>

            {/* Affichage des résultats */}
            <div className="space-y-4">
                <div className="border p-4 rounded-xl">
                    <h3 className="font-semibold mb-2">Personnes chargées:</h3>
                    <pre className="bg-gray-100 p-2 rounded">
                        {JSON.stringify(people, null, 2)}
                    </pre>
                </div>

                <div className="border p-4 rounded-xl">
                    <h3 className="font-semibold mb-2">Tâches:</h3>
                    {tasks.length === 0 ? (
                        <p>Aucune tâche trouvée</p>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {tasks.map(task => (
                                <TaskCard key={task.id} task={task} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TaskList;