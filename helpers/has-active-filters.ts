/**
 * Checks if any field in `current` differs from `defaults`.
 * Works with flat or nested objects. Uses shallow comparison.
 */
export const hasActiveFilters = <T extends Record<string, any>>(
  current: T,
  defaults: T
): boolean => {
  return Object.keys(current).some((key) => {
    const currentVal = current[key];
    const defaultVal = defaults[key];

    // Handle arrays
    if (Array.isArray(currentVal) && Array.isArray(defaultVal)) {
      return (
        currentVal.length !== defaultVal.length ||
        currentVal.some((val, i) => val !== defaultVal[i])
      );
    }

    // Handle other types (string, boolean, number, null)
    return currentVal !== defaultVal;
  });
};
