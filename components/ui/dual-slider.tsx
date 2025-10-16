"use client";

import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const dualSliderVariants = cva(
  "relative flex w-full touch-none select-none items-center",
  {
    variants: {
      size: {
        sm: "h-4",
        default: "h-6",
        lg: "h-8",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

const trackVariants = cva("relative w-full grow overflow-hidden rounded-full", {
  variants: {
    size: {
      sm: "h-1",
      default: "h-2",
      lg: "h-3",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

const thumbVariants = cva(
  "absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full border-2 bg-background shadow-lg cursor-pointer transition-all hover:scale-110 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      size: {
        sm: "h-4 w-4 border",
        default: "h-5 w-5 border-2",
        lg: "h-6 w-6 border-2",
      },
      variant: {
        default: "border-primary",
        secondary: "border-secondary",
        destructive: "border-destructive",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  }
);

const rangeVariants = cva("absolute h-full rounded-full", {
  variants: {
    variant: {
      default: "bg-primary",
      secondary: "bg-secondary",
      destructive: "bg-destructive",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface DualSliderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">,
    VariantProps<typeof dualSliderVariants> {
  value?: [number, number];
  onValueChange?: (value: [number, number]) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  variant?: "default" | "secondary" | "destructive";
}

const DualSlider = React.forwardRef<HTMLDivElement, DualSliderProps>(
  (
    {
      className,
      value = [0, 100],
      onValueChange,
      min = 0,
      max = 100,
      step = 1,
      disabled = false,
      size,
      variant,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] =
      React.useState<[number, number]>(value);
    const [isDragging, setIsDragging] = React.useState<"min" | "max" | null>(
      null
    );
    const trackRef = React.useRef<HTMLDivElement>(null);

    // Update internal value when prop changes
    React.useEffect(() => {
      setInternalValue(value);
    }, [value]);

    const getValueFromPosition = React.useCallback(
      (clientX: number): number => {
        if (!trackRef.current) return min;

        const rect = trackRef.current.getBoundingClientRect();
        const percent = Math.max(
          0,
          Math.min(1, (clientX - rect.left) / rect.width)
        );
        const rawValue = min + percent * (max - min);

        return Math.round(rawValue / step) * step;
      },
      [min, max, step]
    );

    const updateValue = React.useCallback(
      (newValue: [number, number]) => {
        // Ensure min <= max
        const clampedValue: [number, number] = [
          Math.max(min, Math.min(newValue[0], newValue[1] - step)),
          Math.min(max, Math.max(newValue[1], newValue[0] + step)),
        ];

        setInternalValue(clampedValue);
        onValueChange?.(clampedValue);
      },
      [min, max, step, onValueChange]
    );

    const handleMouseDown = React.useCallback(
      (type: "min" | "max") => (e: React.MouseEvent) => {
        if (disabled) return;

        e.preventDefault();
        setIsDragging(type);

        const handleMouseMove = (e: MouseEvent) => {
          const newValue = getValueFromPosition(e.clientX);

          if (type === "min") {
            updateValue([newValue, internalValue[1]]);
          } else {
            updateValue([internalValue[0], newValue]);
          }
        };

        const handleMouseUp = () => {
          setIsDragging(null);
          document.removeEventListener("mousemove", handleMouseMove);
          document.removeEventListener("mouseup", handleMouseUp);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
      },
      [disabled, getValueFromPosition, internalValue, updateValue]
    );

    const handleKeyDown = React.useCallback(
      (type: "min" | "max") => (e: React.KeyboardEvent) => {
        if (disabled) return;

        let delta = 0;
        switch (e.key) {
          case "ArrowLeft":
          case "ArrowDown":
            delta = -step;
            break;
          case "ArrowRight":
          case "ArrowUp":
            delta = step;
            break;
          case "Home":
            if (type === "min") {
              updateValue([min, internalValue[1]]);
            } else {
              updateValue([internalValue[0], min]);
            }

            return;
          case "End":
            if (type === "min") {
              updateValue([max, internalValue[1]]);
            } else {
              updateValue([internalValue[0], max]);
            }

            return;
          default:
            return;
        }

        e.preventDefault();
        if (type === "min") {
          updateValue([internalValue[0] + delta, internalValue[1]]);
        } else {
          updateValue([internalValue[0], internalValue[1] + delta]);
        }
      },
      [disabled, step, min, max, internalValue, updateValue]
    );

    const getPercentage = React.useCallback(
      (val: number) => ((val - min) / (max - min)) * 100,
      [min, max]
    );

    return (
      <div
        ref={ref}
        className={cn(dualSliderVariants({ size, className }))}
        {...props}
      >
        {/* Track */}
        <div
          ref={trackRef}
          className={cn(trackVariants({ size }), "bg-secondary")}
        >
          {/* Active range */}
          <div
            className={cn(rangeVariants({ variant }))}
            style={{
              left: `${getPercentage(internalValue[0])}%`,
              width: `${getPercentage(internalValue[1]) - getPercentage(internalValue[0])}%`,
            }}
          />
        </div>

        {/* Min thumb */}
        <div
          className={cn(thumbVariants({ size, variant }))}
          style={{ left: `${getPercentage(internalValue[0])}%` }}
          onMouseDown={handleMouseDown("min")}
          onKeyDown={handleKeyDown("min")}
          role="slider"
          aria-valuemin={min}
          aria-valuemax={internalValue[1]}
          aria-valuenow={internalValue[0]}
          aria-label="Minimum value"
          tabIndex={disabled ? -1 : 0}
        />

        {/* Max thumb */}
        <div
          className={cn(thumbVariants({ size, variant }))}
          style={{ left: `${getPercentage(internalValue[1])}%` }}
          onMouseDown={handleMouseDown("max")}
          onKeyDown={handleKeyDown("max")}
          role="slider"
          aria-valuemin={internalValue[0]}
          aria-valuemax={max}
          aria-valuenow={internalValue[1]}
          aria-label="Maximum value"
          tabIndex={disabled ? -1 : 0}
        />
      </div>
    );
  }
);

DualSlider.displayName = "DualSlider";

export { DualSlider, dualSliderVariants };
