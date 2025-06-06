export type Priority = 'high' | 'medium' | 'low';

export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    isOnline?: boolean;
}

export interface Task {
    id: string;
    title: string;
    description: string;
    priority: Priority;
    dueDate: Date | string;
    assignedTo: string;
    createdBy: string;
    createdAt: Date | string;
    updatedAt: Date | string;
    columnId: string;
    order: number;
    tags?: string[];
    estimatedHours?: number;
    actualHours?: number;
}

export interface Column {
    id: string;
    title: string;
    boardId: string;
    order: number;
    tasks: Task[];
}

export interface Board {
    id: string;
    title: string;
    description: string;
    createdBy: string;
    createdAt: Date | string;
    columns: Column[];
}

export interface CreateBoardData {
    title: string;
    description: string;
}

export interface CreateColumnData {
    title: string;
    boardId: string;
}

export interface CreateTaskData {
    title: string;
    description: string;
    priority: Priority;
    dueDate: Date;
    assignedTo: string;
    columnId: string;
}

export interface UpdateTaskData {
    id: string;
    title?: string;
    description?: string;
    priority?: Priority;
    dueDate?: Date | string;
    assignedTo?: string;
    columnId?: string;
    order?: number;
}

export interface DragEndEvent {
    active: {
        id: string;
        data: {
            current: {
                type: 'task' | 'column';
                task?: Task;
                column?: Column;
            };
        };
    };
    over: {
        id: string;
        data: {
            current: {
                type: 'task' | 'column';
                accepts?: string[];
            };
        };
    } | null;
}

// Search and Filter interfaces
export interface SearchFilters {
    query: string;
    priority?: Priority[];
    assignedTo?: string[];
    dueDate?: {
        from?: Date;
        to?: Date;
    };
    tags?: string[];
}

export interface SortOptions {
    field: 'title' | 'priority' | 'dueDate' | 'createdAt' | 'assignedTo';
    order: 'asc' | 'desc';
}

// Authentication interfaces
export interface AuthUser {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: 'admin' | 'member' | 'viewer';
    isOnline: boolean;
    lastActive: Date | string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface AuthResponse {
    user: AuthUser;
    token: string;
    refreshToken: string;
}

// Socket event interfaces
export interface SocketEvent {
    type: 'task_created' | 'task_updated' | 'task_deleted' | 'task_moved' | 'user_joined' | 'user_left';
    data: any;
    boardId: string;
    userId: string;
    timestamp: Date | string;
}

// API Response interfaces
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
