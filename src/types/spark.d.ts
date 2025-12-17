/**
 * Type declarations for the GitHub Spark environment.
 */

interface SparkUser {
  isOwner: boolean
}

interface Window {
  spark: {
    /**
     * Call an LLM with a prompt.
     * @param prompt - The prompt to send to the LLM
     * @param model - The model to use (e.g., "gpt-4o")
     * @param json - Whether to request JSON output
     * @returns The LLM response as a string
     */
    llm: (prompt: string, model: string, json: boolean) => Promise<string>

    /**
     * Get information about the current user.
     * @returns User information including isOwner status, or null if not available
     */
    user: () => Promise<SparkUser | null>
  }
}
