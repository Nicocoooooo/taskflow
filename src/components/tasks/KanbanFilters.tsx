import { Category } from '../../features/tasks/types';
import { ChevronDown } from 'lucide-react';

interface KanbanFiltersProps {
    selectedCategory: string | null;
    onCategoryChange: (categoryId: string | null) => void;
    categories: Category[];
}

const KanbanFilters = ({ selectedCategory, onCategoryChange, categories }: KanbanFiltersProps) => {
    return (
        <div className="relative inline-block">
            <select
                value={selectedCategory || ''}
                onChange={(e) => onCategoryChange(e.target.value || null)}
                className="appearance-none w-64 px-4 py-2 pr-10 bg-white border border-gray-200 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent hover:border-gray-300 transition-colors"
            >
                <option value="">Toutes les catégories</option>
                {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                        {category.name}
                    </option>
                ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
        </div>
    );
};

export default KanbanFilters;