import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useBoardStore } from '@/store/boardStore';
import { Task } from '@/types';
import { formatDate } from '@/utils/helpers';
import { MOCK_USERS, PRIORITY_LABELS } from '@/utils/constants';
import { MarkdownRenderer } from '@/components/common/MarkdownRenderer';

interface DraggableTaskCardProps {
    task: Task;
    boardId: string;
    columnId: string;
    isDragOverlay?: boolean;
    onEditTask?: (task: Task) => void;
}

export const DraggableTaskCard = ({ task, isDragOverlay = false, onEditTask }: DraggableTaskCardProps) => {
    const { deleteTask } = useBoardStore();

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task.id,
        data: {
            type: 'task',
            task,
        },
        disabled: isDragOverlay,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const assignedUser = MOCK_USERS.find(user => user.id === task.assignedTo);
    const createdByUser = MOCK_USERS.find(user => user.id === task.createdBy);

    const handleDeleteTask = () => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            deleteTask(task.id);
        }
    };

    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();

    const cardContent = (
        <>
            <div className="flex items-start justify-between mb-2">
                <div className="flex items-start flex-1">
                    {!isDragOverlay && (
                        <div
                            {...attributes}
                            {...listeners}
                            className="cursor-grab active:cursor-grabbing mr-2 mt-0.5 p-1 hover:bg-gray-100 rounded transition-colors"
                            title="Drag to move task"
                        >
                            <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                            </svg>
                        </div>
                    )}
                    <h4 className="font-medium text-gray-900 text-sm leading-tight flex-1">
                        {task.title}
                    </h4>
                </div>
                <div className="flex items-center space-x-1 ml-2">
                    <span className={`priority-badge priority-${task.priority}`}>
                        {PRIORITY_LABELS[task.priority]}
                    </span>
                    {!isDragOverlay && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteTask();
                            }}
                            className="text-gray-400 hover:text-red-500 p-1"
                            title="Delete task"
                        >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>

            {task.description && (
                <div className="mb-3">
                    <MarkdownRenderer
                        content={task.description}
                        maxLines={3}
                        className="text-xs"
                    />
                </div>
            )}

            <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-2">
                    {assignedUser && (
                        <div className="flex items-center space-x-1">
                            <div className="w-5 h-5 bg-primary-100 rounded-full flex items-center justify-center">
                                <span className="text-primary-600 font-medium text-xs">
                                    {assignedUser.name.charAt(0)}
                                </span>
                            </div>
                            <span className="text-gray-600">{assignedUser.name}</span>
                        </div>
                    )}
                </div>

                {task.dueDate && (
                    <div className={`flex items-center space-x-1 ${isOverdue ? 'text-red-600' : ''}`}>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{formatDate(task.dueDate)}</span>
                    </div>
                )}
            </div>

            {createdByUser && (
                <div className="mt-2 text-xs text-gray-400">
                    Created by {createdByUser.name}
                </div>
            )}
        </>
    );

    if (isDragOverlay) {
        return (
            <div className="bg-white rounded-lg p-4 shadow-lg border border-gray-200 rotate-3 opacity-90">
                {cardContent}
            </div>
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all cursor-pointer ${isDragging ? 'opacity-50 rotate-2 shadow-lg' : ''
                }`}
            onClick={() => onEditTask?.(task)}
        >
            {cardContent}
        </div>
    );
};
