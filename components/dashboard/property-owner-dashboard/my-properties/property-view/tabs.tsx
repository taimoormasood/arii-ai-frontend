// components/Tabs.tsx
"use client";

import { useState } from "react";

const tabs = [
  "Overview",
  "Payments",
  "Maintenance",
  "Team Management",
  "Task Management",
  "Documents",
];

export default function Tabs({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) {
  return (
    <div className="flex flex-wrap sm:flex-nowrap space-x-4  p-2 rounded-lg w-full  mx-auto border border-gray-100 my-6 bg-white">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 w-full hover:cursor-pointer ${
            activeTab === tab
              ? "bg-primary-500 text-white"
              : "text-gray-500 hover:text-black"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
