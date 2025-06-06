import { format, isToday, isTomorrow, isPast } from 'date-fns';

/**
 * Generates a unique identifier using random string generation
 * Returns a 9-character alphanumeric string for use as database IDs
 */
export const generateId = (): string => {
    return Math.random().toString(36).substr(2, 9);
};

/**
 * Formats dates in a user-friendly way with relative time for recent dates
 * Shows "Today", "Tomorrow", or full date format for other dates
 */
export const formatDate = (date: Date | string): string => {
    const dateObj = date instanceof Date ? date : new Date(date);

    // Validate date input
    if (isNaN(dateObj.getTime())) {
        return 'Invalid date';
    }

    if (isToday(dateObj)) {
        return 'Today';
    }
    if (isTomorrow(dateObj)) {
        return 'Tomorrow';
    }
    return format(dateObj, 'MMM dd, yyyy');
};

export const formatDateTime = (date: Date | string): string => {
    const dateObj = date instanceof Date ? date : new Date(date);

    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
        return 'Invalid date';
    }

    return format(dateObj, 'MMM dd, yyyy HH:mm');
};

export const isTaskOverdue = (dueDate: Date | string): boolean => {
    const dateObj = dueDate instanceof Date ? dueDate : new Date(dueDate);

    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
        return false;
    }

    return isPast(dateObj) && !isToday(dateObj);
};

export const sortByOrder = <T extends { order: number }>(items: T[]): T[] => {
    return [...items].sort((a, b) => a.order - b.order);
};

/**
 * Reorders items in an array and updates their order property
 * Used for drag-and-drop operations to maintain consistent ordering
 * Returns a new array with updated order values
 */
export const reorderItems = <T extends { order: number }>(
    items: T[],
    fromIndex: number,
    toIndex: number
): T[] => {
    const result = Array.from(items);
    const [removed] = result.splice(fromIndex, 1);
    result.splice(toIndex, 0, removed);

    // Update order property for all items to maintain consistency
    return result.map((item, index) => ({
        ...item,
        order: index,
    }));
};

/**
 * Utility for conditionally joining CSS class names
 * Filters out falsy values and joins remaining classes with spaces
 */
export const clsx = (...classes: (string | undefined | null | false)[]): string => {
    return classes.filter(Boolean).join(' ');
};

/**
 * Creates a debounced version of a function that delays execution
 * Useful for search inputs and API calls to reduce excessive requests
 */
export const debounce = <T extends (...args: any[]) => void>(
    func: T,
    wait: number
): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};

export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
};

export const getInitials = (name: string): string => {
    return name
        .split(' ')
        .map(word => word.charAt(0).toUpperCase())
        .slice(0, 2)
        .join('');
};
