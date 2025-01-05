import { TaskFormData, TaskPriority, TaskStatus } from '../../features/tasks/types';
import { Button } from '../common/Button';

interface TaskFormProps {
    initialData?: TaskFormData;
    onSubmit: (data: TaskFormData) => void;
    onCancel: () => void;
}

const TaskForm = ({ initialData, onSubmit, onCancel }: TaskFormProps) => {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const taskData: TaskFormData = {
            name: formData.get('name') as string,
            description: formData.get('description') as string,
            due_date: formData.get('due_date') ? new Date(formData.get('due_date') as string) : undefined,
            estimated_time: formData.get('estimated_time') ? Number(formData.get('estimated_time')) : undefined,
            priority: formData.get('priority') as TaskPriority,
            is_urgent: formData.get('is_urgent') === 'on',
            is_important: formData.get('is_important') === 'on',
            status: formData.get('status') as TaskStatus,
            notes: formData.get('notes') as string,
        };

        onSubmit(taskData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nom de la tâche */}
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Nom de la tâche *
                </label>
                <input
                    type="text"
                    name="name"
                    id="name"
                    defaultValue={initialData?.name}
                    required
                    className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500"
                />
            </div>

            {/* Description */}
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                </label>
                <textarea
                    name="description"
                    id="description"
                    rows={3}
                    defaultValue={initialData?.description}
                    className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500"
                />
            </div>

            {/* Date limite et Temps estimé */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="due_date" className="block text-sm font-medium text-gray-700">
                        Date limite
                    </label>
                    <input
                        type="date"
                        name="due_date"
                        id="due_date"
                        defaultValue={initialData?.due_date?.toISOString().split('T')[0]}
                        className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500"
                    />
                </div>
                <div>
                    <label htmlFor="estimated_time" className="block text-sm font-medium text-gray-700">
                        Temps estimé (minutes)
                    </label>
                    <input
                        type="number"
                        name="estimated_time"
                        id="estimated_time"
                        min="0"
                        defaultValue={initialData?.estimated_time}
                        className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500"
                    />
                </div>
            </div>

            {/* Priorité */}
            <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                    Priorité *
                </label>
                <select
                    name="priority"
                    id="priority"
                    required
                    defaultValue={initialData?.priority}
                    className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500"
                >
                    <option value="low">Basse</option>
                    <option value="medium">Moyenne</option>
                    <option value="high">Haute</option>
                    <option value="urgent">Urgente</option>
                </select>
            </div>

            {/* Statut */}
            <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Statut *
                </label>
                <select
                    name="status"
                    id="status"
                    required
                    defaultValue={initialData?.status}
                    className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500"
                >
                    <option value="todo">À faire</option>
                    <option value="in_progress">En cours</option>
                    <option value="done">Terminée</option>
                </select>
            </div>

            {/* Checkboxes Urgent/Important */}
            <div className="flex gap-6">
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        name="is_urgent"
                        id="is_urgent"
                        defaultChecked={initialData?.is_urgent}
                        className="h-4 w-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                    />
                    <label htmlFor="is_urgent" className="ml-2 text-sm text-gray-700">
                        Urgent
                    </label>
                </div>
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        name="is_important"
                        id="is_important"
                        defaultChecked={initialData?.is_important}
                        className="h-4 w-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                    />
                    <label htmlFor="is_important" className="ml-2 text-sm text-gray-700">
                        Important
                    </label>
                </div>
            </div>

            {/* Notes */}
            <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                    Notes
                </label>
                <textarea
                    name="notes"
                    id="notes"
                    rows={3}
                    defaultValue={initialData?.notes}
                    className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500"
                />
            </div>

            {/* Boutons d'action */}
            <div className="flex justify-end gap-4">
                <Button variant="ghost" onClick={onCancel}>
                    Annuler
                </Button>
                <Button type="submit">
                    {initialData ? 'Modifier' : 'Créer'}
                </Button>
            </div>
        </form>
    );
};

export default TaskForm;