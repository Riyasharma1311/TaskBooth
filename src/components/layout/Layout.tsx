import { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

interface LayoutProps {
    children: ReactNode;
}

/**
 * Main layout wrapper component that provides consistent navigation and styling
 * Includes header with branding, user info, and logout functionality
 * Uses a pink-themed design with backdrop blur effects
 */
export const Layout = ({ children }: LayoutProps) => {
    const navigate = useNavigate();
    const { getCurrentUser, logout } = useAuthStore();

    const currentUser = getCurrentUser();

    const handleLogout = () => {
        logout();
        navigate('/auth');
    };

    return (
        <div className="min-h-screen bg-pink-50">
            {/* Navigation header with branding and user controls */}
            <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        {/* Brand logo and title */}
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-pink-200 to-pink-300 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-pink-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 0v10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                                </svg>
                            </div>
                            <div>
                                <Link
                                    to="/boards"
                                    className="text-2xl font-bold text-gray-800 tracking-tight hover:text-gray-700 transition-colors"
                                >
                                    Task Booth
                                </Link>
                                <p className="text-gray-600 text-sm">
                                    Organize your workflow beautifully
                                </p>
                            </div>
                        </div>

                        {/* User profile and logout section */}
                        <div className="flex items-center space-x-6">
                            {/* Current user avatar and info */}
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-pink-500 rounded-full flex items-center justify-center border-2 border-pink-300">
                                    <span className="text-white font-bold text-sm">
                                        {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
                                    </span>
                                </div>
                                <div className="hidden sm:block">
                                    <p className="text-gray-800 text-sm font-medium">{currentUser?.name || 'User'}</p>
                                    <p className="text-gray-600 text-xs">{currentUser?.role || 'Member'}</p>
                                </div>
                            </div>

                            {/* Logout button with hover effects */}
                            <button
                                onClick={handleLogout}
                                className="group flex items-center space-x-2 px-4 py-2 bg-white-600 hover:bg-red-700 hover:text-white text-black rounded-lg font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-lg "
                            >
                                <svg
                                    className="w-4 h-4 transition-transform group-hover:translate-x-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                <span className="hidden sm:block">Sign Out</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main content area with responsive spacing */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="animate-fade-in">
                    {children}
                </div>
            </main>
        </div>
    );
};
