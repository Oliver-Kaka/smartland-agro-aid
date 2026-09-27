/**
 * Extracts a user-friendly message from an edge function error.
 * The Supabase client throws a generic "Edge Function returned a non-2xx
 * status code" error; the real message lives in the response body.
 */
export async function getFriendlyErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again."
): Promise<string> {
  // FunctionsHttpError carries the raw Response on `context`
  const context = (error as { context?: Response })?.context;
  if (context && typeof context.json === "function") {
    try {
      const body = await context.clone().json();
      if (body && typeof body.error === "string" && body.error.trim()) {
        return body.error;
      }
    } catch {
      // body wasn't JSON — fall through
    }
  }

  const message = (error as Error)?.message;
  if (message) {
    // Hide raw SDK / network jargon from users
    if (message.includes("non-2xx")) {
      return "The AI service could not complete the request. Please try again.";
    }
    if (message.includes("Failed to fetch") || message.includes("NetworkError")) {
      return "Could not reach the server. Check your internet connection and try again.";
    }
    return message;
  }

  return fallback;
}
