import { Controller, useFormContext } from "react-hook-form";

import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
interface Option {
  label: string;
  value: string;
}
interface CustomRadioGroupProps {
  name: string;
  label: string;
  options: Option[];
  className?: string;
  required?: boolean;
  direction?: "row" | "column"; // Added direction prop to control layout
}
const CustomRadioGroup: React.FC<CustomRadioGroupProps> = ({
  name,
  label,
  options,
  className,
  required = false,
  direction = "row", // Added direction prop with default value
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel className="text-base font-medium text-gray-900">
            {label}
            {required && <span className="text-red-500"> *</span>}
          </FormLabel>
          <FormControl>
            <RadioGroup
              value={field.value}
              onValueChange={field.onChange}
              className="mt-4"
            >
              <div
                className={`flex ${direction === "row" ? "flex-row gap-6" : "flex-col space-y-3"}`}
              >
                {options.map((option) => (
                  <div
                    key={option.value}
                    className="flex items-center space-x-3"
                  >
                    <RadioGroupItem
                      value={option.value}
                      id={option.value}
                      className="hover:cursor-pointer"
                    />
                    <Label htmlFor={option.value} className="text-sm">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </FormControl>
          <FormMessage className="text-red-500 font-normal">
            {errors[name]?.message as string}
          </FormMessage>
        </FormItem>
      )}
    />
  );
};
export default CustomRadioGroup;
