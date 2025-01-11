// src/pages/dashboard/DashboardWidgets.tsx
import { useState, useEffect } from 'react';
import { Plus, Clock, AlertCircle } from 'lucide-react';
import { Task, TaskFormData } from '../../features/tasks/types';
import { fetchTasks, createTask, updateTask } from '../../features/tasks/api';
import TaskCard from '../../components/tasks/TaskCard';
import Modal from '../../components/common/Modal';
import TaskForm from '../../components/tasks/TaskForm';

const DashboardWidgets = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [showQuickAdd, setShowQuickAdd] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Chargement initial des tâches
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

    // Gestion du QuickAdd
    const handleQuickAdd = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const taskData: TaskFormData = {
            name: formData.get('name') as string,
            status: 'todo',
            priority: 'medium',
            is_urgent: false,
            is_important: false,
            due_date: new Date(),
        };

        await createTask(taskData);
        setShowQuickAdd(false);
        loadTasks();
        (e.target as HTMLFormElement).reset();
    };

    // Gestion de l'édition des tâches
    const handleTaskClick = (task: Task) => {
        setSelectedTask(task);
        setIsEditModalOpen(true);
    };

    const handleTaskUpdate = async (taskData: TaskFormData) => {
        if (selectedTask) {
            await updateTask(selectedTask.id, taskData);
            loadTasks();
            setIsEditModalOpen(false);
            setSelectedTask(null);
        }
    };

    // Filtrage des tâches
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayTasks = tasks.filter(task => {
        if (!task.due_date) return false;
        const taskDate = new Date(task.due_date);
        taskDate.setHours(0, 0, 0, 0);
        return taskDate.getTime() === today.getTime();
    });

    const overdueTasks = tasks.filter(task => {
        if (!task.due_date) return false;
        const taskDate = new Date(task.due_date);
        taskDate.setHours(0, 0, 0, 0);
        return taskDate < today && task.status !== 'done';
    });

    if (isLoading) {
        return <div className="flex justify-center items-center h-48">Chargement...</div>;
    }

    return (
        <>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-gray-900">Tableau de bord</h1>
                    <button
                        onClick={() => setShowQuickAdd(!showQuickAdd)}
                        className="inline-flex items-center gap-2 bg-violet-600 text-white px-4 py-2 rounded-xl hover:bg-violet-700 transition-colors"
                    >
                        <Plus className="h-5 w-5" />
                        Ajouter une tâche
                    </button>
                </div>

                {/* Quick Add Form */}
                {showQuickAdd && (
                    <form onSubmit={handleQuickAdd} className="bg-white p-4 rounded-xl shadow-sm">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                name="name"
                                placeholder="Nouvelle tâche pour aujourd'hui..."
                                className="flex-1 rounded-xl border-gray-300 focus:border-violet-500 focus:ring-violet-500"
                                required
                                autoFocus
                            />
                            <button
                                type="submit"
                                className="bg-violet-600 text-white px-4 py-2 rounded-xl hover:bg-violet-700 transition-colors"
                            >
                                Ajouter
                            </button>
                        </div>
                    </form>
                )}

                {/* Tâches en retard */}
                {overdueTasks.length > 0 && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-red-600">
                            <AlertCircle className="h-5 w-5" />
                            <h2 className="text-lg font-semibold">Tâches en retard</h2>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {overdueTasks.map(task => (
                                <div
                                    key={task.id}
                                    onClick={() => handleTaskClick(task)}
                                    className="cursor-pointer transition-transform hover:scale-102"
                                >
                                    <div className="bg-red-50 rounded-xl p-1">
                                        <TaskCard task={task} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Tâches du jour */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-gray-900">
                        <Clock className="h-5 w-5" />
                        <h2 className="text-lg font-semibold">Tâches du jour</h2>
                    </div>
                    {todayTasks.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">
                            Aucune tâche prévue pour aujourd'hui
                        </p>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {todayTasks.map(task => (
                                <div
                                    key={task.id}
                                    onClick={() => handleTaskClick(task)}
                                    className="cursor-pointer transition-transform hover:scale-102"
                                >
                                    <TaskCard task={task} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal d'édition */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedTask(null);
                }}
                title="Modifier la tâche"
            >
                {selectedTask && (
                    <TaskForm
                        initialData={selectedTask}
                        onSubmit={handleTaskUpdate}
                        onCancel={() => {
                            setIsEditModalOpen(false);
                            setSelectedTask(null);
                        }}
                    />
                )}
            </Modal>
        </>
    );
};

export default DashboardWidgets;