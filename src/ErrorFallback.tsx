/**
 * Error Fallback Component
 * 
 * Displayed when an unhandled error occurs in the application.
 * Provides error details and a retry button.
 * 
 * @module ErrorFallback
 */

import { Alert, AlertTitle, AlertDescription } from "./components/ui/alert";
import { Button } from "./components/ui/button";
import type { FallbackProps } from "react-error-boundary";

import { AlertTriangleIcon, RefreshCwIcon } from "lucide-react";

/**
 * Error boundary fallback UI.
 * 
 * Features:
 * - Displays error message in a destructive alert
 * - Shows error details for debugging
 * - Provides retry button to reset the boundary
 * - In dev mode, rethrows errors for better debugging
 * 
 * @example
 * ```tsx
 * <ErrorBoundary FallbackComponent={ErrorFallback}>
 *   <App />
 * </ErrorBoundary>
 * ```
 */
export const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  // When encountering an error in the development mode, rethrow it and don't display the boundary.
  // The parent UI will take care of showing a more helpful dialog.
  if (import.meta.env.DEV) {throw error;}

  const errorMessage = error instanceof Error ? error.message : 'Unknown error'

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Alert variant="destructive" className="mb-6">
          <AlertTriangleIcon />
          <AlertTitle>An unexpected error occurred</AlertTitle>
          <AlertDescription>
            Something unexpected happened while running the application. The error details are shown below. Please try refreshing the page or contact support if the issue persists.
          </AlertDescription>
        </Alert>
        
        <div className="bg-card border rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-sm text-muted-foreground mb-2">Error Details:</h3>
          <pre className="text-xs text-destructive bg-muted/50 p-3 rounded border overflow-auto max-h-32">
            {errorMessage}
          </pre>
        </div>
        
        <Button 
          onClick={resetErrorBoundary} 
          className="w-full"
          variant="outline"
        >
          <RefreshCwIcon />
          Try Again
        </Button>
      </div>
    </div>
  );
}
