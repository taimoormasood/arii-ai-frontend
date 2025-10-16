"use client";

import { Loader2 } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface SelectOption<T> {
  value: T;
  label: string;
}

interface CustomSelectProps<T extends string | number> {
  label?: string;
  required?: boolean;
  value?: T;
  onValueChange: (value: T) => void;
  placeholder?: string;
  options: SelectOption<T>[];
  disabled?: boolean;
  loading?: boolean;
  error?: string;
  className?: string;
}

export default function CustomSelect<T extends string | number>({
  label,
  required = false,
  value,
  onValueChange,
  placeholder,
  options,
  disabled = false,
  loading = false,
  error,
  className = "",
}: CustomSelectProps<T>) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="text-gray-700 text-sm font-medium">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <Select
        value={value !== undefined ? String(value) : undefined}
        onValueChange={(val) => {
          const selected = options.find((opt) => String(opt.value) === val);
          if (selected) onValueChange(selected.value);
        }}
        disabled={disabled || loading}
      >
        <SelectTrigger
          className={`min-w-24 border-gray-200 rounded-lg text-gray-800 text-sm bg-gray-50 shadow-none outline-0 h-auto focus:ring-0 focus:ring-offset-0 ring-0 focus:outline-none focus-visible:outline-none focus-visible:ring-0 ${
            error ? "border-red-500" : "border-gray-300"
          } ${disabled ? "bg-gray-200" : "bg-gray-50"}`}
        >
          <div className="flex items-center">
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            <SelectValue placeholder={placeholder} />
          </div>
        </SelectTrigger>
        <SelectContent className="max-h-60 overflow-y-auto bg-white border-gray-200">
          {options.map((option) => (
            <SelectItem key={String(option.value)} value={String(option.value)}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <span className="text-red-500 text-xs">{error}</span>}
    </div>
  );
}
