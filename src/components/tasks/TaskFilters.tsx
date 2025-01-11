import { Category, TaskPriority, TaskStatus } from '../../features/tasks/types';
import { ChevronDown } from 'lucide-react';
import { SelectHTMLAttributes, ReactNode } from 'react';

interface TaskFilters {
    categories: string[];
    status: TaskStatus[];
    priority: TaskPriority[];
    sortBy: 'date' | 'priority' | 'status' | 'name';
    sortOrder: 'asc' | 'desc';
}

interface TaskFiltersProps {
    filters: TaskFilters;
    onFiltersChange: (filters: TaskFilters) => void;
    categories: Category[];
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    children: ReactNode;
}

const Select = ({ children, ...props }: SelectProps) => (
    <div className="relative">
        <select
            {...props}
            className="appearance-none w-full px-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
        >
            {children}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
    </div>
);

const TaskFilters = ({ filters, onFiltersChange, categories }: TaskFiltersProps) => {
    return (
        <div className="p-6 mb-6 space-y-4 rounded-xl bg-gray-50 border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {/* Filtre par catégorie */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Catégories
                    </label>
                    <Select
                        value={filters.categories[0] || ''}
                        onChange={(e) => {
                            const value = e.target.value;
                            onFiltersChange({ ...filters, categories: value ? [value] : [] });
                        }}
                    >
                        <option value="">Toutes les catégories</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </Select>
                </div>

                {/* Filtre par statut */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Statut
                    </label>
                    <Select
                        value={filters.status[0] || ''}
                        onChange={(e) => {
                            const value = e.target.value as TaskStatus;
                            onFiltersChange({ ...filters, status: value ? [value] : [] });
                        }}
                    >
                        <option value="">Tous les statuts</option>
                        <option value="todo">À faire</option>
                        <option value="in_progress">En cours</option>
                        <option value="done">Terminé</option>
                    </Select>
                </div>

                {/* Filtre par priorité */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Priorité
                    </label>
                    <Select
                        value={filters.priority[0] || ''}
                        onChange={(e) => {
                            const value = e.target.value as TaskPriority;
                            onFiltersChange({ ...filters, priority: value ? [value] : [] });
                        }}
                    >
                        <option value="">Toutes les priorités</option>
                        <option value="low">Basse</option>
                        <option value="medium">Moyenne</option>
                        <option value="high">Haute</option>
                        <option value="urgent">Urgente</option>
                    </Select>
                </div>

                {/* Tri par */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Trier par
                    </label>
                    <Select
                        value={filters.sortBy}
                        onChange={(e) => {
                            onFiltersChange({
                                ...filters,
                                sortBy: e.target.value as 'date' | 'priority' | 'status' | 'name'
                            });
                        }}
                    >
                        <option value="date">Date</option>
                        <option value="priority">Priorité</option>
                        <option value="status">Statut</option>
                        <option value="name">Nom</option>
                    </Select>
                </div>

                {/* Ordre de tri */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ordre
                    </label>
                    <Select
                        value={filters.sortOrder}
                        onChange={(e) => {
                            onFiltersChange({
                                ...filters,
                                sortOrder: e.target.value as 'asc' | 'desc'
                            });
                        }}
                    >
                        <option value="asc">Croissant</option>
                        <option value="desc">Décroissant</option>
                    </Select>
                </div>
            </div>
        </div>
    );
};

export default TaskFilters;