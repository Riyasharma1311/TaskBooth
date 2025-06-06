import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';

interface LoginFormProps {
    onToggleMode: () => void;
}

export const LoginForm = ({ onToggleMode }: LoginFormProps) => {
    const navigate = useNavigate();
    const { login, isLoading, error, clearError } = useAuthStore();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false,
    });

    const handleInputChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (error) clearError();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            return;
        }

        const success = await login({
            email: formData.email,
            password: formData.password,
        });

        if (success) {
            navigate('/boards');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 px-4">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-white">Welcome Back to TaskBooth</h2>
                    <p className="mt-2 text-sm text-white/70">
                        Sign in to your account to continue
                    </p>
                </div>

                <div className="glass-morphism rounded-xl p-8 border border-white/20">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                                <p className="text-red-300 text-sm">{error}</p>
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                                Email Address
                            </label>
                            <Input
                                id="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                placeholder="Enter your email"
                                className="w-full"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                                Password
                            </label>
                            <Input
                                id="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={(e) => handleInputChange('password', e.target.value)}
                                placeholder="Enter your password"
                                className="w-full"
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    checked={formData.rememberMe}
                                    onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-white/80">
                                    Remember me
                                </label>
                            </div>

                            <div className="text-sm">
                                <button
                                    type="button"
                                    className="font-medium text-primary-300 hover:text-primary-200 transition-colors"
                                >
                                    Forgot password?
                                </button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading || !formData.email || !formData.password}
                        >
                            {isLoading ? 'Signing in...' : 'Sign in'}
                        </Button>

                        <div className="text-center">
                            <p className="text-sm text-white/70">
                                Don't have an account?{' '}
                                <button
                                    type="button"
                                    onClick={onToggleMode}
                                    className="font-medium text-primary-300 hover:text-primary-200 transition-colors"
                                >
                                    Sign up
                                </button>
                            </p>
                        </div>

                        <div className="mt-6 text-xs text-white/50 space-y-1">
                            <p><strong>Demo accounts:</strong></p>
                            <p>Admin: admin@example.com / password123</p>
                            <p>User: user@example.com / password123</p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
