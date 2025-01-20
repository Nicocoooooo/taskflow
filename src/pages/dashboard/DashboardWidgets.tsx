// src/pages/dashboard/DashboardWidgets.tsx
import { useState, useEffect } from 'react';
import { Plus, Clock, AlertCircle } from 'lucide-react';
import { Task, TaskFormData } from '../../features/tasks/types';
import { fetchTasks, createTask, updateTask, deleteTask } from '../../features/tasks/api';
import TaskCard from '../../components/tasks/TaskCard';
import Modal from '../../components/common/Modal';
import ConfirmModal from '../../components/common/ConfirmModal';
import TaskForm from '../../components/tasks/TaskForm';
import { Button } from '../../components/common/Button';

const DashboardWidgets = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [showQuickAdd, setShowQuickAdd] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
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

    // Gestion de la suppression
    const handleDeleteClick = (task: Task) => {
        setTaskToDelete(task);
    };

    const handleConfirmDelete = async () => {
        if (taskToDelete) {
            await deleteTask(taskToDelete.id);
            loadTasks();
            setTaskToDelete(null);
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
            <div className="space-y-4 md:space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Tableau de bord</h1>
                    <Button
                        onClick={() => setShowQuickAdd(!showQuickAdd)}
                        className="w-full sm:w-auto"
                    >
                        <Plus className="h-5 w-5 mr-2" />
                        <span className="whitespace-nowrap">Ajouter une tâche</span>
                    </Button>
                </div>

                {/* Quick Add Form */}
                {showQuickAdd && (
                    <form onSubmit={handleQuickAdd} className="bg-white p-3 md:p-4 rounded-xl shadow-sm">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <input
                                type="text"
                                name="name"
                                placeholder="Nouvelle tâche pour aujourd'hui..."
                                className="flex-1 rounded-xl border-gray-300 focus:border-violet-500 focus:ring-violet-500"
                                required
                                autoFocus
                            />
                            <Button
                                type="submit"
                                className="w-full sm:w-auto"
                            >
                                Ajouter
                            </Button>
                        </div>
                    </form>
                )}

                {/* Tâches en retard */}
                {overdueTasks.length > 0 && (
                    <div className="space-y-3 md:space-y-4">
                        <div className="flex items-center gap-2 text-red-600">
                            <AlertCircle className="h-5 w-5 flex-shrink-0" />
                            <h2 className="text-lg font-semibold">Tâches en retard</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                            {overdueTasks.map(task => (
                                <div
                                    key={task.id}
                                    onClick={() => handleTaskClick(task)}
                                    className="cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    <div className="bg-red-50 rounded-xl p-1">
                                        <TaskCard
                                            task={task}
                                            onDelete={() => handleDeleteClick(task)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Tâches du jour */}
                <div className="space-y-3 md:space-y-4">
                    <div className="flex items-center gap-2 text-gray-900">
                        <Clock className="h-5 w-5 flex-shrink-0" />
                        <h2 className="text-lg font-semibold">Tâches du jour</h2>
                    </div>
                    {todayTasks.length === 0 ? (
                        <div className="bg-white rounded-xl p-8 text-center">
                            <p className="text-gray-500">
                                Aucune tâche prévue pour aujourd'hui
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                            {todayTasks.map(task => (
                                <div
                                    key={task.id}
                                    onClick={() => handleTaskClick(task)}
                                    className="cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    <TaskCard
                                        task={task}
                                        onDelete={() => handleDeleteClick(task)}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedTask(null);
                }}
                title="Modifier la tâche"
            >
                <div className="max-h-[calc(100vh-12rem)] overflow-y-auto">
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
                </div>
            </Modal>

            <ConfirmModal
                isOpen={!!taskToDelete}
                onClose={() => setTaskToDelete(null)}
                onConfirm={handleConfirmDelete}
                title="Supprimer la tâche"
                message={`Êtes-vous sûr de vouloir supprimer la tâche "${taskToDelete?.name}" ? Cette action est irréversible.`}
            />
        </>
    );
};

export default DashboardWidgets;
