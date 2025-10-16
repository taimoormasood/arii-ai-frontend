"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type TabItem = {
  label: string;
  value: string;
  content: React.ReactNode | (() => React.ReactNode);
  className?: string;
};

interface TabsSectionProps {
  tabs: TabItem[];
  defaultValue: string;
}

export default function TabsSection({
  tabs = [],
  defaultValue = "",
}: TabsSectionProps) {
  return (
    <Tabs defaultValue={defaultValue} className="w-full">
      <TabsList
        className={`flex flex-wrap sm:flex-nowrap space-x-4  p-2 rounded-lg w-full  mx-auto border border-gray-100 my-6 bg-white`}
      >
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className={`px-4 py-2 text-sm border-none font-medium rounded-lg transition-all duration-200 w-full hover:cursor-pointer
              data-[state=active]:!bg-primary-600 data-[state=active]:!text-white
              data-[state=inactive]:!text-gray-500 hover:data-[state=inactive]:!text-black
              ${tab.className || ""}`}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value} className="mt-6">
          {typeof tab.content === "function" ? tab.content() : tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
