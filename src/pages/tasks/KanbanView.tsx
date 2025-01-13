import { useState, useEffect } from 'react';
import { Task, TaskFormData, TaskStatus, Category } from '../../features/tasks/types';
import { fetchTasks, updateTask, createTask, fetchCategories } from '../../features/tasks/api';
import TaskCard from '../../components/tasks/TaskCard';
import Modal from '../../components/common/Modal';
import TaskForm from '../../components/tasks/TaskForm';
import KanbanFilters from '../../components/tasks/KanbanFilters';
import { Plus } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreateMode, setIsCreateMode] = useState(false);

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

    // Filtrage des tâches par catégorie
    const filteredTasks = tasks.filter(task =>
        !selectedCategory || task.category_id && task.category_id.toString() === selectedCategory.toString()
    );

    // Grouper les tâches par statut
    const getTasksByStatus = (status: TaskStatus) =>
        filteredTasks.filter(task => task.status === status);

    if (isLoading) {
        return <div className="flex justify-center items-center h-48">Chargement...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header avec titre et filtre */}
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900 mb-4">Tableau Kanban</h1>
                <KanbanFilters
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                    categories={categories}
                />
            </div>

            {/* Colonnes Kanban */}
            <DragDropContext onDragEnd={handleDragEnd}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {COLUMNS.map(column => {
                        const columnTasks = getTasksByStatus(column.id);
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

                                {/* Zone de drop */}
                                <Droppable droppableId={column.id}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            className={`space-y-3 min-h-[200px] p-2 rounded-lg ${snapshot.isDraggingOver ? 'bg-violet-50 border-2 border-dashed border-violet-200' : ''
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
                                                            className={`${snapshot.isDragging ? 'rotate-2 scale-105' : ''
                                                                } cursor-grab active:cursor-grabbing`}
                                                            onClick={() => handleTaskClick(task)}
                                                        >
                                                            <TaskCard task={task} />
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