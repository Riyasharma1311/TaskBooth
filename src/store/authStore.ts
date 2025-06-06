import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthUser, LoginCredentials, RegisterData, AuthResponse } from '@/types';
import { LOCAL_STORAGE_KEYS } from '@/utils/constants';

interface AuthStore {
    user: AuthUser | null;
    token: string | null;
    refreshToken: string | null;
    isLoading: boolean;
    error: string | null;

    // Actions
    login: (credentials: LoginCredentials) => Promise<boolean>;
    register: (data: RegisterData) => Promise<boolean>;
    logout: () => void;
    refreshAuth: () => Promise<boolean>;
    clearError: () => void;
    updateUser: (updates: Partial<AuthUser>) => void;
    setOnlineStatus: (isOnline: boolean) => void;

    // Getters
    isAuthenticated: () => boolean;
    getCurrentUser: () => AuthUser | null;
}

// Mock API functions (replace with real API calls)
const mockAuthAPI = {
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock validation
        if (credentials.email === 'admin@example.com' && credentials.password === 'password123') {
            return {
                user: {
                    id: '1',
                    name: 'Admin User',
                    email: credentials.email,
                    avatar: '',
                    role: 'admin',
                    isOnline: true,
                    lastActive: new Date(),
                },
                token: 'mock-jwt-token-' + Date.now(),
                refreshToken: 'mock-refresh-token-' + Date.now(),
            };
        } else if (credentials.email === 'user@example.com' && credentials.password === 'password123') {
            return {
                user: {
                    id: '2',
                    name: 'Regular User',
                    email: credentials.email,
                    avatar: '',
                    role: 'member',
                    isOnline: true,
                    lastActive: new Date(),
                },
                token: 'mock-jwt-token-' + Date.now(),
                refreshToken: 'mock-refresh-token-' + Date.now(),
            };
        }

        throw new Error('Invalid credentials');
    },

    register: async (data: RegisterData): Promise<AuthResponse> => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock validation
        if (data.password !== data.confirmPassword) {
            throw new Error('Passwords do not match');
        }

        if (data.email === 'existing@example.com') {
            throw new Error('Email already exists');
        }

        return {
            user: {
                id: 'new-' + Date.now(),
                name: data.name,
                email: data.email,
                avatar: '',
                role: 'member',
                isOnline: true,
                lastActive: new Date(),
            },
            token: 'mock-jwt-token-' + Date.now(),
            refreshToken: 'mock-refresh-token-' + Date.now(),
        };
    },

    refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Mock token validation
        if (!refreshToken.startsWith('mock-refresh-token-')) {
            throw new Error('Invalid refresh token');
        }

        return {
            user: {
                id: '1',
                name: 'Admin User',
                email: 'admin@example.com',
                avatar: '',
                role: 'admin',
                isOnline: true,
                lastActive: new Date(),
            },
            token: 'mock-jwt-token-refreshed-' + Date.now(),
            refreshToken: 'mock-refresh-token-refreshed-' + Date.now(),
        };
    },
};

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            refreshToken: null,
            isLoading: false,
            error: null,

            login: async (credentials: LoginCredentials) => {
                set({ isLoading: true, error: null });

                try {
                    const response = await mockAuthAPI.login(credentials);

                    set({
                        user: response.user,
                        token: response.token,
                        refreshToken: response.refreshToken,
                        isLoading: false,
                        error: null,
                    });

                    return true;
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Login failed';
                    set({
                        isLoading: false,
                        error: errorMessage,
                        user: null,
                        token: null,
                        refreshToken: null,
                    });
                    return false;
                }
            },

            register: async (data: RegisterData) => {
                set({ isLoading: true, error: null });

                try {
                    const response = await mockAuthAPI.register(data);

                    set({
                        user: response.user,
                        token: response.token,
                        refreshToken: response.refreshToken,
                        isLoading: false,
                        error: null,
                    });

                    return true;
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Registration failed';
                    set({
                        isLoading: false,
                        error: errorMessage,
                        user: null,
                        token: null,
                        refreshToken: null,
                    });
                    return false;
                }
            },

            logout: () => {
                set({
                    user: null,
                    token: null,
                    refreshToken: null,
                    error: null,
                });
            },

            refreshAuth: async () => {
                const { refreshToken } = get();

                if (!refreshToken) {
                    return false;
                }

                set({ isLoading: true, error: null });

                try {
                    const response = await mockAuthAPI.refreshToken(refreshToken);

                    set({
                        user: response.user,
                        token: response.token,
                        refreshToken: response.refreshToken,
                        isLoading: false,
                        error: null,
                    });

                    return true;
                } catch (error) {
                    set({
                        isLoading: false,
                        user: null,
                        token: null,
                        refreshToken: null,
                        error: 'Session expired. Please login again.',
                    });
                    return false;
                }
            },

            clearError: () => {
                set({ error: null });
            },

            updateUser: (updates: Partial<AuthUser>) => {
                const { user } = get();
                if (user) {
                    set({
                        user: { ...user, ...updates },
                    });
                }
            },

            setOnlineStatus: (isOnline: boolean) => {
                const { user } = get();
                if (user) {
                    set({
                        user: {
                            ...user,
                            isOnline,
                            lastActive: new Date(),
                        },
                    });
                }
            },

            isAuthenticated: () => {
                const { user, token } = get();
                return !!(user && token);
            },

            getCurrentUser: () => {
                return get().user;
            },
        }),
        {
            name: LOCAL_STORAGE_KEYS.AUTH,
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                refreshToken: state.refreshToken,
            }),
        }
    )
);
