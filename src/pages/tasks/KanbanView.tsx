import { useState, useEffect } from 'react';
import { Task, TaskFormData, TaskStatus } from '../../features/tasks/types';
import { fetchTasks, updateTask, createTask } from '../../features/tasks/api';
import TaskCard from '../../components/tasks/TaskCard';
import Modal from '../../components/common/Modal';
import TaskForm from '../../components/tasks/TaskForm';
import { Plus } from 'lucide-react';

// Définition des colonnes
const COLUMNS: { id: TaskStatus; title: string }[] = [
    { id: 'todo', title: 'À faire' },
    { id: 'in_progress', title: 'En cours' },
    { id: 'done', title: 'Terminé' }
];

const KanbanView = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreateMode, setIsCreateMode] = useState(false);

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        setIsLoading(true);
        const { data } = await fetchTasks();
        if (data) {
            setTasks(data);
        }
        setIsLoading(false);
    };

    const handleTaskClick = (task: Task) => {
        setSelectedTask(task);
        setIsCreateMode(false);
        setIsModalOpen(true);
    };

    const handleCreateClick = (status: TaskStatus) => {
        setSelectedTask(null);
        setIsCreateMode(true);
        setIsModalOpen(true);
        // Prédéfinir le statut en fonction de la colonne
        setSelectedTask({ status } as Task);
    };

    const handleSubmit = async (taskData: TaskFormData) => {
        if (isCreateMode) {
            await createTask(taskData);
        } else if (selectedTask) {
            await updateTask(selectedTask.id, taskData);
        }
        setIsModalOpen(false);
        setSelectedTask(null);
        loadTasks();
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-48">Chargement...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">Tableau Kanban</h1>
            </div>

            {/* Colonnes Kanban */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {COLUMNS.map(column => {
                    const columnTasks = tasks.filter(task => task.status === column.id);
                    return (
                        <div key={column.id} className="bg-gray-50 rounded-xl p-4">
                            {/* En-tête de colonne */}
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-medium text-gray-900">
                                    {column.title} ({columnTasks.length})
                                </h2>
                                <button
                                    onClick={() => handleCreateClick(column.id)}
                                    className="p-1 hover:bg-gray-200 rounded-full"
                                    title={`Ajouter une tâche dans ${column.title}`}
                                >
                                    <Plus className="h-5 w-5 text-gray-600" />
                                </button>
                            </div>

                            {/* Liste des tâches */}
                            <div className="space-y-3">
                                {columnTasks.map(task => (
                                    <div
                                        key={task.id}
                                        onClick={() => handleTaskClick(task)}
                                        className="cursor-pointer transform transition-transform hover:scale-[1.02]"
                                    >
                                        <TaskCard task={task} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Modal de création/édition */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedTask(null);
                }}
                title={isCreateMode ? "Nouvelle tâche" : "Modifier la tâche"}
            >
                <TaskForm
                    initialData={selectedTask || undefined}
                    onSubmit={handleSubmit}
                    onCancel={() => {
                        setIsModalOpen(false);
                        setSelectedTask(null);
                    }}
                />
            </Modal>
        </div>
    );
};

export default KanbanView;