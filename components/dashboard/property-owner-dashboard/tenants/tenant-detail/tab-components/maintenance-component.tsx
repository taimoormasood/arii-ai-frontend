import React from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import CustomSelect from "@/components/ui/custom-select";
import CustomTable, { Column } from "@/components/ui/custom-table";

const MaintenanceComponent = () => {
  const columns: Column<any>[] = [
    {
      id: "task_name",
      label: "TASK NAME",
      render: (val) => <span>{val}</span>,
    },
    {
      id: "property_name",
      label: "PROPERTY NAME",
      render: (_, row) => (
        <span className="cursor-pointer text-[#0089D4] hover:underline">
          {row.property_name || "N/A"}
        </span>
      ),
    },
    {
      id: "due_date",
      label: "DUE DATE",
      render: (val) => <span>{val}</span>,
    },
    {
      id: "status",
      label: "STATUS",
      render: (val) => (
        <span
          className={`px-2 py-1 rounded text-xs ${
            val === "Accepted"
              ? "bg-primary-200 text-primary-800"
              : val === "Pending"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-gray-100 text-gray-800"
          }`}
        >
          {val}
        </span>
      ),
    },
    {
      id: "actions",
      label: "ACTION",
      render: (_, row) => {
        const maintenanceActions = [
          {
            label: "Reject",
            action: () => {},
            className: "text-base text-black",
          },
          {
            label: "Accept",
            action: () => {},
            className: "text-base text-primary-600",
          },
        ];

        return (
          <div className="flex gap-2 justify-end">
            {maintenanceActions.map((item) => (
              <button
                key={item.label}
                onClick={item.action}
                className={`text-xs cursor-pointer rounded hover:underline ${item.className}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        );
      },
      className: "text-right",
    },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between w-full">
        <div>
          <h2 className="text-lg font-semibold">Maintenance Request</h2>
          <p className="text-sm text-gray-600">
            Manage and assign maintenance requests here.
          </p>
        </div>
        <CustomSelect
          onValueChange={(value) => {}}
          placeholder="Filter"
          options={[
            { label: "All", value: "all" },
            { label: "Pending", value: "pending" },
            { label: "Accepted", value: "accepted" },
          ]}
        />
      </CardHeader>
      <CardContent>
        <CustomTable
          columns={columns}
          data={tenants}
          module="tenants-management"
        />
      </CardContent>
    </Card>
  );
};

export default MaintenanceComponent;

const tenants = [
  {
    id: 1,
    task_name: "Fix Leaking Faucet",
    property_name: "Sunset Apartments Unit 3A",
    due_date: "2024-01-15",
    status: "Pending",
  },
  {
    id: 2,
    task_name: "Repair Air Conditioning",
    property_name: "Downtown Condo 205",
    due_date: "2024-01-18",
    status: "Accepted",
  },
  {
    id: 3,
    task_name: "Replace Broken Window",
    property_name: "Garden View Townhouse",
    due_date: "2024-01-20",
    status: "Rejected",
  },
  {
    id: 4,
    task_name: "Unclog Kitchen Drain",
    property_name: "Metro Plaza Unit 12B",
    due_date: "2024-01-22",
    status: "Pending",
  },
  {
    id: 5,
    task_name: "Paint Living Room",
    property_name: "Riverside Apartment 4C",
    due_date: "2024-01-25",
    status: "Accepted",
  },
];
