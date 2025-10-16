"use client";

import { Loader2, Search } from "lucide-react";
import {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFlattenedCities } from "@/hooks/api/use-cities";
import { cn } from "@/lib/utils";

// Debounce hook for search optimization
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

interface CitySelectProps {
  label?: string;
  required?: boolean;
  value: string | undefined;
  onValueChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
  error?: string;
  className?: string;
  searchPlaceholder?: string;
}

export default function CitySelect({
  label,
  required = false,
  value,
  onValueChange,
  placeholder,
  disabled = false,
  error,
  className = "",
  searchPlaceholder = "Search cities...",
}: CitySelectProps) {
  const [inputValue, setInputValue] = useState(""); // Immediate input value
  const [searchTerm, setSearchTerm] = useState(""); // Search term for API
  const [isPending, startTransition] = useTransition();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Use deferred value for search to avoid blocking UI
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const debouncedSearchTerm = useDebounce(deferredSearchTerm, 300);

  // Use the infinite cities query
  const {
    cities,
    totalCount,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFlattenedCities({
    search: debouncedSearchTerm,
    limit: 30,
    enabled: !disabled,
  });

  // Intersection observer for infinite scroll with fallback
  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage) return;

    // Use a timeout to ensure the DOM is fully rendered
    const timeoutId = setTimeout(() => {
      if (!loadMoreRef.current) return;

      // Find the scroll container (SelectContent) - try multiple approaches
      let scrollContainer =
        loadMoreRef.current.closest("[data-radix-scroll-area-viewport]") ||
        loadMoreRef.current.closest(".overflow-y-auto") ||
        loadMoreRef.current.closest("[data-radix-select-content]");

      // If still not found, try to find it in the document
      if (!scrollContainer) {
        scrollContainer =
          document.querySelector("[data-radix-select-content]") ||
          document.querySelector(".overflow-y-auto");
      }

      if (!scrollContainer) {
        // Retry with longer delay
        const retryTimeoutId = setTimeout(() => {
          const retryContainer =
            document.querySelector("[data-radix-select-content]") ||
            document.querySelector(".overflow-y-auto");
          if (retryContainer && loadMoreRef.current) {
            const observer = new IntersectionObserver(
              (entries) => {
                const target = entries[0];
                if (
                  target.isIntersecting &&
                  hasNextPage &&
                  !isFetchingNextPage
                ) {
                  fetchNextPage();
                }
              },
              {
                root: retryContainer,
                rootMargin: "50px",
                threshold: 0.1,
              }
            );
            observer.observe(loadMoreRef.current);

            // Store observer for cleanup
            (loadMoreRef.current as any).__observer = observer;
          }
        }, 300);

        return () => clearTimeout(retryTimeoutId);
      }

      // Intersection Observer
      const observer = new IntersectionObserver(
        (entries) => {
          const target = entries[0];

          if (target.isIntersecting && hasNextPage && !isFetchingNextPage)
            fetchNextPage();
        },
        {
          root: scrollContainer,
          rootMargin: "50px",
          threshold: 0.1,
        }
      );

      // Fallback scroll event listener
      const handleScroll = () => {
        if (!scrollContainer || !hasNextPage || isFetchingNextPage) return;

        const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
        const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;

        if (isNearBottom) {
          fetchNextPage();
        }
      };

      observer.observe(loadMoreRef.current);
      scrollContainer.addEventListener("scroll", handleScroll, {
        passive: true,
      });

      // Store cleanup function
      return () => {
        observer.disconnect();
        scrollContainer.removeEventListener("scroll", handleScroll);

        // Clean up retry observer if it exists
        if (loadMoreRef.current && (loadMoreRef.current as any).__observer) {
          (loadMoreRef.current as any).__observer.disconnect();
          delete (loadMoreRef.current as any).__observer;
        }
      };
    }, 100); // Small delay to ensure DOM is ready

    return () => {
      clearTimeout(timeoutId);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, cities.length]); // Add cities.length to dependencies

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      // Update input immediately (synchronous, no lag)
      setInputValue(newValue);
      // Use transition only for search term (non-blocking API calls)
      startTransition(() => {
        setSearchTerm(newValue);
      });
    },
    [startTransition]
  );

  // Keep input focused when search results change
  useEffect(() => {
    if (searchInputRef.current && inputValue) {
      const timer = setTimeout(() => {
        if (
          searchInputRef.current &&
          document.activeElement !== searchInputRef.current
        ) {
          searchInputRef.current.focus();
        }
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [cities.length, inputValue]);

  // Clear search when a selection is made
  const handleValueChange = useCallback(
    (selectedValue: string) => {
      setInputValue("");
      setSearchTerm("");
      onValueChange(selectedValue);
    },
    [onValueChange]
  );

  // Find the selected city label for display
  const selectedCityLabel = cities.find((city) => city.value === value)?.label;

  // Memoize cities list to prevent unnecessary re-renders during search
  const memoizedCities = useMemo(() => cities, [cities]);

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="text-gray-700 text-sm font-medium">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <Select
        value={value}
        onValueChange={handleValueChange}
        disabled={disabled}
        onOpenChange={(open) => {
          if (open) {
            // Reset search when dropdown opens
            setInputValue("");
            setSearchTerm("");
          }
        }}
      >
        <SelectTrigger
          className={`border-gray-200 rounded-lg text-gray-800 text-sm bg-gray-50 shadow-none outline-0 h-auto focus:ring-0 focus:ring-offset-0 ring-0 focus:outline-none focus-visible:outline-none focus-visible:ring-0 ${
            error ? "border-red-500" : "border-gray-300"
          } ${disabled ? "bg-gray-200" : "bg-gray-50"}`}
        >
          <div className="flex items-center">
            <SelectValue placeholder={placeholder}>
              {selectedCityLabel || placeholder}
            </SelectValue>
          </div>
        </SelectTrigger>
        <SelectContent
          className="max-h-60 overflow-y-auto bg-white border-gray-200"
          onCloseAutoFocus={(e) => {
            // Prevent auto-focus when closing to maintain search input focus
            if (searchInputRef.current) {
              e.preventDefault();
            }
          }}
        >
          {/* Search Input */}
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-2">
            <div className="relative">
              <Search
                className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors ${
                  isPending ? "text-primary-500" : "text-gray-400"
                }`}
              />
              <Input
                ref={searchInputRef}
                placeholder={searchPlaceholder}
                value={inputValue}
                onChange={handleSearchChange}
                className={`pl-9 h-8 text-sm border-gray-200 focus:border-primary-500 focus:ring-primary-500 transition-colors ${
                  isPending ? "border-primary-300" : "border-gray-200"
                }`}
                autoFocus
              />
              {isPending && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary-500" />
                </div>
              )}
            </div>
          </div>

          {/* Loading State */}
          {(isLoading || isPending) && (
            <div className="px-2 py-3 text-sm text-gray-500 text-center">
              <Loader2 className="h-4 w-4 animate-spin mx-auto mb-1" />
              {isPending ? "Searching..." : "Loading cities..."}
            </div>
          )}

          {/* Error State */}
          {isError && (
            <div className="px-2 py-3 text-sm text-red-500 text-center">
              Failed to load cities. Please try again.
            </div>
          )}

          {/* No Results */}
          {!isLoading &&
            !isError &&
            !isPending &&
            cities.length === 0 &&
            debouncedSearchTerm && (
              <div className="px-2 py-3 text-sm text-gray-500 text-center">
                No cities found for "{debouncedSearchTerm}"
              </div>
            )}

          {/* Cities List */}
          <div className={isPending ? "opacity-50 transition-opacity" : ""}>
            {memoizedCities.map((city) => (
              <SelectItem key={city.value} value={city.value}>
                {city.label}
              </SelectItem>
            ))}
          </div>

          {/* Infinite Scroll Trigger */}
          {hasNextPage && (
            <div ref={loadMoreRef} className="px-2 py-2 text-center">
              {isFetchingNextPage ? (
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading more cities...
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-sm text-gray-500">
                    Scroll for more cities
                  </div>
                  <button
                    onClick={() => {
                      fetchNextPage();
                    }}
                    className="text-sm text-primary-600 hover:text-primary-800 underline"
                  >
                    Load More Cities
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Total Count Display */}
          {!isLoading && !isPending && cities.length > 0 && (
            <div className="px-2 py-1 text-xs text-gray-400 text-center border-t">
              {cities.length} of {totalCount} cities
            </div>
          )}
        </SelectContent>
      </Select>
      {error && <span className="text-red-500 text-xs">{error}</span>}
    </div>
  );
}
