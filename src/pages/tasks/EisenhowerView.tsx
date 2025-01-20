import React, { useState, useEffect } from 'react';
import { Task, TaskFormData } from '../../features/tasks/types';
import { fetchTasks, createTask, updateTask, deleteTask } from '../../features/tasks/api';
import MiniTaskCard from '../../components/tasks/MiniTaskCard';
import Modal from '../../components/common/Modal';
import ConfirmModal from '../../components/common/ConfirmModal';
import TaskForm from '../../components/tasks/TaskForm';
import { Plus } from 'lucide-react';

const EisenhowerView: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedQuadrant, setSelectedQuadrant] = useState<{
        urgent: boolean;
        important: boolean;
    } | null>(null);

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

    const filterTasksByQuadrant = (urgent: boolean, important: boolean) => {
        return tasks.filter(task => task.is_urgent === urgent && task.is_important === important);
    };

    const handleTaskClick = (task: Task) => {
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    const handleAddClick = (urgent: boolean, important: boolean) => {
        setSelectedTask(null);
        setSelectedQuadrant({ urgent, important });
        setIsModalOpen(true);
    };

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

    const handleSubmit = async (taskData: TaskFormData) => {
        if (selectedTask) {
            await updateTask(selectedTask.id, taskData);
        } else if (selectedQuadrant) {
            const newTask = {
                ...taskData,
                is_urgent: selectedQuadrant.urgent,
                is_important: selectedQuadrant.important,
            };
            await createTask(newTask);
        }

        setIsModalOpen(false);
        setSelectedTask(null);
        setSelectedQuadrant(null);
        loadTasks();
    };

    const QuadrantHeader = ({ title, subtitle, color }: { title: string; subtitle: string; color: string }) => (
        <div className={`p-3 sm:p-4 border-b ${color}`}>
            <div className="font-medium text-xs sm:text-sm text-gray-600 mb-1">{title}</div>
            <h3 className="font-semibold text-lg sm:text-xl text-gray-900">{subtitle}</h3>
        </div>
    );

    const QuadrantContent = ({
        tasks,
        onTaskClick,
        onAddClick,
        onDelete,
        bgColor,
    }: {
        tasks: Task[];
        onTaskClick: (task: Task) => void;
        onAddClick: () => void;
        onDelete: (task: Task) => void;
        bgColor: string;
    }) => (
        <div className={`p-3 sm:p-4 h-full ${bgColor}`}>
            <div className="space-y-2 max-h-[250px] sm:max-h-none overflow-y-auto">
                {tasks.map(task => (
                    <MiniTaskCard
                        key={task.id}
                        task={task}
                        onClick={() => onTaskClick(task)}
                        onDelete={onDelete}
                    />
                ))}
            </div>
            <button
                onClick={onAddClick}
                className="mt-3 sm:mt-4 w-full flex items-center justify-center gap-2 p-2 rounded-xl border-2 border-dashed border-gray-300 text-gray-500 hover:border-violet-300 hover:text-violet-500 transition-colors"
            >
                <Plus className="h-4 w-4" />
                <span className="text-sm">Ajouter une tâche</span>
            </button>
        </div>
    );

    if (isLoading) {
        return <div className="flex justify-center items-center h-48">Chargement...</div>;
    }

    return (
        <div className="container mx-auto p-4 sm:px-6 lg:px-8">
            {/* En-tête adaptative */}
            <div className="mb-4 sm:mb-6">
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Matrice d'Eisenhower</h1>
                <p className="mt-1 text-sm text-gray-500 hidden sm:block">
                    Organisez vos tâches selon leur urgence et leur importance
                </p>
            </div>

            {/* Instructions mobile */}
            <div className="sm:hidden mb-4 text-sm text-gray-500">
                Faites défiler chaque quadrant verticalement pour voir toutes les tâches
            </div>

            {/* Grille responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 h-[calc(100vh-11rem)] sm:h-[calc(100vh-12rem)]">
                {/* Important & Non Urgent (2) - PLANIFIER */}
                <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 overflow-hidden flex flex-col">
                    <QuadrantHeader
                        title="Important mais pas urgent (2)"
                        subtitle="PLANIFIER"
                        color="border-orange-200"
                    />
                    <QuadrantContent
                        tasks={filterTasksByQuadrant(false, true)}
                        onTaskClick={handleTaskClick}
                        onAddClick={() => handleAddClick(false, true)}
                        onDelete={handleDeleteClick}
                        bgColor="bg-orange-50/50"
                    />
                </div>

                {/* Urgent & Important (1) - FAIRE */}
                <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 overflow-hidden flex flex-col">
                    <QuadrantHeader
                        title="Urgent et important (1)"
                        subtitle="FAIRE"
                        color="border-red-200"
                    />
                    <QuadrantContent
                        tasks={filterTasksByQuadrant(true, true)}
                        onTaskClick={handleTaskClick}
                        onAddClick={() => handleAddClick(true, true)}
                        onDelete={handleDeleteClick}
                        bgColor="bg-red-50/50"
                    />
                </div>

                {/* Non Urgent & Non Important (4) - ÉLIMINER */}
                <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 overflow-hidden flex flex-col">
                    <QuadrantHeader
                        title="Ni urgent ni important (4)"
                        subtitle="ÉLIMINER"
                        color="border-gray-200"
                    />
                    <QuadrantContent
                        tasks={filterTasksByQuadrant(false, false)}
                        onTaskClick={handleTaskClick}
                        onAddClick={() => handleAddClick(false, false)}
                        onDelete={handleDeleteClick}
                        bgColor="bg-gray-50/50"
                    />
                </div>

                {/* Urgent & Non Important (3) - DÉLÉGUER */}
                <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 overflow-hidden flex flex-col">
                    <QuadrantHeader
                        title="Urgent mais pas important (3)"
                        subtitle="DÉLÉGUER"
                        color="border-green-200"
                    />
                    <QuadrantContent
                        tasks={filterTasksByQuadrant(true, false)}
                        onTaskClick={handleTaskClick}
                        onAddClick={() => handleAddClick(true, false)}
                        onDelete={handleDeleteClick}
                        bgColor="bg-green-50/50"
                    />
                </div>
            </div>

            {/* Modals */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedTask(null);
                    setSelectedQuadrant(null);
                }}
                title={selectedTask ? "Modifier la tâche" : "Nouvelle tâche"}
            >
                <div className="max-h-[calc(100vh-12rem)] overflow-y-auto">
                    <TaskForm
                        initialData={selectedTask || {
                            name: '',
                            description: '',
                            priority: 'medium',
                            status: 'todo',
                            is_urgent: selectedQuadrant?.urgent || false,
                            is_important: selectedQuadrant?.important || false,
                        } as TaskFormData}
                        onSubmit={handleSubmit}
                        onCancel={() => {
                            setIsModalOpen(false);
                            setSelectedTask(null);
                            setSelectedQuadrant(null);
                        }}
                    />
                </div>
            </Modal>

            <ConfirmModal
                isOpen={!!taskToDelete}
                onClose={() => setTaskToDelete(null)}
                onConfirm={handleConfirmDelete}
                title="Supprimer la tâche"
                message={`Êtes-vous sûr de vouloir supprimer la tâche "${taskToDelete?.name}" ? Cette action est irréversible.`}
            />
        </div>
    );
};

export default EisenhowerView;