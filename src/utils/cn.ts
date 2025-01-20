import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes safely with conditional classes
 * @param {...ClassValue[]} inputs - Array of class names, objects, or arrays of class names
 * @returns {string} - Merged and deduped class names
 * 
 * @example
 * // Simple usage
 * cn('px-2 py-1', 'bg-blue-500') // => 'px-2 py-1 bg-blue-500'
 * 
 * // With conditions
 * cn('px-2', { 'bg-blue-500': isActive, 'bg-gray-500': !isActive })
 * 
 * // With Tailwind class conflicts
 * cn('px-2 py-1 bg-red-500', 'bg-blue-500') // => 'px-2 py-1 bg-blue-500'
 */
export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}

// Types d'utilité pour les variantes de styles
export type VariantProps<T> = {
    [K in keyof T]: T[K] extends Record<string, string> ? keyof T[K] : never;
};

// Types pour les variantes de couleurs
export type ColorVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger';

// Types pour les tailles
export type SizeVariant = 'sm' | 'md' | 'lg' | 'xl';