import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBoardStore } from '@/store/boardStore';
import { Button } from '@/components/common/Button';
import { Input } from '../common/Input';

interface CreateBoardModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CreateBoardModal = ({ isOpen, onClose }: CreateBoardModalProps) => {
    const navigate = useNavigate();
    const { createBoard } = useBoardStore();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title.trim()) return;

        setIsLoading(true);
        try {
            const newBoard = createBoard({
                title: formData.title.trim(),
                description: formData.description.trim(),
            });

            // Reset form and close modal
            setFormData({ title: '', description: '' });
            onClose();

            // Navigating to the new board
            navigate(`/boards/${newBoard.id}`);
        } catch (error) {
            console.error('Error creating board:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        if (!isLoading) {
            setFormData({ title: '', description: '' });
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
                                    Create New Board
                                </h3>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Enter title
                                    </label>
                                    <Input
                                        // label="Board Title"
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="Enter board title"
                                        required
                                        autoFocus
                                    />

                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description (Optional)
                                    </label>
                                    <textarea
                                        className="textarea"
                                        rows={3}
                                        value={formData.description}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Enter board description"
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
                            disabled={!formData.title.trim()}
                            className="w-full sm:ml-3 sm:w-auto"
                        >
                            Create Board
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
