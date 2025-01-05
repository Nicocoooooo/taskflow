import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

// Définition des variants du bouton
const buttonVariants = cva(
    // Base styles
    'inline-flex items-center justify-center rounded-2xl transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2',
    {
        variants: {
            variant: {
                primary: 'bg-violet-600 text-white hover:bg-violet-700 active:bg-violet-800',
                secondary: 'bg-violet-100 text-violet-900 hover:bg-violet-200 active:bg-violet-300',
                danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
                ghost: 'hover:bg-violet-100 hover:text-violet-900',
            },
            size: {
                sm: 'h-9 px-4 text-sm',
                md: 'h-10 px-6 text-base',
                lg: 'h-12 px-8 text-lg',
            },
            fullWidth: {
                true: 'w-full',
            },
        },
        defaultVariants: {
            variant: 'primary',
            size: 'md',
        },
    }
);

// Props du composant
interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    children: React.ReactNode;
    isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, fullWidth, isLoading, children, disabled, ...props }, ref) => {
        return (
            <button
                className={cn(
                    buttonVariants({ variant, size, fullWidth, className }),
                    disabled && 'opacity-50 cursor-not-allowed',
                    isLoading && 'opacity-50 cursor-wait'
                )}
                disabled={disabled || isLoading}
                ref={ref}
                {...props}
            >
                {isLoading ? (
                    <span className="flex items-center">
                        <svg
                            className="w-4 h-4 mr-2 animate-spin"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                        </svg>
                        Chargement...
                    </span>
                ) : (
                    children
                )}
            </button>
        );
    }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
export type { ButtonProps };