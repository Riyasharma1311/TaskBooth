import { useState } from 'react';
import { useBoardStore } from '@/store/boardStore';
import { Button } from '@/components/common/Button';
import { Input } from '../common/Input';
import { Task, Priority } from '@/types';
import { MOCK_USERS, PRIORITY_OPTIONS } from '@/utils/constants';

interface EditTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    task: Task;
    boardId: string;
    columnId: string;
}

export const EditTaskModal = ({ isOpen, onClose, task }: EditTaskModalProps) => {
    const { updateTask } = useBoardStore();
    const [formData, setFormData] = useState({
        title: task.title,
        description: task.description,
        priority: task.priority,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        assignedTo: task.assignedTo || '',
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title.trim()) return;

        setIsLoading(true);
        try {
            updateTask({
                id: task.id,
                title: formData.title.trim(),
                description: formData.description.trim(),
                priority: formData.priority,
                dueDate: formData.dueDate ? new Date(formData.dueDate) : task.dueDate,
                assignedTo: formData.assignedTo || task.assignedTo,
            });

            onClose();
        } catch (error) {
            console.error('Error updating task:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        if (!isLoading) {
            // Reseting form to original values
            setFormData({
                title: task.title,
                description: task.description,
                priority: task.priority,
                dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
                assignedTo: task.assignedTo || '',
            });
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <div
                    className="modal-content max-w-md"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                                    Edit Task
                                </h3>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Task Title
                                    </label>
                                    <Input
                                        //  label="Task Title"
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="Enter task title"
                                        required
                                        autoFocus
                                    />

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Description
                                            <span className="text-xs text-gray-500 ml-1">(Markdown supported)</span>
                                        </label>
                                        <textarea
                                            className="textarea"
                                            rows={3}
                                            value={formData.description}
                                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                                setFormData({ ...formData, description: e.target.value })
                                            }
                                            placeholder="Enter task description (supports **bold**, *italic*, [links](url), etc.)"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Priority
                                        </label>
                                        <select
                                            className="select"
                                            value={formData.priority}
                                            onChange={(e) => setFormData({ ...formData, priority: e.target.value as Priority })}
                                        >
                                            {PRIORITY_OPTIONS.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Due Date
                                    </label>
                                    <Input
                                        //   label="Due Date"
                                        type="date"
                                        value={formData.dueDate}
                                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                    />

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Assign To
                                        </label>
                                        <select
                                            className="select"
                                            value={formData.assignedTo}
                                            onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                                        >
                                            <option value="">Select team member</option>
                                            {MOCK_USERS.map((user) => (
                                                <option key={user.id} value={user.id}>
                                                    {user.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                        <Button
                            type="submit"
                            onClick={handleSubmit}
                            isLoading={isLoading}
                            disabled={!formData.title.trim()}
                            className="w-full sm:ml-3 sm:w-auto"
                        >
                            Save Changes
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleClose}
                            disabled={isLoading}
                            className="mt-3 w-full sm:mt-0 sm:w-auto btn-danger"
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
