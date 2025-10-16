"use client";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";

import { SearchIcon } from "@/assets/icons";
import { useDebounce } from "@/hooks/use-debounce";

import { Input } from "./input";

interface CustomSearchFieldProps {
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  onChange?: (value: string) => void;
  className?: string;
}

export interface CustomSearchFieldRef {
  clear: () => void;
  getValue: () => string;
  setValue: (value: string) => void;
}

const CustomSearchField = forwardRef<
  CustomSearchFieldRef,
  CustomSearchFieldProps
>(
  (
    {
      placeholder = "Search here",
      disabled = false,
      loading = false,
      onChange,
      className,
      ...rest
    },
    ref
  ) => {
    const [searchValue, setSearchValue] = useState<string>("");
    const debouncedValue = useDebounce(searchValue, 500);

    const clearSearch = () => setSearchValue("");

    useImperativeHandle(
      ref,
      () => ({
        clear: clearSearch,
        getValue: () => searchValue,
        setValue: (value: string) => setSearchValue(value),
      }),
      [searchValue]
    );

    useEffect(() => {
      if (onChange) onChange(debouncedValue);
    }, [debouncedValue, onChange]);

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchValue(value);
    };

    return (
      <div className={`relative flex items-center w-full ${className}`}>
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <SearchIcon />
        </span>
        <Input
          type="text"
          className="pl-8"
          {...rest}
          placeholder={placeholder}
          disabled={disabled || loading}
          onChange={handleTextChange}
          value={searchValue} // Make input controlled
        />
        {loading && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2">
            <span className="inline-block w-5 h-5 border-2 border-gray-300 border-t-primary-500 rounded-full animate-spin"></span>
          </span>
        )}
      </div>
    );
  }
);

CustomSearchField.displayName = "CustomSearchField";

export default CustomSearchField;
