import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useEffect, useState } from "react";

import TrashIcon from "@/assets/icons/trash-icon";
import {
  useDeleteAvailabilitySlots,
  useGetMonthAvailability,
} from "@/hooks/api/use-properties";
import { usePropertyStore } from "@/lib/stores/use-property-store";

import { AvailabilityDialog } from "./availability-dialog";

const AvailabilityCalendar: React.FC = () => {
  const [dialogDate, setDialogDate] = useState<string | null>(null);
  const [dialogReason, setDialogReason] = useState<string>("");
  const [reasonModal, setReasonModal] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [unavailableDates, setUnavailableDates] = useState(
    new Set(["2025-01-21", "2025-01-22"])
  );
  const [selectedDate, setSelectedDate] = useState("2025-01-10");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const [unavailableReasons, setUnavailableReasons] = useState<
    Map<string, string>
  >(new Map());

  const { getStepData, getUnitStepData } = usePropertyStore();

  const propertyId = getStepData("propertyInfo")?.id;
  const unitId = getUnitStepData("unitInfo")?.id;

  // const unitId = useMemo(() => Number(params?.id), [params]);

  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const year = String(currentDate.getFullYear());

  const { data, refetch } = useGetMonthAvailability({
    month,
    year,
    property: propertyId!,
    unitId: unitId,
  });

  const { mutate: deleteMutate, isPending: isDeletePending } =
    useDeleteAvailabilitySlots();

  useEffect(() => {
    if (data?.data?.length) {
      const unavailable = new Set<string>();
      const reasonsMap = new Map<string, string>();

      data.data.forEach((entry: any) => {
        if (entry.status !== "available") {
          unavailable?.add(entry.date);
          if (entry.reason) reasonsMap.set(entry.date, entry.reason);
        }
      });

      setUnavailableDates(unavailable);
      setUnavailableReasons(reasonsMap);
    }
  }, [data]);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const daysOfWeek = ["M", "T", "W", "T", "F", "S", "S"];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    return firstDay === 0 ? 6 : firstDay - 1;
  };

  const formatDate = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  };

  const isPastDate = (year: number, month: number, day: number) => {
    const today = new Date();
    const dateToCheck = new Date(year, month, day);
    today.setHours(0, 0, 0, 0);
    dateToCheck.setHours(0, 0, 0, 0);

    return dateToCheck < today;
  };

  const navigateMonth = (direction: number) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);

      return newDate;
    });
  };

  const handleDelete = async (dateStr: string, id: number) => {
    if (isDeletePending) return;

    try {
      setIsDeleting(dateStr);

      deleteMutate(id, {
        onSuccess: () => {
          setUnavailableDates((prev) => {
            const newSet = new Set(prev);
            newSet.delete(dateStr);

            return newSet;
          });

          setUnavailableReasons((prev) => {
            const newMap = new Map(prev);
            newMap.delete(dateStr);

            return newMap;
          });

          refetch();
        },

        onSettled: () => {
          setIsDeleting(null);
        },
      });
    } catch (error) {
      setIsDeleting(null);
    }
  };

  // Handle date selection with single and double click functionality
  const handleDateClick = (day: number) => {
    const dateStr = formatDate(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );

    // Don't allow interaction with past dates
    if (isPastDate(currentDate.getFullYear(), currentDate.getMonth(), day)) {
      return;
    }

    // Set the date for dialog
    setDialogDate(dateStr);
    setSelectedDate(dateStr);

    // If the date is already unavailable, get the existing reason
    if (unavailableDates.has(dateStr)) {
      const existingReason = unavailableReasons.get(dateStr) || "";
      setDialogReason(existingReason);
    } else {
      setDialogReason("");
    }

    setReasonModal(true);
  };

  const handleDialogSave = (date: string, reason: string) => {
    setUnavailableDates((prev) => new Set([...prev, date]));
    setUnavailableReasons((prev) => new Map(prev.set(date, reason)));
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    const today = new Date();

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className="h-24 bg-gray-50 border border-dot border-gray-200"
        ></div>
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = formatDate(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );
      const isPast = isPastDate(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );
      const isUnavailable = unavailableDates.has(dateStr);
      const reason = unavailableReasons.get(dateStr);
      const isSelected = selectedDate === dateStr;
      const isDeletingThis = isDeleting === dateStr;
      // Dynamic check for today
      const isToday =
        day === today.getDate() &&
        currentDate.getMonth() === today.getMonth() &&
        currentDate.getFullYear() === today.getFullYear();

      let cellClasses = `h-24 w-full w-16 flex pl-2 items-start justify-start text-sm ${isPast ? "cursor-not-allowed" : "cursor-pointer"} relative border border-dotted border-gray-200`;
      let numberClasses =
        "w-6  h-6  flex items-center justify-center rounded-full text-black";

      if (isPast && isUnavailable) {
        cellClasses += " bg-red-100";
        numberClasses += " text-red-400 font-medium";
      } else if (isPast) {
        cellClasses += " bg-gray-100 cursor-not-allowed";
        numberClasses += " text-gray-300";
      } else if (isUnavailable) {
        cellClasses += isDeletingThis ? " bg-red-50 opacity-50" : " bg-red-100";
        numberClasses += " text-red-600 font-medium";
      } else {
        cellClasses += " hover:bg-secondary-200 bg-secondary-100";
        numberClasses += "font-medium text-black";
      }

      // Add red circle and background for today
      if (isToday) {
        numberClasses += " bg-primary-500 text-white ";
      }

      days.push(
        <div
          key={day}
          className={cellClasses}
          onClick={() => {
            if (!isPast && !isDeletingThis) handleDateClick(day);
          }}
        >
          <div className="w-full flex justify-between items-center ">
            <div className={numberClasses}>{day}</div>
            <div className="mt-1"></div>
            {isUnavailable && reason && (
              <button
                className={`text-red-500 hover:text-red-700 pr-2 pt-2 transition-colors ${
                  isDeletingThis
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:cursor-pointer"
                }`}
                disabled={isDeletingThis || isDeletePending}
                onClick={(e) => {
                  e.stopPropagation();
                  if (isDeletingThis || isDeletePending) return;

                  const entry = data?.data?.find(
                    (item: any) => item.date === dateStr
                  );
                  if (entry?.id) {
                    handleDelete(dateStr, entry.id);
                  }
                }}
                title={
                  isDeletingThis ? "Deleting..." : "Delete availability slot"
                }
              >
                {isDeletingThis ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                ) : (
                  <TrashIcon />
                )}
              </button>
            )}
          </div>

          {isUnavailable && reason && (
            <div className="absolute top-7 left-1 right-1">
              <div
                className={`text-xs text-red-500 font-medium text-center leading-tight ${
                  isDeletingThis ? "opacity-50" : ""
                }`}
              >
                {reason}
              </div>
            </div>
          )}

          {/* Loading overlay for deleting state */}
          {isDeletingThis && (
            <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">
              <div className="text-xs text-gray-500">Deleting...</div>
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="w-full mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <AvailabilityDialog
        open={reasonModal}
        onClose={() => setReasonModal(false)}
        date={dialogDate!}
        reason={dialogReason}
        onSave={handleDialogSave}
      />
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
        <h2 className="text-sm mb-2 sm:text-lg font-semibold text-title-black">
          Select an available date to set it as unavailable.
        </h2>
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-sm sm:text-lg text-gray-900">
            {monthNames[currentDate.getMonth()]}, {currentDate.getFullYear()}
          </span>
          <div className="space-x-2">
            <button
              onClick={(e) => {
                navigateMonth(-1);
                e.preventDefault();
              }}
              className="p-1 hover:bg-gray-100 rounded border border-gray-300"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={(e) => {
                navigateMonth(1);
                e.preventDefault();
              }}
              className="p-1 hover:bg-gray-100 rounded border border-gray-300"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-0">
        {/* Days of week header */}
        {daysOfWeek.map((day, index) => (
          <div
            key={index}
            className="h-10 flex items-center justify-center text-sm font-medium text-gray-500"
          >
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {renderCalendarDays()}
      </div>

      {/* Legend */}
      <div className="flex justify-center space-x-6 mt-6 text-sm">
        <div className="flex items-center space-x-2 bg-gray-100 px-1.5 py-0.5 border rounded-[4px] border-gray-100">
          <span className="text-gray-500 font-normal">Past Dates</span>
        </div>
        <div className="flex items-center space-x-2 bg-secondary-50 px-1.5 py-0.5 border rounded-[4px] border-gray-100">
          <span className="text-secondary-500 font-normal">
            Available Slots
          </span>
        </div>
        <div className="flex items-center space-x-2 bg-red-50 px-1.5 py-0.5 border rounded-[4px] border-red-50">
          <span className="text-red-600 font-normal">Unavailable</span>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityCalendar;
