import { useState, useEffect, useMemo } from 'react';
import { Task, TaskFormData, Category, TaskPriority, TaskStatus } from '../../features/tasks/types';
import { fetchTasks, createTask, updateTask, deleteTask, fetchCategories } from '../../features/tasks/api';
import TaskCard from '../../components/tasks/TaskCard';
import Modal from '../../components/common/Modal';
import ConfirmModal from '../../components/common/ConfirmModal';
import TaskForm from '../../components/tasks/TaskForm';
import TaskFilters from '../../components/tasks/TaskFilters';
import { Plus, Search } from 'lucide-react';
import { Button } from '../../components/common/Button';

const ListView = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreateMode, setIsCreateMode] = useState(false);
    const [filters, setFilters] = useState({
        categories: [] as string[],
        status: [] as TaskStatus[],
        priority: [] as TaskPriority[],
        sortBy: 'date' as 'date' | 'priority' | 'status' | 'name',
        sortOrder: 'desc' as 'asc' | 'desc'
    });

    useEffect(() => {
        loadTasks();
        loadCategories();
    }, []);

    const loadTasks = async () => {
        setIsLoading(true);
        const { data } = await fetchTasks();
        if (data) {
            setTasks(data);
        }
        setIsLoading(false);
    };

    const loadCategories = async () => {
        const { data } = await fetchCategories();
        if (data) {
            setCategories(data);
        }
    };

    const handleTaskClick = (task: Task) => {
        setSelectedTask(task);
        setIsCreateMode(false);
        setIsModalOpen(true);
    };

    const handleCreateClick = () => {
        setSelectedTask(null);
        setIsCreateMode(true);
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
        if (isCreateMode) {
            await createTask(taskData);
        } else if (selectedTask) {
            await updateTask(selectedTask.id, taskData);
        }

        setIsModalOpen(false);
        setSelectedTask(null);
        loadTasks();
    };

    const filteredAndSortedTasks = useMemo(() => {
        let filtered = tasks.filter(task => {
            // Filtre par recherche
            const matchesSearch = task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                task.description?.toLowerCase().includes(searchQuery.toLowerCase());

            // Filtre par catégorie
            const matchesCategory = filters.categories.length === 0 ||
                (task.category_id && filters.categories.includes(task.category_id));

            // Filtre par statut
            const matchesStatus = filters.status.length === 0 ||
                filters.status.includes(task.status);

            // Filtre par priorité
            const matchesPriority = filters.priority.length === 0 ||
                filters.priority.includes(task.priority);

            return matchesSearch && matchesCategory && matchesStatus && matchesPriority;
        });

        // Tri
        return [...filtered].sort((a, b) => {
            let comparison = 0;
            switch (filters.sortBy) {
                case 'date':
                    comparison = (a.due_date?.getTime() || 0) - (b.due_date?.getTime() || 0);
                    break;
                case 'priority': {
                    const priorityOrder = { low: 0, medium: 1, high: 2, urgent: 3 };
                    comparison = (priorityOrder[a.priority] || 0) - (priorityOrder[b.priority] || 0);
                    break;
                }
                case 'status': {
                    const statusOrder = { todo: 0, in_progress: 1, done: 2 };
                    comparison = (statusOrder[a.status] || 0) - (statusOrder[b.status] || 0);
                    break;
                }
                case 'name':
                    comparison = a.name.localeCompare(b.name);
                    break;
            }
            return filters.sortOrder === 'desc' ? -comparison : comparison;
        });
    }, [tasks, searchQuery, filters]);

    if (isLoading) {
        return <div className="flex justify-center items-center h-48">Chargement...</div>;
    }

    return (
        <div className="container mx-auto p-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Toutes les tâches</h1>
                <Button
                    onClick={handleCreateClick}
                    className="w-full sm:w-auto"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    <span className="whitespace-nowrap">Nouvelle tâche</span>
                </Button>
            </div>

            {/* Filtres */}
            <TaskFilters
                filters={filters}
                onFiltersChange={setFilters}
                categories={categories}
            />

            {/* Barre de recherche */}
            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                    type="text"
                    placeholder="Rechercher une tâche..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
            </div>

            {/* Liste des tâches */}
            {filteredAndSortedTasks.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                    <p className="text-gray-500 mb-2">Aucune tâche trouvée</p>
                    <p className="text-sm text-gray-400">Modifiez vos filtres ou créez une nouvelle tâche</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                    {filteredAndSortedTasks.map(task => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onClick={() => handleTaskClick(task)}
                            onDelete={handleDeleteClick}
                        />
                    ))}
                </div>
            )}

            {/* Modal de création/édition */}
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

export default ListView;