import React from "react";
import { Controller, useFormContext } from "react-hook-form";

import { Checkbox } from "@/components/ui/checkbox";

interface CustomCheckboxProps {
  name: string;
  value?: string | boolean;
  stopPropagation?: boolean;
  onChange?: (val: boolean) => void;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  name,
  value,
  stopPropagation = false,
  onChange,
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const isArray = Array.isArray(field.value);
        const isChecked = isArray ? field.value.includes(value) : !!field.value;

        const toggleValue = () => {
          if (isArray) {
            const newValue = isChecked
              ? field.value.filter((v: string) => v !== value)
              : [...(field.value || []), value];
            field.onChange(newValue);
          } else {
            const newValue = !field.value;
            field.onChange(newValue);
            onChange?.(newValue);
          }
        };

        return (
          <div
            onClick={(e) => {
              if (stopPropagation) e.stopPropagation();
            }}
          >
            <Checkbox checked={isChecked} onCheckedChange={toggleValue} />
          </div>
        );
      }}
    />
  );
};

export default CustomCheckbox;
