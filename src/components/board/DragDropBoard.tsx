import { useState } from 'react';
import {
    DndContext,
    DragEndEvent,
    DragOverEvent,
    DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors,
    closestCorners,
    DragOverlay,
} from '@dnd-kit/core';
import {
    SortableContext,

    horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useBoardStore } from '@/store/boardStore';
import { Task, Column as ColumnType } from '@/types';
import { DraggableColumn } from './DraggableColumn';
import { DraggableTaskCard } from './DraggableTaskCard';

interface DragDropBoardProps {
    board: {
        id: string;
        title: string;
        description: string;
        columns: ColumnType[];
    };
    onCreateColumn: () => void;
    onCreateTask?: (columnId: string) => void;
    onEditTask?: (task: Task) => void;
}

/**
 * Main drag-and-drop board component that handles task and column reordering
 * Uses @dnd-kit for smooth drag & drop interactions
 * Supports both task movement between columns and column reordering
 */
export const DragDropBoard = ({ board, onCreateColumn, onCreateTask, onEditTask }: DragDropBoardProps) => {
    const { moveTask, reorderTasks, reorderColumns } = useBoardStore();
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const [activeColumn, setActiveColumn] = useState<ColumnType | null>(null);

    // helps in collision detection
    // Configure drag sensors - requires 8px movement to prevent accidental drags
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const activeData = active.data.current;

        // Store reference to dragged item for overlay display
        if (activeData?.type === 'task') {
            setActiveTask(activeData.task);
        } else if (activeData?.type === 'column') {
            setActiveColumn(activeData.column);
        }
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;

        if (!over) return;

        const activeData = active.data.current;
        const overData = over.data.current;

        // Only handle task movements during drag over (not columns)
        if (activeData?.type !== 'task') return;

        const activeTaskId = active.id as string;
        const overId = over.id as string;

        // Locates the task being dragged and its current column
        let activeTask: Task | null = null;
        let activeColumnId: string = '';

        for (const column of board.columns) {
            const task = column.tasks.find(t => t.id === activeTaskId);
            if (task) {
                activeTask = task;
                activeColumnId = column.id;
                break;
            }
        }

        if (!activeTask) return;

        // Handles dropping over empty column space
        if (overData?.type === 'column') {
            const overColumnId = overId;

            if (activeColumnId !== overColumnId) {
                moveTask(activeTaskId, overColumnId);
            }
            return;
        }

        // Handling dropping over another task
        if (overData?.type === 'task') {
            const overTask = overData.task as Task;
            const overColumnId = overTask.columnId;

            if (activeColumnId === overColumnId) {
                // Reordering tasks within the same column
                const column = board.columns.find(c => c.id === activeColumnId);
                if (column) {
                    const activeIndex = column.tasks.findIndex(t => t.id === activeTaskId);
                    const overIndex = column.tasks.findIndex(t => t.id === overId);

                    if (activeIndex !== overIndex) {
                        reorderTasks(activeColumnId, activeIndex, overIndex);
                    }
                }
            } else {
                // Moving task to a different column at specific position
                const overColumn = board.columns.find(c => c.id === overColumnId);
                if (overColumn) {
                    const overIndex = overColumn.tasks.findIndex(t => t.id === overId);
                    moveTask(activeTaskId, overColumnId, overIndex);
                }
            }
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        // Cleaning overlay states
        setActiveTask(null);
        setActiveColumn(null);

        if (!over) return;

        const activeData = active.data.current;
        const overData = over.data.current;

        // Handle column reordering (task movements are handled in handleDragOver)
        if (activeData?.type === 'column' && overData?.type === 'column') {
            const activeIndex = board.columns.findIndex(c => c.id === active.id);
            const overIndex = board.columns.findIndex(c => c.id === over.id);

            if (activeIndex !== overIndex) {
                reorderColumns(board.id, activeIndex, overIndex);
            }
        }
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <div className="flex space-x-6 overflow-x-auto pb-4">
                <SortableContext
                    items={board.columns.map(c => c.id)}
                    strategy={horizontalListSortingStrategy}
                >
                    {board.columns.map((column) => (
                        <DraggableColumn
                            key={column.id}
                            column={column}
                            boardId={board.id}
                            onCreateTask={onCreateTask}
                            onEditTask={onEditTask}
                        />
                    ))}
                </SortableContext>

                {board.columns.length === 0 && (
                    <div className="flex-shrink-0 w-80 bg-white/90 backdrop-blur-sm rounded-lg p-6 text-center border border-gray-200 shadow-md">
                        <h3 className="text-lg font-medium text-gray-800 mb-2">
                            No columns yet
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Create your first column to start organizing tasks.
                        </p>
                        <button
                            onClick={onCreateColumn}
                            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            Add Column
                        </button>
                    </div>
                )}
            </div>


            <DragOverlay>
                {activeTask && (
                    <div className="rotate-3 opacity-80">
                        <DraggableTaskCard
                            task={activeTask}
                            boardId={board.id}
                            columnId={activeTask.columnId}
                            isDragOverlay
                        />
                    </div>
                )}
                {activeColumn && (
                    <div className="rotate-2 opacity-80">
                        <DraggableColumn
                            column={activeColumn}
                            boardId={board.id}
                            isDragOverlay
                        />
                    </div>
                )}
            </DragOverlay>
        </DndContext>
    );
};
