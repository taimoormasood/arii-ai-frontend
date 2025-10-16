import React from "react";
import { Controller, useFormContext } from "react-hook-form";

import { cn } from "@/lib/utils";

interface CustomTextareaProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  onChange?: (value: string) => void;
  rows?: number;
  className?: string;
}

const CustomTextarea: React.FC<CustomTextareaProps> = ({
  name,
  label = "",
  placeholder = "",
  required = false,
  disabled = false,
  onChange,
  rows = 4,
  className = "",
}) => {
  const { control } = useFormContext();

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
          <textarea
            {...field}
            placeholder={placeholder}
            disabled={disabled}
            rows={rows}
            onChange={(e) => {
              field.onChange(e);
              if (onChange) onChange(e.target.value);
            }}
            className={cn(
              "flex min-h-[80px] w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-base ring-offset-0 placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
              error && "border-red-500",
              disabled && "bg-gray-400",
              className
            )}
          />
          {error && (
            <span className="text-red-500 text-xs">{error.message}</span>
          )}
        </div>
      )}
    />
  );
};

export default CustomTextarea;
