// src/pages/tasks/ListView.tsx
import { useState, useEffect, useMemo } from 'react';
import { Task, TaskFormData, Category, TaskPriority, TaskStatus } from '../../features/tasks/types';
import { fetchTasks, createTask, updateTask, fetchCategories } from '../../features/tasks/api';
import TaskCard from '../../components/tasks/TaskCard';
import Modal from '../../components/common/Modal';
import TaskForm from '../../components/tasks/TaskForm';
import TaskFilters from '../../components/tasks/TaskFilters';
import { Plus, Search } from 'lucide-react';

const ListView = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
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
            const matchesSearch =
                task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">Toutes les tâches</h1>
                <button
                    onClick={handleCreateClick}
                    className="inline-flex items-center gap-2 bg-violet-600 text-white px-4 py-2 rounded-xl hover:bg-violet-700 transition-colors"
                >
                    <Plus className="h-5 w-5" />
                    Nouvelle tâche
                </button>
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
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
            </div>

            {/* Liste des tâches */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredAndSortedTasks.map(task => (
                    <div key={task.id} onClick={() => handleTaskClick(task)}>
                        <TaskCard task={task} />
                    </div>
                ))}
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

export default ListView;