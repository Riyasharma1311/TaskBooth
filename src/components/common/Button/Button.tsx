import { ButtonHTMLAttributes, ReactNode } from 'react';
import { clsx } from '@/utils/helpers';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
    children: ReactNode;
    icon?: ReactNode;
}

export const Button = ({
    variant = 'primary',
    size = 'md',
    isLoading = false,
    children,
    icon,
    className,
    disabled,
    ...props
}: ButtonProps) => {
    const baseClasses = 'btn';

    const variantClasses: Record<ButtonVariant, string> = {
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        outline: 'btn-outline',
        danger: 'btn-danger',
        ghost: 'bg-gray-100 hover:bg-gray-200 text-gray-700 backdrop-blur-sm border border-gray-300 focus:ring-gray-300',
    };

    const sizeClasses: Record<ButtonSize, string> = {
        sm: 'px-3 py-1.5 text-xs gap-1',
        md: 'px-4 py-2 text-sm gap-2',
        lg: 'px-6 py-3 text-base gap-2',
    };

    return (
        <button
            className={clsx(
                baseClasses,
                variantClasses[variant],
                sizeClasses[size],
                'transition-all duration-300 transform active:scale-95',
                isLoading && 'cursor-not-allowed opacity-50',
                className
            )}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <div className="flex items-center gap-2">
                    <div className="loading-spinner" />
                    <span>Loading...</span>
                </div>
            ) : (
                <div className="flex items-center justify-center">
                    {icon && (
                        <span className="flex-shrink-0">
                            {icon}
                        </span>
                    )}
                    <span>{children}</span>
                </div>
            )}
        </button>
    );
};
