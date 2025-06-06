import { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useBoardStore } from '@/store/boardStore';
import { Button } from '@/components/common/Button';
import { DragDropBoard } from '@/components/board/DragDropBoard';
import { CreateColumnModal } from '@/components/board/CreateColumnModal';
import { CreateTaskModal } from '@/components/board/CreateTaskModal';
import { EditTaskModal } from '@/components/board/EditTaskModal';
import { SearchAndFilter } from '@/components/board/SearchAndFilter';
import { Task } from '@/types';

export const BoardDetail = () => {
    const { boardId } = useParams<{ boardId: string }>();
    const { boards, searchFilters, sortOptions, setSearchFilters, setSortOptions, clearFilters } = useBoardStore();
    const [isCreateColumnModalOpen, setIsCreateColumnModalOpen] = useState(false);
    const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
    const [selectedColumnId, setSelectedColumnId] = useState<string>('');
    const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    if (!boardId) {
        return <Navigate to="/boards" replace />;
    }

    const board = boards.find(b => b.id === boardId);

    const handleCreateTask = (columnId: string) => {
        setSelectedColumnId(columnId);
        setIsCreateTaskModalOpen(true);
    };

    const handleCloseTaskModal = () => {
        setIsCreateTaskModalOpen(false);
        setSelectedColumnId('');
    };

    const handleEditTask = (task: Task) => {
        setSelectedTask(task);
        setIsEditTaskModalOpen(true);
    };

    const handleCloseEditTaskModal = () => {
        setIsEditTaskModalOpen(false);
        setSelectedTask(null);
    };

    if (!board) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-800">Board not found</h2>
                <p className="mt-2 text-sm text-gray-600">
                    The board you're looking for doesn't exist or has been deleted.
                </p>
            </div>
        );
    }

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">{board.title}</h1>
                    {board.description && (
                        <p className="mt-2 mb-4 text-sm text-gray-600">{board.description}</p>
                    )}
                </div>
                <div className="mt-4 sm:mt-0">
                    <Button onClick={() => setIsCreateColumnModalOpen(true)}>
                        Add Column
                    </Button>
                </div>
            </div>

            <SearchAndFilter
                filters={searchFilters}
                sortOptions={sortOptions}
                onFiltersChange={setSearchFilters}
                onSortChange={setSortOptions}
                onClear={clearFilters}
            />

            <div className="mt-8">
                <DragDropBoard
                    board={board}
                    onCreateColumn={() => setIsCreateColumnModalOpen(true)}
                    onCreateTask={handleCreateTask}
                    onEditTask={handleEditTask}
                />
            </div>

            <CreateColumnModal
                isOpen={isCreateColumnModalOpen}
                onClose={() => setIsCreateColumnModalOpen(false)}
                boardId={board.id}
            />

            <CreateTaskModal
                isOpen={isCreateTaskModalOpen}
                onClose={handleCloseTaskModal}
                boardId={board.id}
                columnId={selectedColumnId}
            />

            {selectedTask && (
                <EditTaskModal
                    isOpen={isEditTaskModalOpen}
                    onClose={handleCloseEditTaskModal}
                    task={selectedTask}
                    boardId={board.id}
                    columnId={selectedTask.columnId}
                />
            )}
        </div>
    );
};
