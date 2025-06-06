import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBoardStore } from '@/store/boardStore';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/common/Button';
import { formatDateTime } from '@/utils/helpers';
import { MOCK_USERS } from '@/utils/constants';
import { CreateBoardModal } from './CreateBoardModal.tsx';

export const BoardList = () => {
    const { boards, deleteBoard } = useBoardStore();
    const { getCurrentUser } = useAuthStore();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const getUserName = (userId: string) => {
        // First check if it's the current user
        const currentUser = getCurrentUser();
        if (currentUser && currentUser.id === userId) {
            return currentUser.name;
        }

        // Then check MOCK_USERS
        const user = MOCK_USERS.find(u => u.id === userId);
        return user?.name || 'Unknown User';
    };

    const handleDeleteBoard = (boardId: string) => {
        if (window.confirm('Are you sure you want to delete this board?')) {
            deleteBoard(boardId);
        }
    };

    return (
        <div className="px-4 mt-10 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">

                <div className="sm:flex-auto">
                    <h1 className="text-2xl font-semibold text-gray-800">Boards</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Manage your project boards and collaborate with your team.
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none ">
                    <Button onClick={() => setIsCreateModalOpen(true)}>
                        Create Board
                    </Button>
                </div>
            </div>

            <div className="mt-12 flow-root">
                <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <div className="overflow-hidden bg-white shadow-xl ring-1 ring-gray-200 md:rounded-xl border border-gray-200">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="table-header">Board Name</th>
                                        <th className="table-header">Description</th>
                                        <th className="table-header">Created By</th>
                                        <th className="table-header">Created</th>
                                        <th className="table-header">Columns</th>
                                        <th className="table-header">Tasks</th>
                                        {/* <th className="relative py-3 pl-3 pr-4 sm:pr-6">
                                            <span className="sr-only">Actions</span>
                                        </th> */}
                                        <th className="table-header">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {boards.map((board) => {
                                        const totalTasks = board.columns.reduce(
                                            (acc, col) => acc + col.tasks.length,
                                            0
                                        );

                                        return (
                                            <tr key={board.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="table-cell">
                                                    <Link
                                                        to={`/boards/${board.id}`}
                                                        className="font-medium text-pink-600 hover:text-pink-700"
                                                    >
                                                        {board.title}
                                                    </Link>
                                                </td>
                                                <td className="table-cell text-gray-700">
                                                    <div className="max-w-xs truncate">
                                                        {board.description || 'No description'}
                                                    </div>
                                                </td>
                                                <td className="table-cell text-gray-700">
                                                    {getUserName(board.createdBy)}
                                                </td>
                                                <td className="table-cell text-gray-700">
                                                    {formatDateTime(board.createdAt)}
                                                </td>
                                                <td className="table-cell text-gray-700">
                                                    {board.columns.length}
                                                </td>
                                                <td className="table-cell text-gray-700">
                                                    {totalTasks}
                                                </td>
                                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                    <div className="flex items-center justify-end gap-3">
                                                        <Link
                                                            to={`/boards/${board.id}`}
                                                            className="group flex items-center justify-center w-8 h-8 bg-teal-100 hover:bg-teal-200 text-teal-600 hover:text-teal-700 rounded-lg transition-all duration-200 border border-teal-200 hover:border-teal-300"
                                                            title="View Board"
                                                        >
                                                            <svg className="w-4 h-4 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                            </svg>
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDeleteBoard(board.id)}
                                                            className="group flex items-center justify-center w-8 h-8 bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-700 rounded-lg transition-all duration-200 border border-red-200 hover:border-red-300"
                                                            title="Delete Board"
                                                        >
                                                            <svg className="w-4 h-4 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            {boards.length === 0 && (
                                <div className="text-center py-12">
                                    <h3 className="mt-2 text-sm font-medium text-gray-800">
                                        No boards found
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-600">
                                        Get started by creating a new board.
                                    </p>
                                    <div className="mt-6">
                                        <Button onClick={() => setIsCreateModalOpen(true)}>
                                            Create Board
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <CreateBoardModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
        </div>
    );
};
