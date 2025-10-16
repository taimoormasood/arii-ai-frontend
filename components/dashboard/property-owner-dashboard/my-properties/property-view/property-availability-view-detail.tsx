"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";

import { useGetMonthAvailability } from "@/hooks/api/use-properties";
import { usePropertyStore } from "@/lib/stores/use-property-store";

const PropertyAvailabilityViewDetail: React.FC<{ heading?: string }> = ({
  heading = "Property Availability",
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [unavailableDates, setUnavailableDates] = useState(
    new Set(["2025-01-21", "2025-01-22"])
  );
  const [unavailableReasons, setUnavailableReasons] = useState<
    Map<string, string>
  >(new Map());

  const { getStepData } = usePropertyStore();

  const propertyId = getStepData("propertyInfo")?.id;
  const params = useParams();
  const searchParams = useSearchParams();

  const propertyIdForView = useMemo(() => Number(params?.id), [params]);
  const propertyType = useMemo(
    () => searchParams.get("propertyType"),
    [searchParams]
  );

  const unitId = Number(searchParams.get("propertyId"));

  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const year = String(currentDate.getFullYear());

  const { data } = useGetMonthAvailability({
    month,
    year,
    property: unitId ? unitId : propertyIdForView,
  });

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

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const today = new Date();
    const days = [];
    const isViewOnly = !!propertyType;

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

      const isToday =
        day === today.getDate() &&
        currentDate.getMonth() === today.getMonth() &&
        currentDate.getFullYear() === today.getFullYear();

      const isUnavailable = unavailableDates.has(dateStr);
      const reason = unavailableReasons.get(dateStr);

      let cellClasses = `h-24 w-full w-16 flex pl-2 pt-2 items-start justify-start text-sm ${
        isViewOnly ? "cursor-default" : "cursor-default"
      } relative border border-dotted border-gray-200`;
      let numberClasses =
        "w-6 h-6 flex items-center justify-center rounded-full text-black";

      if (isPast && isUnavailable) {
        cellClasses += " bg-red-100";
        numberClasses += " text-red-400 font-medium";
      } else if (isPast) {
        cellClasses += " bg-gray-100";
        numberClasses += " text-gray-300";
      } else if (isUnavailable) {
        cellClasses += " bg-red-100";
        numberClasses += " text-red-600 font-medium";
      } else {
        cellClasses += " bg-secondary-100";
        numberClasses += " font-medium text-black";
      }

      // Add red circle and background for today
      if (isToday) {
        numberClasses += " bg-primary-500 text-white ";
      }

      days.push(
        <div key={day} className={cellClasses}>
          <div className={numberClasses}>{day}</div>
          {isUnavailable && reason && (
            <div className="absolute top-7 left-1 right-1">
              <div className="text-xs text-red-500 font-medium leading-tight">
                {reason}
              </div>
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="w-full mx-auto bg-white rounded-lg shadow-sm border border-gray-200 md:p-6 p-2 mt-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
        <h2 className="text-sm mb-2 sm:text-lg font-semibold text-title-black">
          {heading}
        </h2>
        <div className="flex items-center space-x-2 w-full sm:w-auto justify-center">
          <span className="text-sm sm:text-lg text-gray-900 font-semibold">
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
      <div className="flex justify-center md:space-x-6 space-x-2 mt-6 text-sm">
        <div className="flex items-center space-x-2 bg-gray-100 px-1.5 py-0.5 border rounded-[4px] border-gray-100">
          <span className="text-gray-500 font-normal md:text-sm text-xs">
            Past Dates
          </span>
        </div>
        <div className="flex items-center space-x-2 bg-secondary-50 px-1.5 py-0.5 border rounded-[4px] border-gray-100">
          <span className="text-secondary-500 font-normal md:text-sm text-xs">
            Available Slots
          </span>
        </div>
        <div className="flex items-center space-x-2 bg-red-50 px-1.5 py-0.5 border rounded-[4px] border-red-50">
          <span className="text-red-600 font-normal md:text-sm text-xs">
            Unavailable
          </span>
        </div>
      </div>
    </div>
  );
};

export default PropertyAvailabilityViewDetail;
