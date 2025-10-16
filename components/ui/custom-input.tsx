import { EyeIcon, EyeOffIcon } from "lucide-react";
import React, { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { SearchIcon } from "@/assets/icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Option = {
  value: string | number;
  label: string;
  disabled?: boolean;
};

type Options = Option[] | string[];

interface CustomInputProps {
  name: string;
  label?: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  onChange?: (value: string) => void;
  select?: boolean;
  options?: Options;
  showSearchIcon?: boolean;
  dropdownTitle?: string;
  suffix?: string;
  prefix?: string;
  loading?: boolean;
  textarea?: boolean;
}

const CustomInput: React.FC<CustomInputProps> = ({
  name,
  label = "",
  type = "text",
  placeholder = "",
  required = false,
  disabled = false,
  onChange,
  select = false,
  options = [],
  showSearchIcon = false,
  dropdownTitle = "",
  suffix = "",
  prefix = "",
  loading = false,
}) => {
  const { control } = useFormContext();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleNumberKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const invalidChars = ["e", "E", "+", "-", ","];

    // Block invalid characters
    if (invalidChars.includes(e.key)) {
      e.preventDefault();
    }

    // Prevent multiple dots
    const inputValue = (e.target as HTMLInputElement).value;
    if (e.key === "." && inputValue.includes(".")) {
      e.preventDefault();
    }
  };

  if (select)
    return (
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <div className="flex flex-col gap-1">
            {label && (
              <label className="text-gray-700 text-sm font-medium">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}
            <div className="relative">
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  if (onChange) onChange(value);
                }}
                {...field}
                disabled={disabled || loading}
              >
                <SelectTrigger
                  className={` border-gray-200 rounded-lg text-gray-800 text-sm bg-gray-50 shadow-none outline-0 h-auto focus:ring-0 focus:ring-offset-0 ring-0 focus:outline-none focus-visible:outline-none focus-visible:ring-0 ${
                    error ? "border-red-500" : "border-gray-300"
                  } ${disabled ? "bg-gray-200" : "bg-gray-50"}`}
                >
                  <div className="flex flex-col items-start gap-1">
                    <div className="relative flex items-center text-sm text-gray-800">
                      <SelectValue placeholder={placeholder || "Select"} />
                    </div>
                  </div>
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  className="bg-white border-none top-0 px-0"
                >
                  {options.map((option, index) => (
                    <SelectItem
                      key={index}
                      value={
                        typeof option === "string"
                          ? option
                          : option?.value?.toString()
                      }
                      disabled={
                        typeof option === "object" ? option.disabled : false
                      }
                    >
                      {typeof option === "string"
                        ? option
                        : option?.label || option?.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {error && (
              <span className="text-red-500 text-xs">{error.message}</span>
            )}
          </div>
        )}
      />
    );

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className="flex flex-col gap-1">
          {label && (
            <label className="text-gray-700 text-sm font-medium">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}
          {type === "text" && showSearchIcon && (
            <span className="py-2">{dropdownTitle}</span>
          )}

          <div className="relative">
            {/* Conditionally render the search icon */}
            {type === "text" && showSearchIcon && (
              <div className="h-4 w-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <SearchIcon />
              </div>
            )}

            {type === "text" && suffix.length > 0 && (
              <span className="text-gray-500 text-sm absolute right-3 z-10 top-1/3 -translate-y-1 pointer-events-none">
                {suffix}
              </span>
            )}
            {type === "number" && prefix.length > 0 && (
              <span className="text-gray-500 text-sm absolute left-3 z-10 top-1/3 -translate-y-1 pointer-events-none">
                {prefix}
              </span>
            )}

            <input
              {...field}
              type={
                type === "password"
                  ? showPassword
                    ? "text"
                    : "password"
                  : type
              }
              placeholder={placeholder}
              disabled={disabled}
              className={`flex h-10 w-full rounded-lg border border-gray-200 px-4 py-2 text-base ring-offset-0 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm ${
                error ? "border-red-500" : "border-gray-300"
              } ${disabled ? "bg-gray-200" : "bg-gray-50"} 
              ${type === "text" && showSearchIcon ? "pl-10" : ""}
               ${type === "number" && prefix.length > 0 ? "pl-7" : ""}
              ${type === "number" ? "appearance-auto " : ""}`}
              onChange={(e) => {
                // Handle number inputs differently
                if (type === "number") {
                  const value = e.target.value;
                  // Convert to number or null if empty
                  const numValue = value === "" ? null : Number(value);
                  field.onChange(numValue);
                  if (onChange) onChange(String(numValue));
                } else {
                  field.onChange(e.target.value);
                  if (onChange) onChange(e.target.value);
                }
              }}
              onKeyDown={type === "number" ? handleNumberKeyDown : undefined}
              onWheel={(e) => {
                // Prevent the input value from changing on mouse wheel scroll
                if (type === "number") {
                  (e.target as HTMLInputElement).blur();
                }
              }}
            />

            {/* Password toggle icon */}
            {type === "password" && (
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
              >
                {showPassword ? (
                  <EyeOffIcon size={15} />
                ) : (
                  <EyeIcon size={15} />
                )}
              </button>
            )}
          </div>

          {error && (
            <span className="text-red-500 text-xs">{error.message}</span>
          )}
        </div>
      )}
    />
  );
};

export default CustomInput;
