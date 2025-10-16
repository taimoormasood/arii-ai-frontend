import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const generateTimeOptions = (
  use12HourFormat: boolean,
  period?: "AM" | "PM"
) => {
  const times = [];
  if (use12HourFormat) {
    // 12-hour format (AM/PM)
    for (let h = 0; h < 24; h++) {
      const currentPeriod = h < 12 ? "AM" : "PM";

      // Skip if period is specified and doesn't match
      if (period && period !== currentPeriod) continue;

      for (const m of [0, 15, 30, 45]) {
        const hour12 = h % 12 === 0 ? 12 : h % 12;
        const hourStr = String(hour12).padStart(2, "0");
        const minute = String(m).padStart(2, "0");
        times.push(`${hourStr}:${minute} ${currentPeriod}`);
      }
    }
  } else {
    // 24-hour format
    const startHour = period === "AM" ? 0 : period === "PM" ? 12 : 0;
    const endHour = period === "AM" ? 12 : period === "PM" ? 24 : 24;

    for (let h = startHour; h < endHour; h++) {
      for (const m of [0, 15, 30, 45]) {
        const hour = String(h).padStart(2, "0");
        const minute = String(m).padStart(2, "0");
        times.push(`${hour}:${minute}`);
      }
    }
  }

  return times;
};
const TimeDropdown = ({
  value,
  onChange,
  className = "",
  placeholder = "Select time",
  use12HourFormat = false,
  period,
}: {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  use12HourFormat?: boolean;
  period?: "AM" | "PM";
}) => {
  const timeOptions = generateTimeOptions(use12HourFormat, period);

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        className={cn(
          "h-10 w-32 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-800 shadow-none focus:outline-none focus:ring-0 focus-visible:ring-0 focus:ring-offset-0 ring-0 focus-visible:outline-none",
          className
        )}
      >
        <SelectValue placeholder={placeholder || "Select"} />
      </SelectTrigger>
      <SelectContent
        className="bg-white border-none top-0 px-0"
        onPointerDownOutside={() => document.body.click()}
      >
        {timeOptions.map((time) => (
          <SelectItem key={time} value={time}>
            {time}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default TimeDropdown;
