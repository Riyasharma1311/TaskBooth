import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useBoardStore } from './store/boardStore';
import { useAuthStore } from './store/authStore';
import { socketService } from './services/socketService';
import { BoardList } from './components/board/BoardList';
import { BoardDetail } from './components/board/BoardDetail';
import { Layout } from './components/layout/Layout';
import { AuthPage } from './components/auth/AuthPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

/**
 * Main application component that handles routing and authentication flow
 * Sets up socket connections and initializes data for authenticated users
 */
function App() {
    const { boards, initializeWithMockData } = useBoardStore();
    const { isAuthenticated } = useAuthStore();

    // Handle socket connection based on authentication status
    useEffect(() => {
        if (isAuthenticated()) {
            // Connect to real-time collaboration features
            socketService.connect();

            // Listen for user presence events in shared boards
            const handleUserJoined = (data: any) => {
                console.log('User joined:', data);
            };

            const handleUserLeft = (data: any) => {
                console.log('User left:', data);
            };

            socketService.on('user_joined', handleUserJoined);
            socketService.on('user_left', handleUserLeft);

            // Clean up event listeners when component unmounts or user logs out
            return () => {
                socketService.off('user_joined', handleUserJoined);
                socketService.off('user_left', handleUserLeft);
            };
        } else {
            // Ensure socket is disconnected for unauthenticated users
            socketService.disconnect();
        }
    }, [isAuthenticated]);

    // Initialize demo data for new users to showcase the app's capabilities
    useEffect(() => {
        if (isAuthenticated() && boards.length === 0) {
            initializeWithMockData();
        }
    }, [boards.length, initializeWithMockData, isAuthenticated]);

    return (
        <Routes>
            {/* Authentication page - redirect to boards if already logged in */}
            <Route
                path="/auth"
                element={
                    isAuthenticated() ?
                        <Navigate to="/boards" replace /> :
                        <AuthPage />
                }
            />

            {/* Root path - redirect based on authentication status */}
            <Route
                path="/"
                element={
                    isAuthenticated() ?
                        <Navigate to="/boards" replace /> :
                        <Navigate to="/auth" replace />
                }
            />

            {/* Board listing page - protected route */}
            <Route path="/boards" element={
                <ProtectedRoute>
                    <Layout>
                        <BoardList />
                    </Layout>
                </ProtectedRoute>
            } />

            {/* Individual board view - protected route */}
            <Route path="/boards/:boardId" element={
                <ProtectedRoute>
                    <Layout>
                        <BoardDetail />
                    </Layout>
                </ProtectedRoute>
            } />

            {/* Catch-all route - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;
