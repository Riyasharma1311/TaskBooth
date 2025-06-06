import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Board, Column, Task, CreateBoardData, CreateColumnData, CreateTaskData, UpdateTaskData, SearchFilters, SortOptions } from '@/types';
import { generateId, reorderItems } from '@/utils/helpers';
import { DEFAULT_COLUMNS, CURRENT_USER_ID, LOCAL_STORAGE_KEYS, MOCK_USERS } from '@/utils/constants';
import { useAuthStore } from './authStore';

/**
 * Central store for managing boards, columns, tasks, and related operations
 * Uses Zustand for state management with localStorage persistence
 * Handles CRUD operations, drag & drop reordering, and search/filter functionality
 */
interface BoardStore {
    // Core state
    boards: Board[];
    currentBoard: Board | null;

    // Search and filter state for task filtering
    searchFilters: SearchFilters;
    sortOptions: SortOptions;

    // Board actions
    createBoard: (data: CreateBoardData) => Board;
    updateBoard: (id: string, updates: Partial<Board>) => void;
    deleteBoard: (id: string) => void;
    setCurrentBoard: (board: Board | null) => void;
    getBoardById: (id: string) => Board | undefined;

    // Column actions
    createColumn: (data: CreateColumnData) => Column;
    updateColumn: (id: string, updates: Partial<Column>) => void;
    deleteColumn: (id: string) => void;
    reorderColumns: (boardId: string, fromIndex: number, toIndex: number) => void;

    // Task actions
    createTask: (data: CreateTaskData) => Task;
    updateTask: (data: UpdateTaskData) => void;
    deleteTask: (id: string) => void;
    moveTask: (taskId: string, newColumnId: string, newOrder?: number) => void;
    reorderTasks: (columnId: string, fromIndex: number, toIndex: number) => void;

    // Search and Filter actions
    setSearchFilters: (filters: SearchFilters) => void;
    setSortOptions: (sort: SortOptions) => void;
    clearFilters: () => void;
    getFilteredTasks: (tasks: Task[]) => Task[];

    // Utility actions
    initializeWithMockData: () => void;
}

export const useBoardStore = create<BoardStore>()(
    persist(
        (set, get) => ({
            boards: [],
            currentBoard: null,

            // Initialize search and filter state
            searchFilters: { query: '' },
            sortOptions: { field: 'createdAt', order: 'desc' },

            createBoard: (data: CreateBoardData) => {
                const currentUser = useAuthStore.getState().getCurrentUser();
                const userId = currentUser?.id || CURRENT_USER_ID;

                // Create new board with default columns
                const newBoard: Board = {
                    id: generateId(),
                    title: data.title,
                    description: data.description,
                    createdBy: userId,
                    createdAt: new Date(),
                    columns: DEFAULT_COLUMNS.map((col, index) => ({
                        id: generateId(),
                        title: col.title,
                        boardId: '', // Will be updated below
                        order: index,
                        tasks: [],
                    })),
                };

                // Link columns to their parent board
                newBoard.columns = newBoard.columns.map(col => ({
                    ...col,
                    boardId: newBoard.id,
                }));

                set(state => ({
                    boards: [...state.boards, newBoard],
                }));

                return newBoard;
            },

            updateBoard: (id: string, updates: Partial<Board>) => {
                set(state => ({
                    boards: state.boards.map(board =>
                        board.id === id ? { ...board, ...updates } : board
                    ),
                    currentBoard: state.currentBoard?.id === id
                        ? { ...state.currentBoard, ...updates }
                        : state.currentBoard,
                }));
            },

            deleteBoard: (id: string) => {
                set(state => ({
                    boards: state.boards.filter(board => board.id !== id),
                    currentBoard: state.currentBoard?.id === id ? null : state.currentBoard,
                }));
            },

            setCurrentBoard: (board: Board | null) => {
                set({ currentBoard: board });
            },

            getBoardById: (id: string) => {
                return get().boards.find(board => board.id === id);
            },

            createColumn: (data: CreateColumnData) => {
                const board = get().boards.find(b => b.id === data.boardId);
                if (!board) throw new Error('Board not found');

                const newColumn: Column = {
                    id: generateId(),
                    title: data.title,
                    boardId: data.boardId,
                    order: board.columns.length,
                    tasks: [],
                };

                set(state => ({
                    boards: state.boards.map(board =>
                        board.id === data.boardId
                            ? { ...board, columns: [...board.columns, newColumn] }
                            : board
                    ),
                    currentBoard: state.currentBoard?.id === data.boardId
                        ? { ...state.currentBoard, columns: [...state.currentBoard.columns, newColumn] }
                        : state.currentBoard,
                }));

                return newColumn;
            },

            updateColumn: (id: string, updates: Partial<Column>) => {
                set(state => ({
                    boards: state.boards.map(board => ({
                        ...board,
                        columns: board.columns.map(column =>
                            column.id === id ? { ...column, ...updates } : column
                        ),
                    })),
                    currentBoard: state.currentBoard ? {
                        ...state.currentBoard,
                        columns: state.currentBoard.columns.map(column =>
                            column.id === id ? { ...column, ...updates } : column
                        ),
                    } : null,
                }));
            },

            deleteColumn: (id: string) => {
                set(state => ({
                    boards: state.boards.map(board => ({
                        ...board,
                        columns: board.columns.filter(column => column.id !== id),
                    })),
                    currentBoard: state.currentBoard ? {
                        ...state.currentBoard,
                        columns: state.currentBoard.columns.filter(column => column.id !== id),
                    } : null,
                }));
            },

            reorderColumns: (boardId: string, fromIndex: number, toIndex: number) => {
                set(state => ({
                    boards: state.boards.map(board =>
                        board.id === boardId
                            ? { ...board, columns: reorderItems(board.columns, fromIndex, toIndex) }
                            : board
                    ),
                    currentBoard: state.currentBoard?.id === boardId
                        ? { ...state.currentBoard, columns: reorderItems(state.currentBoard.columns, fromIndex, toIndex) }
                        : state.currentBoard,
                }));
            },

            createTask: (data: CreateTaskData) => {
                const currentUser = useAuthStore.getState().getCurrentUser();
                const userId = currentUser?.id || CURRENT_USER_ID;

                const newTask: Task = {
                    id: generateId(),
                    title: data.title,
                    description: data.description,
                    priority: data.priority,
                    dueDate: data.dueDate,
                    assignedTo: data.assignedTo,
                    createdBy: userId,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    columnId: data.columnId,
                    order: 0, // Will be updated below
                };

                set(state => {
                    const updatedBoards = state.boards.map(board => ({
                        ...board,
                        columns: board.columns.map(column => {
                            if (column.id === data.columnId) {
                                const updatedTask = { ...newTask, order: column.tasks.length };
                                return {
                                    ...column,
                                    tasks: [...column.tasks, updatedTask],
                                };
                            }
                            return column;
                        }),
                    }));

                    const updatedCurrentBoard = state.currentBoard ? {
                        ...state.currentBoard,
                        columns: state.currentBoard.columns.map(column => {
                            if (column.id === data.columnId) {
                                const updatedTask = { ...newTask, order: column.tasks.length };
                                return {
                                    ...column,
                                    tasks: [...column.tasks, updatedTask],
                                };
                            }
                            return column;
                        }),
                    } : null;

                    return {
                        boards: updatedBoards,
                        currentBoard: updatedCurrentBoard,
                    };
                });

                return newTask;
            },

            updateTask: (data: UpdateTaskData) => {
                const updatedData = { ...data, updatedAt: new Date() };
                set(state => ({
                    boards: state.boards.map(board => ({
                        ...board,
                        columns: board.columns.map(column => ({
                            ...column,
                            tasks: column.tasks.map(task =>
                                task.id === data.id ? { ...task, ...updatedData } : task
                            ),
                        })),
                    })),
                    currentBoard: state.currentBoard ? {
                        ...state.currentBoard,
                        columns: state.currentBoard.columns.map(column => ({
                            ...column,
                            tasks: column.tasks.map(task =>
                                task.id === data.id ? { ...task, ...updatedData } : task
                            ),
                        })),
                    } : null,
                }));
            },

            deleteTask: (id: string) => {
                set(state => ({
                    boards: state.boards.map(board => ({
                        ...board,
                        columns: board.columns.map(column => ({
                            ...column,
                            tasks: column.tasks.filter(task => task.id !== id),
                        })),
                    })),
                    currentBoard: state.currentBoard ? {
                        ...state.currentBoard,
                        columns: state.currentBoard.columns.map(column => ({
                            ...column,
                            tasks: column.tasks.filter(task => task.id !== id),
                        })),
                    } : null,
                }));
            },

            moveTask: (taskId: string, newColumnId: string, newOrder?: number) => {
                set(state => {
                    let taskToMove: Task | null = null;

                    // Step 1: Find and remove the task from its current column
                    const boardsWithTaskRemoved = state.boards.map(board => ({
                        ...board,
                        columns: board.columns.map(column => {
                            const taskIndex = column.tasks.findIndex(task => task.id === taskId);
                            if (taskIndex !== -1) {
                                taskToMove = column.tasks[taskIndex];
                                return {
                                    ...column,
                                    tasks: column.tasks.filter(task => task.id !== taskId),
                                };
                            }
                            return column;
                        }),
                    }));

                    if (!taskToMove) return state; // Task not found

                    // Step 2: Add the task to the new column at specified position
                    const updatedBoards = boardsWithTaskRemoved.map(board => ({
                        ...board,
                        columns: board.columns.map(column => {
                            if (column.id === newColumnId) {
                                const updatedTask = { ...taskToMove!, columnId: newColumnId };
                                const tasks = [...column.tasks];
                                const insertIndex = newOrder !== undefined ? newOrder : tasks.length;
                                tasks.splice(insertIndex, 0, updatedTask);

                                // Reorder all tasks to maintain consistent ordering
                                return {
                                    ...column,
                                    tasks: tasks.map((task, index) => ({ ...task, order: index })),
                                };
                            }
                            return column;
                        }),
                    }));

                    // Update current board reference if it was modified
                    const updatedCurrentBoard = state.currentBoard ?
                        updatedBoards.find(board => board.id === state.currentBoard!.id) || null : null;

                    return {
                        boards: updatedBoards,
                        currentBoard: updatedCurrentBoard,
                    };
                });
            },

            reorderTasks: (columnId: string, fromIndex: number, toIndex: number) => {
                set(state => ({
                    boards: state.boards.map(board => ({
                        ...board,
                        columns: board.columns.map(column =>
                            column.id === columnId
                                ? { ...column, tasks: reorderItems(column.tasks, fromIndex, toIndex) }
                                : column
                        ),
                    })),
                    currentBoard: state.currentBoard ? {
                        ...state.currentBoard,
                        columns: state.currentBoard.columns.map(column =>
                            column.id === columnId
                                ? { ...column, tasks: reorderItems(column.tasks, fromIndex, toIndex) }
                                : column
                        ),
                    } : null,
                }));
            },

            // Search and Filter actions
            setSearchFilters: (filters: SearchFilters) => {
                set({ searchFilters: filters });
            },

            setSortOptions: (sort: SortOptions) => {
                set({ sortOptions: sort });
            },

            clearFilters: () => {
                set({
                    searchFilters: { query: '' },
                    sortOptions: { field: 'createdAt', order: 'desc' },
                });
            },

            getFilteredTasks: (tasks: Task[]) => {
                const { searchFilters, sortOptions } = get();
                let filteredTasks = [...tasks];

                // Filter by search query (searches title, description, and assignee name)
                if (searchFilters.query) {
                    const query = searchFilters.query.toLowerCase();
                    filteredTasks = filteredTasks.filter(task => {
                        const assignedUser = MOCK_USERS.find(user => user.id === task.assignedTo);
                        return (
                            task.title.toLowerCase().includes(query) ||
                            task.description.toLowerCase().includes(query) ||
                            (assignedUser && assignedUser.name.toLowerCase().includes(query))
                        );
                    });
                }

                // Filter by priority levels
                if (searchFilters.priority && searchFilters.priority.length > 0) {
                    filteredTasks = filteredTasks.filter(task =>
                        searchFilters.priority!.includes(task.priority)
                    );
                }

                // Filter by assigned team members
                if (searchFilters.assignedTo && searchFilters.assignedTo.length > 0) {
                    filteredTasks = filteredTasks.filter(task =>
                        searchFilters.assignedTo!.includes(task.assignedTo)
                    );
                }

                // Filter by due date range
                if (searchFilters.dueDate) {
                    const { from, to } = searchFilters.dueDate;
                    filteredTasks = filteredTasks.filter(task => {
                        if (!task.dueDate) return false;
                        const taskDate = new Date(task.dueDate);
                        if (from && taskDate < new Date(from)) return false;
                        if (to && taskDate > new Date(to)) return false;
                        return true;
                    });
                }

                // Sort tasks based on selected criteria
                filteredTasks.sort((a, b) => {
                    let aValue: any;
                    let bValue: any;

                    switch (sortOptions.field) {
                        case 'title':
                            aValue = a.title.toLowerCase();
                            bValue = b.title.toLowerCase();
                            break;
                        case 'priority':
                            // High priority = 3, Medium = 2, Low = 1 for sorting
                            const priorityOrder = { high: 3, medium: 2, low: 1 };
                            aValue = priorityOrder[a.priority];
                            bValue = priorityOrder[b.priority];
                            break;
                        case 'dueDate':
                            aValue = a.dueDate ? new Date(a.dueDate).getTime() : 0;
                            bValue = b.dueDate ? new Date(b.dueDate).getTime() : 0;
                            break;
                        case 'assignedTo':
                            const aUser = MOCK_USERS.find(user => user.id === a.assignedTo);
                            const bUser = MOCK_USERS.find(user => user.id === b.assignedTo);
                            aValue = aUser ? aUser.name.toLowerCase() : '';
                            bValue = bUser ? bUser.name.toLowerCase() : '';
                            break;
                        case 'createdAt':
                        default:
                            aValue = new Date(a.createdAt).getTime();
                            bValue = new Date(b.createdAt).getTime();
                            break;
                    }

                    if (aValue < bValue) return sortOptions.order === 'asc' ? -1 : 1;
                    if (aValue > bValue) return sortOptions.order === 'asc' ? 1 : -1;
                    return 0;
                });

                return filteredTasks;
            },

            initializeWithMockData: () => {
                // Create a sample board with demo data for new users
                const mockBoard = get().createBoard({
                    title: 'Sample Project Board',
                    description: 'A sample board to demonstrate the task management features',
                });

                get().setCurrentBoard(mockBoard);

                // Get references to the default columns
                const todoColumn = mockBoard.columns[0];      // "To Do"
                const inProgressColumn = mockBoard.columns[1]; // "In Progress"
                const doneColumn = mockBoard.columns[2];       // "Done"

                // Create sample tasks to showcase different features
                get().createTask({
                    title: 'Design landing page',
                    description: 'Create wireframes and mockups for the new landing page',
                    priority: 'high',
                    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
                    assignedTo: '2',
                    columnId: todoColumn.id,
                });

                get().createTask({
                    title: 'Set up development environment',
                    description: 'Configure development tools and dependencies',
                    priority: 'medium',
                    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
                    assignedTo: '3',
                    columnId: inProgressColumn.id,
                });

                get().createTask({
                    title: 'Write project documentation',
                    description: 'Document the project setup and usage instructions',
                    priority: 'low',
                    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
                    assignedTo: '4',
                    columnId: doneColumn.id,
                });
            },
        }),
        {
            name: LOCAL_STORAGE_KEYS.BOARDS,
        }
    )
);
