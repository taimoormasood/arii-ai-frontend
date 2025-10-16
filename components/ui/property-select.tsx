"use client";

import type { InfiniteData } from "@tanstack/react-query";
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
import type { GetPropertiesResponse } from "@/hooks/api/use-properties";
import { useGetInfiniteProperties } from "@/hooks/api/use-properties";
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

interface PropertySelectProps {
  label?: string;
  required?: boolean;
  value: string | undefined;
  onValueChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
  error?: string;
  className?: string;
  searchPlaceholder?: string;
  // Return additional property data when selected
  includePropertyData?: boolean;
  onPropertySelect?: (
    property: { id: string; type: string } | undefined
  ) => void;
}

export default function PropertySelect({
  label,
  required = false,
  value,
  onValueChange,
  placeholder,
  disabled = false,
  error,
  className = "",
  searchPlaceholder = "Search properties...",
  includePropertyData = false,
  onPropertySelect,
}: PropertySelectProps) {
  const [inputValue, setInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isPending, startTransition] = useTransition();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const deferredSearchTerm = useDeferredValue(searchTerm);
  const debouncedSearchTerm = useDebounce(deferredSearchTerm, 300);

  // Infinite query for properties
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useGetInfiniteProperties({
    ...(debouncedSearchTerm ? { q: debouncedSearchTerm } : {}),
    limit: 30,
  } as any);

  // Flatten properties from all pages
  type PropertyOption = { value: string; label: string; type: string };
  const properties = useMemo<PropertyOption[]>(() => {
    if (!data) return [];

    // Handle infinite query structure with nested data
    if ("pages" in data) {
      const infiniteData = data as unknown as InfiniteData<any>;

      return infiniteData.pages.flatMap((page: any) => {
        // Check if page has data.results structure (as shown in the response)
        if (page?.data?.results && Array.isArray(page.data.results)) {
          return page.data.results.map((item: any) => ({
            value: item.id != null ? String(item.id) : "",
            label: item.name ?? "Unnamed Property",
            type: item.type ?? "",
          }));
        }
        // Fallback for direct data array
        if (Array.isArray(page?.data)) {
          return page.data.map((item: any) => ({
            value: item.id != null ? String(item.id) : "",
            label: item.name ?? "Unnamed Property",
            type: item.type ?? "",
          }));
        }

        return [];
      });
    }

    // Handle direct array (fallback)
    if (Array.isArray(data.pages)) {
      return data.pages.map((item: any) => ({
        value: item.id != null ? String(item.id) : "",
        label: item.name ?? "Unnamed Property",
        type: item.type ?? "",
      }));
    }

    return [];
  }, [data]);

  const totalCount =
    (data &&
      "pages" in data &&
      (data as unknown as InfiniteData<GetPropertiesResponse>).pages[0]?.data
        ?.count) ||
    (data &&
      "pages" in data &&
      (data as unknown as InfiniteData<any>).pages[0]?.data?.results?.length) ||
    0;

  // Intersection observer for infinite scroll
  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage) return;

    const timeoutId = setTimeout(() => {
      if (!loadMoreRef.current) return;
      let scrollContainer =
        loadMoreRef.current.closest("[data-radix-scroll-area-viewport]") ||
        loadMoreRef.current.closest(".overflow-y-auto") ||
        loadMoreRef.current.closest("[data-radix-select-content]");
      if (!scrollContainer) {
        scrollContainer =
          document.querySelector("[data-radix-select-content]") ||
          document.querySelector(".overflow-y-auto");
      }
      if (!scrollContainer) return;
      const observer = new IntersectionObserver(
        (entries) => {
          const target = entries[0];
          if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        },
        {
          root: scrollContainer,
          rootMargin: "50px",
          threshold: 0.1,
        }
      );
      observer.observe(loadMoreRef.current);

      return () => {
        observer.disconnect();
      };
    }, 100);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, properties.length]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInputValue(newValue);
      startTransition(() => {
        setSearchTerm(newValue);
      });
    },
    [startTransition]
  );

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
  }, [properties.length, inputValue]);

  const handleValueChange = useCallback(
    (selectedValue: string) => {
      setInputValue("");
      setSearchTerm("");
      onValueChange(selectedValue);

      // If includePropertyData is enabled, also call onPropertySelect with property data
      if (includePropertyData && onPropertySelect) {
        const selectedProperty = properties.find(
          (p: PropertyOption) => p.value === selectedValue
        );
        if (selectedProperty) {
          onPropertySelect({
            id: selectedProperty.value,
            type: selectedProperty.type,
          });
        } else {
          onPropertySelect(undefined);
        }
      }
    },
    [onValueChange, includePropertyData, onPropertySelect, properties]
  );

  const selectedPropertyLabel = properties.find(
    (p: PropertyOption) => p.value === value
  )?.label;
  const memoizedProperties = useMemo(() => properties, [properties]);

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
            setInputValue("");
            setSearchTerm("");
          }
        }}
      >
        <SelectTrigger
          className={`m-0 border-gray-200 rounded-lg text-gray-800 text-sm bg-gray-50 shadow-none outline-0 h-auto focus:ring-0 focus:ring-offset-0 ring-0 focus:outline-none focus-visible:outline-none focus-visible:ring-0 ${
            error ? "border-red-500" : "border-gray-300"
          } ${disabled ? "bg-gray-200" : "bg-gray-50"}`}
        >
          <div className="flex items-center">
            <SelectValue placeholder={placeholder}>
              {selectedPropertyLabel || placeholder}
            </SelectValue>
          </div>
        </SelectTrigger>
        <SelectContent
          className="max-h-60 overflow-y-auto bg-white border-gray-200"
          onCloseAutoFocus={(e) => {
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
              {isPending ? "Searching..." : "Loading properties..."}
            </div>
          )}

          {/* Error State */}
          {isError && (
            <div className="px-2 py-3 text-sm text-red-500 text-center">
              Failed to load properties. Please try again.
            </div>
          )}

          {/* No Results */}
          {!isLoading &&
            !isError &&
            !isPending &&
            properties.length === 0 &&
            debouncedSearchTerm && (
              <div className="px-2 py-3 text-sm text-gray-500 text-center">
                No properties found for "{debouncedSearchTerm}"
              </div>
            )}

          {/* Properties List */}
          <div className={isPending ? "opacity-50 transition-opacity" : ""}>
            {memoizedProperties.map((property: PropertyOption) => (
              <SelectItem key={property.value} value={property.value}>
                {property.label}
              </SelectItem>
            ))}
          </div>

          {/* Infinite Scroll Trigger */}
          {hasNextPage && (
            <div ref={loadMoreRef} className="px-2 py-2 text-center">
              {isFetchingNextPage ? (
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading more properties...
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-sm text-gray-500">
                    Scroll for more properties
                  </div>
                  <button
                    onClick={() => {
                      fetchNextPage();
                    }}
                    className="text-sm text-primary-600 hover:text-primary-800 underline"
                  >
                    Load More Properties
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Total Count Display */}
          {!isLoading && !isPending && properties.length > 0 && (
            <div className="px-2 py-1 text-xs text-gray-400 text-center border-t">
              {properties.length} of {totalCount} properties
            </div>
          )}
        </SelectContent>
      </Select>
      {error && <span className="text-red-500 text-xs">{error}</span>}
    </div>
  );
}
