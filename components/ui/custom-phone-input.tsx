"use client";

import "react-phone-input-2/lib/style.css";

import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import PhoneInput from "react-phone-input-2";

interface CustomPhoneInputProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

const CustomPhoneInput: React.FC<CustomPhoneInputProps> = ({
  name,
  label,
  placeholder = "Enter phone number",
  required,
  disabled,
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <PhoneInput
            {...field}
            country="us"
            value={field.value || ""}
            onChange={(value) => field.onChange(value)}
            disabled={disabled}
            placeholder={placeholder}
            inputClass={`flex !h-10 !w-full !rounded-lg border !py-2 !text-base ring-offset-0 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-0 focus-visible:ring-offset-0 !disabled:cursor-not-allowed !disabled:opacity-50 !md:text-sm ${
              error ? "!border-red-500" : "!border-gray-300"
            } ${disabled ? "!bg-gray-200" : "!bg-gray-50"}`}
            buttonClass="!border-none !border-r !bg-transparent hover:!bg-transparent focus:bg-transparent active:bg-transparent"
            containerClass="!relative"
            autoFormat
            specialLabel=""
          />
        )}
      />

      {error && (
        <p className="text-sm text-red-600 mt-1">{error.message as string}</p>
      )}
    </div>
  );
};

export default CustomPhoneInput;
