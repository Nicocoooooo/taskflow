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
        <div className={`p-4 border-b ${color}`}>
            <div className="font-medium text-sm text-gray-600 mb-1">{title}</div>
            <h3 className="font-semibold text-xl text-gray-900">{subtitle}</h3>
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
        <div className={`p-4 h-full ${bgColor}`}>
            <div className="space-y-2">
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
                className="mt-4 w-full flex items-center justify-center gap-2 p-2 rounded-xl border-2 border-dashed border-gray-300 text-gray-500 hover:border-violet-300 hover:text-violet-500 transition-colors"
            >
                <Plus className="h-4 w-4" />
                Ajouter une tâche
            </button>
        </div>
    );

    if (isLoading) {
        return <div className="flex justify-center items-center h-48">Chargement...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">Matrice d'Eisenhower</h1>

            <div className="grid grid-cols-2 gap-4 h-[calc(100vh-200px)]">
                {/* Important & Non Urgent (2) - PLANIFIER */}
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col">
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
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col">
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
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col">
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
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col">
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

            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedTask(null);
                    setSelectedQuadrant(null);
                }}
                title={selectedTask ? "Modifier la tâche" : "Nouvelle tâche"}
            >
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