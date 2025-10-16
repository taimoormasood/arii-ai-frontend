import { format, isAfter, startOfDay } from "date-fns";
import { CalendarIcon, CheckCircle2 } from "lucide-react";
import React, { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface CustomDatePickerProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  showTodayButton?: boolean;
  showClearButton?: boolean;
  todayButtonText?: string;
  clearButtonText?: string;
  futureOnly?: boolean;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  name,
  label = "",
  placeholder = "Pick a date",
  required = false,
  disabled = false,
  futureOnly = false,
}) => {
  const { control } = useFormContext();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  const handleTodayClick = (onChange: (date: Date | undefined) => void) => {
    const today = new Date();
    onChange(today);
    setCurrentMonth(today);
  };

  const handleSaveClick = () => {
    setIsPopoverOpen(false);
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const isFutureDate =
          field.value &&
          isAfter(startOfDay(field.value), startOfDay(new Date()));

        return (
          <div className="flex flex-col gap-1">
            {label && (
              <label className="text-gray-700 text-sm font-medium">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  disabled={disabled}
                  className={cn(
                    "w-full bg-gray-50 hover:bg-gray-100 text-left font-normal px-4 py-2 h-10 border rounded-lg text-sm flex items-center justify-between ring-offset-0 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
                    error ? "border-red-500" : "border-gray-300",
                    disabled ? "bg-gray-400 text-gray-600" : "text-gray-800"
                  )}
                >
                  <span>
                    {field?.value && !isNaN(new Date(field.value).getTime())
                      ? format(new Date(field.value), "PPP")
                      : placeholder}
                  </span>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 opacity-50" />
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 border-none shadow-lg !z-[999]"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  month={currentMonth}
                  onMonthChange={setCurrentMonth}
                  disabled={(date) => date < startOfDay(new Date())}
                  initialFocus
                  className="bg-white rounded-t-lg"
                />
                <div className="flex w-full justify-end gap-2 p-2 bg-white rounded-b-lg">
                  <Button
                    type="button"
                    size="sm"
                    className="border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 w-full"
                    onClick={() => handleTodayClick(field.onChange)}
                  >
                    Today
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    className="bg-primary-700 text-white hover:bg-primary-600 w-full"
                    onClick={() => {
                      handleSaveClick();
                    }}
                  >
                    Save
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            {error && (
              <span className="text-red-500 text-xs">{error.message}</span>
            )}
          </div>
        );
      }}
    />
  );
};

export default CustomDatePicker;
