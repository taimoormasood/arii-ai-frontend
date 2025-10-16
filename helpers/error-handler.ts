type ErrorWithError = { error: string | { error: string } };
type ErrorWithMessage = { message: string };

export function errorHandler(error: unknown): string {
  if (typeof error === "string") return error;

  if (typeof error === "object" && error !== null && "error" in error) {
    const errorValue = (error as ErrorWithError).error;

    if (typeof errorValue === "string") {
      return errorValue;
    }

    if (
      typeof errorValue === "object" &&
      errorValue !== null &&
      "error" in errorValue &&
      typeof errorValue.error === "string"
    ) {
      return errorValue.error;
    }

    // Fallback if errorValue is an object but doesn't match
    return JSON.stringify(errorValue);
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as ErrorWithMessage).message === "string"
  ) {
    return (error as ErrorWithMessage).message;
  }

  return JSON.stringify(error) || "An unexpected error occurred.";
}
