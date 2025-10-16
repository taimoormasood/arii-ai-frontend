"use client";

import { X } from "lucide-react";
import type React from "react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface FiltersSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FiltersSidebar({ isOpen, onClose }: FiltersSidebarProps) {
  const [priceRange, setPriceRange] = useState([25]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      {/* Sidebar */}
      <div className="relative text-left w-full max-w-md bg-white h-full overflow-y-auto animate-in slide-in-from-right">
        <div className="flex items-center justify-between px-4 pt-4">
          <h2 className="text-lg text-gray-900 font-bold">Filters</h2>
          <Button
            variant="ghost"
            className="bg-gray-200 rounded-full w-6 h-6"
            size="icon"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        <div className="p-4 space-y-4">
          {/* Price Range */}
          <div className="space-y-1">
            <h3 className="font-medium text-sm text-gray-700">Price Range:</h3>
            <Slider
              defaultValue={[25]}
              max={10000}
              step={1}
              value={priceRange}
              onValueChange={setPriceRange}
              className="py-4"
            />
            <div className="flex justify-between font-medium text-sm text-gray-900">
              <span>0USD</span>
              <span>{priceRange[0]}USD</span>
            </div>
          </div>

          {/* Essentials */}
          <div className="space-y-3">
            <h3 className="font-medium text-sm text-gray-700">Essentials:</h3>
            <div className="flex flex-wrap gap-3">
              <FilterOption icon={<WifiIcon />} label="Wi-Fi" />
              <FilterOption icon={<KitchenIcon />} label="Kitchen" />
              <FilterOption icon={<WasherIcon />} label="Washer" />
              <FilterOption icon={<DryerIcon />} label="Dryer" />
              <FilterOption icon={<AcIcon />} label="Air Conditioning" />
              <FilterOption icon={<TvIcon />} label="TV" />
              <FilterOption icon={<HairDryerIcon />} label="Hair Dryer" />
              <FilterOption icon={<IronIcon />} label="Iron" />
            </div>
          </div>

          {/* Features */}
          <div className="space-y-3">
            <h3 className="font-medium text-sm text-gray-700">Features:</h3>
            <div className="flex flex-wrap gap-3">
              <FilterOption icon={<PoolIcon />} label="Pool" />
              <FilterOption icon={<HotTubIcon />} label="Hot Tub" />
              <FilterOption icon={<ParkingIcon />} label="Free Parking" />
              <FilterOption icon={<EvChargerIcon />} label="EV Charger" />
              <FilterOption icon={<GymIcon />} label="Gym" />
              <FilterOption icon={<BalconyIcon />} label="Balcony" />
              <FilterOption icon={<PatioIcon />} label="Patio" />
              <FilterOption icon={<SmokingIcon />} label="Smoking Allowed" />
              <FilterOption
                icon={<BathroomIcon />}
                label="Private Attached Bathroom"
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-3">
            <h3 className="font-medium text-sm text-gray-700">Location:</h3>
            <div className="flex flex-wrap gap-3">
              <FilterOption icon={<BeachfrontIcon />} label="Beachfront" />
              <FilterOption icon={<WaterfrontIcon />} label="Waterfront" />
            </div>
          </div>

          {/* Safety */}
          <div className="space-y-3">
            <h3 className="font-medium text-sm text-gray-700font-medium text-gray-700">
              Safety:
            </h3>
            <div className="flex flex-wrap gap-3">
              <FilterOption icon={<SmokeAlarmIcon />} label="Smoke Alarm" />
              <FilterOption
                icon={<CarbonMonoxideIcon />}
                label="Carbon Monoxide Alarm"
              />
            </div>
          </div>

          {/* Booking Options */}
          <div className="space-y-3">
            <h3 className="font-medium text-sm text-gray-700">
              Booking Options:
            </h3>
            <div className="flex flex-wrap gap-3">
              <FilterOption icon={<InstantBookIcon />} label="Instant Book" />
              <FilterOption icon={<SelfCheckInIcon />} label="Self Check-in" />
              <FilterOption icon={<PetsIcon />} label="Allow Pets" />
            </div>
          </div>

          {/* Property Type */}
          <div className="space-y-3">
            <h3 className="font-medium text-sm text-gray-700">
              Property Type:
            </h3>
            <div className="flex flex-wrap gap-3">
              <FilterOption icon={<HouseIcon />} label="House" />
              <FilterOption icon={<ApartmentIcon />} label="Apartment" />
              <FilterOption icon={<SmartHouseIcon />} label="Smart House" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 p-4 bg-white flex gap-3">
          <Button
            variant="outline"
            className="flex-1 font-semibold border-primary-500 shadow text-primary-500 hover:bg-primary-500 hover:text-white"
          >
            Clear All
          </Button>
          <Button className="flex-1 bg-primary-500 hover:bg-primary-700 text-white">
            Apply Filter
          </Button>
        </div>
      </div>
    </div>
  );
}

interface FilterOptionProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

function FilterOption({ icon, label, active = false }: FilterOptionProps) {
  const [isSelected, setIsSelected] = useState(active);

  return (
    <button
      className={cn(
        "flex flex-col items-center justify-center cursor-pointer py-1.5 px-3 rounded-lg border text-center gap-1 font-medium text-xs",
        isSelected
          ? "border-primary-500 text-primary-500"
          : "border-gray-200 hover:border-gray-300 text-gray-700"
      )}
      onClick={() => setIsSelected(!isSelected)}
    >
      <div className="w-5 h-5 flex items-center justify-center">{icon}</div>
      <span className="text-[10px] line-clamp-2">{label}</span>
    </button>
  );
}

// Filter Icons
function WifiIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 8C15.3137 8 18 10.6863 18 14M12 8C8.68629 8 6 10.6863 6 14M12 8V14M12 8C7.58172 8 4 11.5817 4 16M12 8C16.4183 8 20 11.5817 20 16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function KitchenIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 4H20V8C20 8 17 10 12 10C7 10 4 8 4 8V4ZM4 8V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WasherIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="7" cy="7" r="1" fill="currentColor" />
    </svg>
  );
}

function DryerIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="7" cy="7" r="1" fill="currentColor" />
      <circle cx="10" cy="7" r="1" fill="currentColor" />
    </svg>
  );
}

function AcIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="2"
        y="5"
        width="20"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M2 10H22" stroke="currentColor" strokeWidth="2" />
      <path
        d="M7 15H17"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TvIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="2"
        y="5"
        width="20"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M8 2L12 5L16 2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HairDryerIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 8C13.3137 8 16 10.6863 16 14C16 17.3137 13.3137 20 10 20C6.68629 20 4 17.3137 4 14C4 10.6863 6.68629 8 10 8Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M16 9L20 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M16 14L21 14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M16 19L20 23"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IronIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 10C4 8.89543 4.89543 8 6 8H18C19.1046 8 20 8.89543 20 10V14C20 15.1046 19.1046 16 18 16H6C4.89543 16 4 15.1046 4 14V10Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M8 8V6C8 5.44772 8.44772 5 9 5H15C15.5523 5 16 5.44772 16 6V8"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

function PoolIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 15C4 15 5 14 8 14C11 14 13 16 16 16C19 16 20 15 20 15V5C20 5 19 6 16 6C13 6 11 4 8 4C5 4 4 5 4 5V15Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 19C4 19 5 18 8 18C11 18 13 20 16 20C19 20 20 19 20 19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HotTubIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7 12C9.20914 12 11 10.2091 11 8C11 5.79086 9.20914 4 7 4C4.79086 4 3 5.79086 3 8C3 10.2091 4.79086 12 7 12Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M17 8C18.1046 8 19 7.10457 19 6C19 4.89543 18.1046 4 17 4C15.8954 4 15 4.89543 15 6C15 7.10457 15.8954 8 17 8Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M3 21V17C3 15.8954 3.89543 15 5 15H19C20.1046 15 21 15.8954 21 17V21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 15V12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 15V8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ParkingIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M9 17V7H13C14.6569 7 16 8.34315 16 10C16 11.6569 14.6569 13 13 13H9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EvChargerIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 7H18M8 7V5C8 4.44772 8.44772 4 9 4H15C15.5523 4 16 4.44772 16 5V7M6 7V19C6 19.5523 6.44772 20 7 20H17C17.5523 20 18 19.5523 18 19V7M11 11V17M14 14L8 14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GymIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.5 6.5L17.5 17.5M6.5 17.5L17.5 6.5M4 8V16M8 4H16M20 8V16M8 20H16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BalconyIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 12H20M4 12V20H20V12M4 12V4H20V12M8 12V16M12 12V16M16 12V16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PatioIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 12H20M4 12V20H20V12M4 12V4H20V12M8 16H16M8 8H16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SmokingIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18 14H16M18 18H16M22 14H20M22 18H20M14 12V8C14 6.89543 13.1046 6 12 6H8C6.89543 6 6 6.89543 6 8V12M14 12H6M14 12V18H6V12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BathroomIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 12H20M4 12V20H20V12M4 12V4H20V12M8 16H16M12 4V8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BeachfrontIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 19H20M4 19C4 19 8 15 12 15C16 15 20 19 20 19M4 19L2 15M20 19L22 15M12 15V5L18 9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WaterfrontIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 15C5 13 7.5 12 12 12C16.5 12 19 13 21 15M3 15L2 16.5M3 15L4 16.5M21 15L20 16.5M21 15L22 16.5M12 12V4L8 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 19C7 19 8.5 17 12 17C15.5 17 17 19 17 19M7 19L6 20M7 19L8 20M17 19L16 20M17 19L18 20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SmokeAlarmIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 8V12L14 14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 3L2 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 3L22 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 19L6 22"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21 19L18 22"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CarbonMonoxideIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path
        d="M7.5 12C7.5 10.067 8.567 9 10.5 9C12.433 9 13.5 10.067 13.5 12C13.5 13.933 12.433 15 10.5 15C8.567 15 7.5 13.933 7.5 12Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M16.5 9V15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InstantBookIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 19.5V4.5C4 3.39543 4.89543 2.5 6 2.5H18C19.1046 2.5 20 3.39543 20 4.5V19.5C20 20.6046 19.1046 21.5 18 21.5H6C4.89543 21.5 4 20.6046 4 19.5Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M8 7.5H16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 12H16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 16.5H12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SelfCheckInIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15 8H15.01M9 16V14C9 12.3431 10.3431 11 12 11H16C17.6569 11 19 12.3431 19 14V16M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PetsIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 5.172C10 4.062 8.88 3.39 7.929 3.929L3.929 6.172C3.354 6.534 3 7.172 3 7.879V16.12C3 16.827 3.354 17.466 3.929 17.828L7.929 20.07C8.88 20.609 10 19.937 10 18.828V5.172Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M14 5.172C14 4.062 15.12 3.39 16.071 3.929L20.071 6.172C20.646 6.534 21 7.172 21 7.879V16.12C21 16.827 20.646 17.466 20.071 17.828L16.071 20.07C15.12 20.609 14 19.937 14 18.828V5.172Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M3 8L10 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 16L10 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21 8L14 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21 16L14 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HouseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 10.25V20C3 20.5523 3.44772 21 4 21H20C20.5523 21 21 20.5523 21 20V10.25"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 3L2 12H22L12 3Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ApartmentIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="4"
        y="2"
        width="16"
        height="20"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M9 6H15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 10H15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 14H15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 18H15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SmartHouseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 10.25V20C3 20.5523 3.44772 21 4 21H20C20.5523 21 21 20.5523 21 20V10.25"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 3L2 12H22L12 3Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="16" r="2" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 14V10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
