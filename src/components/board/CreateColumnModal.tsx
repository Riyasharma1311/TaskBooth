import { useState } from 'react';
import { useBoardStore } from '@/store/boardStore';
import { Button } from '@/components/common/Button';
import { Input } from '../common/Input';

interface CreateColumnModalProps {
    isOpen: boolean;
    onClose: () => void;
    boardId: string;
}

export const CreateColumnModal = ({ isOpen, onClose, boardId }: CreateColumnModalProps) => {
    const { createColumn } = useBoardStore();
    const [title, setTitle] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        setIsLoading(true);
        try {
            createColumn({ boardId, title: title.trim() });
            setTitle('');
            onClose();
        } catch (error) {
            console.error('Error creating column:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        if (!isLoading) {
            setTitle('');
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <div
                    className="modal-content"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                                    Create New Column
                                </h3>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Enter column title
                                    </label>
                                    <Input
                                        //  label="Column Title"
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Enter column title (e.g., To Do, In Progress, Done)"
                                        required
                                        autoFocus
                                    />
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                        <Button
                            type="submit"
                            onClick={handleSubmit}
                            isLoading={isLoading}
                            disabled={!title.trim()}
                            className="w-full sm:ml-3 sm:w-auto"
                        >
                            Create Column
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
