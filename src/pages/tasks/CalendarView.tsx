import React, { useState, useEffect } from 'react';
import { addWeeks, subWeeks } from 'date-fns';
import { Task, TaskFormData, TaskPriority, TaskStatus } from '../../features/tasks/types';
import { fetchTasks, createTask, updateTask, deleteTask } from '../../features/tasks/api';
import CalendarHeader from '../../pages/tasks/CalendarHeader';
import CalendarGrid from '../../pages/tasks/CalendarGrid';
import Modal from '../../components/common/Modal';
import ConfirmModal from '../../components/common/ConfirmModal';
import TaskForm from '../../components/tasks/TaskForm';

const CalendarView: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
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

    const handlePreviousWeek = () => {
        setCurrentDate(prev => subWeeks(prev, 1));
    };

    const handleNextWeek = () => {
        setCurrentDate(prev => addWeeks(prev, 1));
    };

    const handleThisWeek = () => {
        setCurrentDate(new Date());
    };

    const handleDateClick = (date: Date) => {
        setSelectedDate(date);
        setIsCreateMode(true);
        setSelectedTask(null);
        setIsModalOpen(true);
    };

    const handleTaskClick = (task: Task) => {
        setSelectedTask(task);
        setIsCreateMode(false);
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

    const getInitialData = (): TaskFormData | undefined => {
        if (selectedTask) {
            return selectedTask;
        }
        if (selectedDate) {
            return {
                name: '',
                description: '',
                due_date: selectedDate,
                estimated_time: undefined,
                priority: 'medium' as TaskPriority,
                is_urgent: false,
                is_important: false,
                category_id: undefined,
                status: 'todo' as TaskStatus,
                notes: ''
            };
        }
        return undefined;
    };

    const handleSubmit = async (taskData: TaskFormData) => {
        if (isCreateMode) {
            await createTask(taskData);
        } else if (selectedTask) {
            await updateTask(selectedTask.id, taskData);
        }

        setIsModalOpen(false);
        setSelectedTask(null);
        setSelectedDate(null);
        loadTasks();
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-48">Chargement...</div>;
    }

    return (
        <div className="container mx-auto p-4 sm:px-6 lg:px-8">
            {/* Instruction de défilement sur mobile */}
            <div className="block sm:hidden mb-4 text-center">
                <p className="text-sm text-gray-500">
                    Faites défiler horizontalement pour voir toute la semaine
                </p>
            </div>

            {/* En-tête */}
            <CalendarHeader
                currentDate={currentDate}
                onPreviousWeek={handlePreviousWeek}
                onNextWeek={handleNextWeek}
                onThisWeek={handleThisWeek}
            />

            {/* Grille du calendrier avec scrollbar sur mobile */}
            <div className="relative">
                <CalendarGrid
                    currentDate={currentDate}
                    tasks={tasks}
                    onDateClick={handleDateClick}
                    onTaskClick={handleTaskClick}
                    onTaskDelete={handleDeleteClick}
                />

                {/* Indicateurs de défilement sur mobile */}
                <div className="absolute inset-y-0 -left-4 w-4 bg-gradient-to-r from-white to-transparent sm:hidden" />
                <div className="absolute inset-y-0 -right-4 w-4 bg-gradient-to-l from-white to-transparent sm:hidden" />
            </div>

            {/* Modal de création/édition */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedTask(null);
                    setSelectedDate(null);
                }}
                title={isCreateMode ? "Nouvelle tâche" : "Modifier la tâche"}
            >
                <div className="max-h-[calc(100vh-12rem)] overflow-y-auto">
                    <TaskForm
                        initialData={getInitialData()}
                        onSubmit={handleSubmit}
                        onCancel={() => {
                            setIsModalOpen(false);
                            setSelectedTask(null);
                            setSelectedDate(null);
                        }}
                    />
                </div>
            </Modal>

            {/* Modal de confirmation de suppression */}
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

export default CalendarView;