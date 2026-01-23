/**
 * Utility Functions
 * 
 * Common utility functions used throughout the application.
 * 
 * @module lib/utils
 */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines class names using clsx and tailwind-merge.
 * 
 * This utility merges Tailwind CSS classes intelligently, handling
 * conflicts (e.g., `p-2 p-4` becomes `p-4`) and conditional classes.
 * 
 * @param inputs - Class values to merge (strings, arrays, objects, etc.)
 * @returns Merged class name string
 * 
 * @example
 * ```tsx
 * // Basic usage
 * cn('px-2 py-1', 'px-4') // => 'py-1 px-4'
 * 
 * // With conditionals
 * cn('base-class', isActive && 'active-class')
 * 
 * // With objects
 * cn({ 'text-red-500': hasError, 'text-green-500': !hasError })
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Safely open an external URL in a new tab with security features.
 *
 * @param url - The URL to open
 * @param target - The window target (default: _blank)
 */
export function openExternal(url: string, target: '_blank' | string = '_blank') {
  if (typeof window === 'undefined') {
    return
  }

  window.open(url, target, 'noopener,noreferrer')
}
