import { useState, useCallback } from 'react';
import { Search, Filter, X, Calendar, User, Tag } from 'lucide-react';
import { Priority, SearchFilters, SortOptions } from '@/types';
import { MOCK_USERS, PRIORITY_LABELS } from '@/utils/constants';
import { Button } from '@/components/common/Button';

interface SearchAndFilterProps {
    filters: SearchFilters;
    sortOptions: SortOptions;
    onFiltersChange: (filters: SearchFilters) => void;
    onSortChange: (sort: SortOptions) => void;
    onClear: () => void;
}

/**
 * Advanced search and filtering component for task management
 * Provides text search, priority filtering, assignee filtering, date range filtering, and sorting
 * Features collapsible filter panel to save screen space while offering comprehensive filtering options
 */
export const SearchAndFilter = ({
    filters,
    sortOptions,
    onFiltersChange,
    onSortChange,
    onClear,
}: SearchAndFilterProps) => {
    const [showFilters, setShowFilters] = useState(false);
    const [localFilters, setLocalFilters] = useState<SearchFilters>(filters);

    // Debounced search handler to avoid excessive API calls during typing
    const handleSearchChange = useCallback((query: string) => {
        const newFilters = { ...filters, query };
        onFiltersChange(newFilters);
    }, [filters, onFiltersChange]);

    // Toggle priority filter - allows multiple priority selections
    const handlePriorityToggle = (priority: Priority) => {
        const currentPriorities = localFilters.priority || [];
        const newPriorities = currentPriorities.includes(priority)
            ? currentPriorities.filter(p => p !== priority)
            : [...currentPriorities, priority];

        setLocalFilters(prev => ({ ...prev, priority: newPriorities }));
    };

    const handleAssigneeToggle = (userId: string) => {
        const currentAssignees = localFilters.assignedTo || [];
        const newAssignees = currentAssignees.includes(userId)
            ? currentAssignees.filter(id => id !== userId)
            : [...currentAssignees, userId];

        setLocalFilters(prev => ({ ...prev, assignedTo: newAssignees }));
    };

    const handleDateRangeChange = (field: 'from' | 'to', value: string) => {
        setLocalFilters(prev => ({
            ...prev,
            dueDate: {
                ...prev.dueDate,
                [field]: value ? new Date(value) : undefined,
            },
        }));
    };

    const applyFilters = () => {
        onFiltersChange(localFilters);
        setShowFilters(false);
    };

    const resetFilters = () => {
        const emptyFilters: SearchFilters = { query: '' };
        setLocalFilters(emptyFilters);
        onFiltersChange(emptyFilters);
        onSortChange({ field: 'createdAt', order: 'desc' });
        setShowFilters(false);
    };

    // Check if any filters are currently active to show filter indicators
    const hasActiveFilters = filters.priority?.length || filters.assignedTo?.length || filters.dueDate?.from || filters.dueDate?.to;

    return (
        <div className="mb-6 space-y-4">
            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black w-6 h-6 z-10" />
                <input
                    type="text"
                    placeholder="Search tasks by title, description, or assignee..."
                    value={filters.query}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white/90 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent backdrop-blur-sm shadow-sm"
                />
            </div>

            {/* Filter and Sort Controls */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Button
                        variant="secondary"
                        onClick={() => setShowFilters(!showFilters)}
                        icon={<Filter className="w-4 h-4 mr-2" />}
                        className="whitespace-nowrap"
                    >
                        <div className="flex items-center gap-2">
                            <span>Filters</span>
                            {hasActiveFilters && (
                                <span className="bg-primary-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                                    {(filters.priority?.length || 0) + (filters.assignedTo?.length || 0) + (filters.dueDate?.from ? 1 : 0)}
                                </span>
                            )}
                        </div>
                    </Button>

                    {hasActiveFilters && (
                        <Button
                            variant="ghost"
                            onClick={onClear}
                            icon={<X className="w-4 h-4 mr-2" />}
                            className="text-gray-600 hover:text-gray-800 whitespace-nowrap"
                        >
                            Clear
                        </Button>
                    )}
                </div>

                {/* Sort Options */}
                <div className="flex items-center space-x-2">
                    <select
                        value={`${sortOptions.field}-${sortOptions.order}`}
                        onChange={(e) => {
                            const [field, order] = e.target.value.split('-') as [SortOptions['field'], SortOptions['order']];
                            onSortChange({ field, order });
                        }}
                        className="bg-white/90 border border-gray-300 rounded-lg px-3 py-2 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
                    >
                        <option value="createdAt-desc">Newest First</option>
                        <option value="createdAt-asc">Oldest First</option>
                        <option value="title-asc">Title A-Z</option>
                        <option value="title-desc">Title Z-A</option>
                        <option value="priority-desc">High Priority First</option>
                        <option value="priority-asc">Low Priority First</option>
                        <option value="dueDate-asc">Due Date (Earliest)</option>
                        <option value="dueDate-desc">Due Date (Latest)</option>
                        <option value="assignedTo-asc">Assignee A-Z</option>
                        <option value="assignedTo-desc">Assignee Z-A</option>
                    </select>
                </div>
            </div>

            {/* Filter Panel */}
            {showFilters && (
                <div className="bg-white/90 backdrop-blur-sm border border-gray-300 rounded-lg p-4 space-y-4 shadow-md">
                    {/* Priority Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-800 mb-2">
                            <Tag className="w-4 h-4 inline mr-1" />
                            Priority
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {Object.entries(PRIORITY_LABELS).map(([priority, label]) => (
                                <button
                                    key={priority}
                                    onClick={() => handlePriorityToggle(priority as Priority)}
                                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${localFilters.priority?.includes(priority as Priority)
                                        ? `priority-badge priority-${priority} opacity-100`
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Assignee Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-800 mb-2">
                            <User className="w-4 h-4 inline mr-1" />
                            Assigned To
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {MOCK_USERS.map((user) => (
                                <button
                                    key={user.id}
                                    onClick={() => handleAssigneeToggle(user.id)}
                                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors flex items-center space-x-1 ${localFilters.assignedTo?.includes(user.id)
                                        ? 'bg-primary-500 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                >
                                    <div className="w-4 h-4 bg-primary-200 rounded-full flex items-center justify-center">
                                        <span className="text-primary-600 text-xs">
                                            {user.name.charAt(0)}
                                        </span>
                                    </div>
                                    <span>{user.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Date Range Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-800 mb-2">
                            <Calendar className="w-4 h-4 inline mr-1" />
                            Due Date Range
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            <input
                                type="date"
                                value={localFilters.dueDate?.from ? new Date(localFilters.dueDate.from).toISOString().split('T')[0] : ''}
                                onChange={(e) => handleDateRangeChange('from', e.target.value)}
                                className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="From"
                            />
                            <input
                                type="date"
                                value={localFilters.dueDate?.to ? new Date(localFilters.dueDate.to).toISOString().split('T')[0] : ''}
                                onChange={(e) => handleDateRangeChange('to', e.target.value)}
                                className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="To"
                            />
                        </div>
                    </div>

                    {/* Filter Actions */}
                    <div className="flex justify-end space-x-2 pt-2">
                        <Button variant="ghost" onClick={resetFilters}>
                            Reset
                        </Button>
                        <Button onClick={applyFilters}>
                            Apply Filters
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};
