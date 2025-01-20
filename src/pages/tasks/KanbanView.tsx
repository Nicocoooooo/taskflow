import { useState, useEffect } from 'react';
import { Task, TaskFormData, TaskStatus, Category } from '../../features/tasks/types';
import { fetchTasks, updateTask, createTask, fetchCategories, deleteTask } from '../../features/tasks/api';
import TaskCard from '../../components/tasks/TaskCard';
import Modal from '../../components/common/Modal';
import ConfirmModal from '../../components/common/ConfirmModal';
import TaskForm from '../../components/tasks/TaskForm';
import KanbanFilters from '../../components/tasks/KanbanFilters';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Button } from '../../components/common/Button';

const COLUMNS: { id: TaskStatus; title: string }[] = [
    { id: 'todo', title: 'À faire' },
    { id: 'in_progress', title: 'En cours' },
    { id: 'done', title: 'Terminé' }
];

const KanbanView = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreateMode, setIsCreateMode] = useState(false);
    const [activeColumn, setActiveColumn] = useState<TaskStatus>('todo');

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            const [tasksResponse, categoriesResponse] = await Promise.all([
                fetchTasks(),
                fetchCategories()
            ]);
            if (tasksResponse.data) setTasks(tasksResponse.data);
            if (categoriesResponse.data) setCategories(categoriesResponse.data);
            setIsLoading(false);
        };
        loadData();
    }, []);

    const handleTaskClick = (task: Task) => {
        setSelectedTask(task);
        setIsCreateMode(false);
        setIsModalOpen(true);
    };

    const handleCreateClick = (status: TaskStatus) => {
        setSelectedTask({ status, category_id: selectedCategory } as Task);
        setIsCreateMode(true);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (task: Task) => {
        setTaskToDelete(task);
    };

    const handleConfirmDelete = async () => {
        if (taskToDelete) {
            await deleteTask(taskToDelete.id);
            const { data } = await fetchTasks();
            if (data) setTasks(data);
            setTaskToDelete(null);
        }
    };

    const handleSubmit = async (taskData: TaskFormData) => {
        if (isCreateMode) {
            await createTask(taskData);
        } else if (selectedTask) {
            await updateTask(selectedTask.id, taskData);
        }
        const { data } = await fetchTasks();
        if (data) setTasks(data);
        setIsModalOpen(false);
        setSelectedTask(null);
    };

    const handleDragEnd = async (result: any) => {
        if (!result.destination) return;

        const sourceStatus = result.source.droppableId;
        const destinationStatus = result.destination.droppableId;
        const taskId = result.draggableId;

        if (sourceStatus === destinationStatus) return;

        const task = tasks.find(t => t.id === taskId);
        if (!task) return;

        const updatedTask = {
            ...task,
            status: destinationStatus as TaskStatus
        };

        try {
            await updateTask(taskId, updatedTask);
            const { data } = await fetchTasks();
            if (data) setTasks(data);
        } catch (error) {
            console.error('Error updating task status:', error);
        }
    };

    // Navigation mobile entre les colonnes
    const handlePreviousColumn = () => {
        const currentIndex = COLUMNS.findIndex(col => col.id === activeColumn);
        if (currentIndex > 0) {
            setActiveColumn(COLUMNS[currentIndex - 1].id);
        }
    };

    const handleNextColumn = () => {
        const currentIndex = COLUMNS.findIndex(col => col.id === activeColumn);
        if (currentIndex < COLUMNS.length - 1) {
            setActiveColumn(COLUMNS[currentIndex + 1].id);
        }
    };

    // Filtrage des tâches par catégorie
    const filteredTasks = tasks.filter(task =>
        !selectedCategory || task.category_id && task.category_id.toString() === selectedCategory.toString()
    );

    // Grouper les tâches par statut
    const getTasksByStatus = (status: TaskStatus) =>
        filteredTasks.filter(task => task.status === status);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-48">
                <div className="text-gray-500">Chargement...</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 sm:px-6 lg:px-8">
            {/* Header avec titre et filtre */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Tableau Kanban</h1>
                <KanbanFilters
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                    categories={categories}
                />
            </div>

            {/* Navigation mobile entre colonnes */}
            <div className="flex items-center justify-between mb-4 md:hidden">
                <Button
                    variant="ghost"
                    onClick={handlePreviousColumn}
                    disabled={activeColumn === 'todo'}
                    className="p-2"
                >
                    <ChevronLeft className="h-5 w-5" />
                </Button>
                <span className="font-medium">
                    {COLUMNS.find(col => col.id === activeColumn)?.title}
                </span>
                <Button
                    variant="ghost"
                    onClick={handleNextColumn}
                    disabled={activeColumn === 'done'}
                    className="p-2"
                >
                    <ChevronRight className="h-5 w-5" />
                </Button>
            </div>

            {/* Colonnes Kanban */}
            <DragDropContext onDragEnd={handleDragEnd}>
                <div className="grid md:grid-cols-3 gap-4 md:gap-6">
                    {COLUMNS.map(column => {
                        const columnTasks = getTasksByStatus(column.id);
                        const isVisible = column.id === activeColumn;

                        return (
                            <div
                                key={column.id}
                                className={`bg-gray-50 rounded-xl p-4 ${!isVisible ? 'hidden md:block' : ''}`}
                            >
                                {/* En-tête de colonne */}
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-medium text-gray-900">
                                        {column.title}
                                        <span className="ml-2 text-sm text-gray-500">
                                            ({columnTasks.length})
                                        </span>
                                    </h2>
                                    <button
                                        onClick={() => handleCreateClick(column.id)}
                                        className="p-2 hover:bg-gray-200 rounded-xl transition-colors"
                                        title={`Ajouter une tâche dans ${column.title}`}
                                    >
                                        <Plus className="h-5 w-5 text-gray-600" />
                                    </button>
                                </div>

                                {/* Zone de drop */}
                                <Droppable droppableId={column.id}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            className={`space-y-3 min-h-[50vh] md:min-h-[70vh] p-2 rounded-lg transition-colors ${snapshot.isDraggingOver
                                                    ? 'bg-violet-50 border-2 border-dashed border-violet-200'
                                                    : ''
                                                }`}
                                        >
                                            {columnTasks.map((task, index) => (
                                                <Draggable
                                                    key={task.id}
                                                    draggableId={task.id.toString()}
                                                    index={index}
                                                >
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            style={{
                                                                ...provided.draggableProps.style,
                                                                transform: snapshot.isDragging
                                                                    ? provided.draggableProps.style?.transform
                                                                    : 'none',
                                                            }}
                                                            className={`${snapshot.isDragging
                                                                    ? 'rotate-2 scale-105'
                                                                    : ''
                                                                } cursor-grab active:cursor-grabbing touch-manipulation`}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleTaskClick(task);
                                                            }}
                                                        >
                                                            <TaskCard
                                                                task={task}
                                                                onDelete={() => handleDeleteClick(task)}
                                                            />
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        );
                    })}
                </div>
            </DragDropContext>

            {/* Modals */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedTask(null);
                }}
                title={isCreateMode ? "Nouvelle tâche" : "Modifier la tâche"}
            >
                <div className="max-h-[calc(100vh-12rem)] overflow-y-auto">
                    <TaskForm
                        initialData={selectedTask || undefined}
                        onSubmit={handleSubmit}
                        onCancel={() => {
                            setIsModalOpen(false);
                            setSelectedTask(null);
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

export default KanbanView;