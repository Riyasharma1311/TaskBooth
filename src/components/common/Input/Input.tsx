import { InputHTMLAttributes, forwardRef, ReactNode } from 'react';
import { clsx } from '@/utils/helpers';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    icon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, helperText, icon, className, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-semibold text-white mb-2">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {icon && (
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <span className="text-gray-400">
                                {icon}
                            </span>
                        </div>
                    )}
                    <input
                        ref={ref}
                        className={clsx(
                            'input',
                            icon ? 'pl-12' : '',
                            error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : '',
                            className
                        )}
                        {...props}
                    />
                </div>
                {(error || helperText) && (
                    <div className="mt-2">
                        {error ? (
                            <p className="text-sm text-red-300 flex items-center gap-1">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {error}
                            </p>
                        ) : (
                            <p className="text-sm text-white/70">
                                {helperText}
                            </p>
                        )}
                    </div>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';
