import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useBoardStore } from '@/store/boardStore';
import { Column as ColumnType, Task } from '@/types';
import { Button } from '@/components/common/Button';
import { DraggableTaskCard } from './DraggableTaskCard';

interface DraggableColumnProps {
    column: ColumnType;
    boardId: string;
    isDragOverlay?: boolean;
    onCreateTask?: (columnId: string) => void;
    onEditTask?: (task: Task) => void;
}

export const DraggableColumn = ({ column, boardId, isDragOverlay = false, onCreateTask, onEditTask }: DraggableColumnProps) => {
    const { deleteColumn, updateColumn, getFilteredTasks } = useBoardStore();
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(column.title);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: column.id,
        data: {
            type: 'column',
            column,
        },
        disabled: isDragOverlay,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const filteredTasks = getFilteredTasks(column.tasks);

    const handleDeleteColumn = () => {
        if (window.confirm('Are you sure you want to delete this column? All tasks in this column will be lost.')) {
            deleteColumn(column.id);
        }
    };

    const handleSaveTitle = () => {
        if (editTitle.trim() && editTitle.trim() !== column.title) {
            updateColumn(column.id, { title: editTitle.trim() });
        }
        setIsEditing(false);
    };

    const handleCancelEdit = () => {
        setEditTitle(column.title);
        setIsEditing(false);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSaveTitle();
        } else if (e.key === 'Escape') {
            handleCancelEdit();
        }
    };

    if (isDragOverlay) {
        return (
            <div className="flex-shrink-0 w-80 bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-gray-200 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                        {column.title}
                    </h3>
                    <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                        {column.tasks.length}
                    </span>
                </div>
                <div className="space-y-3 mb-4 max-h-96 overflow-hidden">
                    {filteredTasks.slice(0, 3).map((task) => (
                        <DraggableTaskCard
                            key={task.id}
                            task={task}
                            boardId={boardId}
                            columnId={column.id}
                            isDragOverlay
                        />
                    ))}
                    {filteredTasks.length > 3 && (
                        <div className="text-center text-gray-500 text-sm">
                            +{filteredTasks.length - 3} more tasks
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`flex-shrink-0 w-80 bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-gray-200 shadow-md transition-all ${isDragging ? 'opacity-50 rotate-3 shadow-2xl' : 'hover:shadow-lg'
                }`}
        >
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center flex-1">
                    {isEditing ? (
                        <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onBlur={handleSaveTitle}
                            onKeyDown={handleKeyPress}
                            className="text-lg font-semibold bg-transparent border-b border-gray-400 focus:border-primary-300 outline-none flex-1 mr-2 text-gray-800 placeholder-gray-500"
                            autoFocus
                        />
                    ) : (
                        <>
                            <div
                                {...attributes}
                                {...listeners}
                                className="cursor-grab active:cursor-grabbing mr-2 p-1 hover:bg-gray-200 rounded transition-colors"
                                title="Drag to reorder column"
                            >
                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                                </svg>
                            </div>
                            <h3
                                className="text-lg font-semibold text-gray-800 cursor-pointer hover:text-primary-600 flex-1"
                                onClick={() => setIsEditing(true)}
                                title="Click to edit column title"
                            >
                                {column.title}
                            </h3>
                        </>
                    )}
                </div>
                <div className="flex items-center space-x-1">
                    <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                        {column.tasks.length}
                    </span>
                    <button
                        onClick={handleDeleteColumn}
                        className="text-gray-500 hover:text-red-500 p-1 transition-colors"
                        title="Delete column"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>

            <div
                className="space-y-3 mb-4 max-h-96 overflow-y-auto min-h-[100px]"
                data-type="column"
                data-column-id={column.id}
            >
                <SortableContext
                    items={filteredTasks.map(t => t.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {filteredTasks.map((task) => (
                        <DraggableTaskCard
                            key={task.id}
                            task={task}
                            boardId={boardId}
                            columnId={column.id}
                            onEditTask={onEditTask}
                        />
                    ))}
                </SortableContext>

                {filteredTasks.length === 0 && column.tasks.length === 0 && (
                    <div className="text-center py-8 text-gray-500 text-sm">
                        No tasks yet. Add your first task!
                    </div>
                )}
                {filteredTasks.length === 0 && column.tasks.length > 0 && (
                    <div className="text-center py-8 text-gray-500 text-sm">
                        No tasks match the current filters.
                    </div>
                )}
            </div>

            <Button
                //variant="outline"
                size="sm"
                onClick={() => onCreateTask?.(column.id)}
                className="w-full"
                variant="ghost"
                disabled={isDragging}
            >
                + Add Task
            </Button>
        </div>
    );
};
