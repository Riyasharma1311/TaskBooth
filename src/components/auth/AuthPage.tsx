import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

export const AuthPage = () => {
    const [isLoginMode, setIsLoginMode] = useState(true);

    const toggleMode = () => {
        setIsLoginMode(!isLoginMode);
    };

    if (isLoginMode) {
        return <LoginForm onToggleMode={toggleMode} />;
    }

    return <RegisterForm onToggleMode={toggleMode} />;
};
