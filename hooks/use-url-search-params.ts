import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
interface UseUrlSearchParamsOptions<T> {
  defaultParams: T;
  paramMapping?: Partial<Record<keyof T, string>>;
  parseParam?: (key: keyof T, value: string) => any;
  formatParam?: (key: keyof T, value: any) => string;
}
export function useUrlSearchParams<T extends Record<string, any>>({
  defaultParams,
  paramMapping,
  parseParam,
  formatParam,
}: UseUrlSearchParamsOptions<T>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  // Initialize params from URL
  const [params, setParams] = useState<T>(() => {
    const urlParams = { ...defaultParams };
    Object.keys(defaultParams).forEach((key) => {
      const paramKey = paramMapping?.[key as keyof T] || key;
      const value = searchParams.get(paramKey);
      if (value !== null) {
        if (parseParam) {
          urlParams[key as keyof T] = parseParam(key as keyof T, value);
        } else {
          // Default parsing logic
          if (typeof defaultParams[key as keyof T] === "number") {
            urlParams[key as keyof T] = parseInt(value) as T[keyof T];
          } else if (typeof defaultParams[key as keyof T] === "boolean") {
            urlParams[key as keyof T] = (value === "true") as T[keyof T];
          } else {
            urlParams[key as keyof T] = value as T[keyof T];
          }
        }
      }
    });

    return urlParams;
  });
  // Update URL when params change
  const updateURL = useCallback(
    (newParams: T) => {
      startTransition(() => {
        // Start with current URL parameters to preserve unmanaged params
        const currentSearchParams = new URLSearchParams(window.location.search);
        Object.entries(newParams).forEach(([key, value]) => {
          const paramKey = paramMapping?.[key as keyof T] || key;
          if (value !== undefined && value !== null && value !== "") {
            const paramValue = formatParam
              ? formatParam(key as keyof T, value)
              : String(value);
            currentSearchParams.set(paramKey, paramValue);
          } else {
            // Remove the parameter if value is empty/null/undefined
            currentSearchParams.delete(paramKey);
          }
        });
        router.replace(`?${currentSearchParams.toString()}`);
      });
    },
    [router, paramMapping, formatParam]
  );
  const updateParams = useCallback(
    (newParams: Partial<T>) => {
      setParams((prevParams) => {
        const updatedParams = { ...prevParams, ...newParams };
        updateURL(updatedParams);

        return updatedParams;
      });
    },
    [updateURL]
  );
  const resetParams = useCallback(() => {
    setParams(defaultParams);
    updateURL(defaultParams);
  }, [defaultParams, updateURL]);
  const setParamsAndURL = useCallback(
    (newParams: T) => {
      setParams(newParams);
      updateURL(newParams);
    },
    [updateURL]
  );

  return {
    params,
    updateParams,
    resetParams,
    setParams: setParamsAndURL,
    isPending,
  };
}
