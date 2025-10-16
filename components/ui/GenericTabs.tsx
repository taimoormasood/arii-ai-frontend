"use client";

import React from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

export interface TabItem {
  label: string;
  value: string;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface GenericTabsProps {
  tabs: TabItem[];
  defaultValue?: string;
  value?: string;
  className?: string;
  onValueChange?: (value: string) => void;
}

const GenericTabs: React.FC<GenericTabsProps> = ({
  tabs,
  defaultValue,
  value,
  className,
  onValueChange,
}) => {
  if (!tabs || tabs.length === 0) return null;

  return (
    <Tabs
      defaultValue={defaultValue || tabs[0].value}
      value={value}
      className={className}
      onValueChange={onValueChange}
    >
      <TabsList>
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            disabled={tab.disabled}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default GenericTabs;
