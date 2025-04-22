import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

/**
 * Combines multiple class names using clsx and tailwind-merge
 * This allows for conditional classes and proper handling of Tailwind classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date using the date-fns library
 * Default format is 'PPP' (e.g., April 20th, 2025)
 */
export function formatDate(date: Date | string, formatStr: string = 'PPP'): string {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  
  return format(date, formatStr);
}

/**
 * Creates a simple debounce function
 * Useful for search inputs and other frequent updates
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function(...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
