import { User } from '@/types';

export const PRIORITY_COLORS = {
    high: 'bg-red-100 text-red-800 border-red-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    low: 'bg-green-100 text-green-800 border-green-200',
} as const;

export const PRIORITY_LABELS = {
    high: 'High',
    medium: 'Medium',
    low: 'Low',
} as const;

export const PRIORITY_OPTIONS = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
];

export const DEFAULT_COLUMNS = [
    { title: 'To Do', order: 0 },
    { title: 'In Progress', order: 1 },
    { title: 'Done', order: 2 },
];

export const MOCK_USERS: User[] = [
    { id: '1', name: 'John Doe', email: 'john@example.com' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
    { id: '3', name: 'Mike Johnson', email: 'mike@example.com' },
    { id: '4', name: 'Sarah Wilson', email: 'sarah@example.com' },
    { id: '5', name: 'David Brown', email: 'david@example.com' },
];

export const CURRENT_USER_ID = '1';

export const LOCAL_STORAGE_KEYS = {
    BOARDS: 'task-board-boards',
    USERS: 'task-board-users',
    AUTH: 'task-board-auth',
} as const;
