"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { FC, useState } from "react";

import { ArrowPointerIcon } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import CustomSearchField from "@/components/ui/custom-searchfield";
import CustomTable, { Column } from "@/components/ui/custom-table";

import ApplicationDetail from "./application-detail";

interface Application {
  id: string;
  application_date: string;
  status:
    | "Submitted"
    | "Approved"
    | "Payment Pending"
    | "Lease Active"
    | "Rejected";
  property_name?: string;
  unit_number?: string;
  action?: string;
}

const MyApplications: FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get modal state from search params
  const action = searchParams.get("action");
  const applicationId = searchParams.get("applicationId");
  const isDetailModalOpen = action === "view-details" && !!applicationId;

  // Function to open detail modal via search params
  const openDetailModal = (appId: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("action", "view-details");
    params.set("applicationId", appId);
    router.push(`?${params.toString()}`);
  };

  // Function to close detail modal via search params
  const closeDetailModal = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("action");
    params.delete("applicationId");
    router.push(`?${params.toString()}`);
  };

  // Dummy data based on the image
  const applications: Application[] = [
    {
      id: "ID-589965",
      application_date: "2025-05-05",
      status: "Submitted",
      property_name: "Sunset Villa",
      unit_number: "A101",
    },
    {
      id: "ID-659751",
      application_date: "2025-05-03",
      status: "Approved",
      property_name: "Ocean View Apartments",
      unit_number: "B205",
    },
    {
      id: "ID-158864",
      application_date: "2025-05-03",
      status: "Payment Pending",
      property_name: "Downtown Lofts",
      unit_number: "C304",
    },
    {
      id: "ID-659752",
      application_date: "2025-05-01",
      status: "Lease Active",
      property_name: "Garden Heights",
      unit_number: "D102",
    },
    {
      id: "ID-657941",
      application_date: "2025-05-01",
      status: "Payment Pending",
      property_name: "City Center Plaza",
      unit_number: "E501",
    },
    {
      id: "ID-659914",
      application_date: "2025-05-06",
      status: "Rejected",
      property_name: "Riverside Commons",
      unit_number: "F303",
    },
    {
      id: "ID-265894",
      application_date: "2025-05-04",
      status: "Approved",
      property_name: "Mountain View Estates",
      unit_number: "G201",
    },
    {
      id: "ID-548612",
      application_date: "2025-05-06",
      status: "Payment Pending",
      property_name: "Harbor Point",
      unit_number: "H402",
    },
    {
      id: "ID-584553",
      application_date: "2025-05-02",
      status: "Lease Active",
      property_name: "Parkside Manor",
      unit_number: "I105",
    },
    {
      id: "ID-687466",
      application_date: "2025-05-01",
      status: "Approved",
      property_name: "Lakefront Towers",
      unit_number: "J601",
    },
  ];

  // Filter applications based on search query
  const filteredApplications = applications.filter(
    (app) =>
      app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.property_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchFilter = (query: string) => {
    setSearchQuery(query);
  };

  const getStatusBadge = (status: Application["status"]) => {
    const statusConfig = {
      Submitted: { bg: "bg-blue-100", text: "text-blue-800" },
      Approved: { bg: "bg-primary-200", text: "text-primary-800" },
      "Payment Pending": { bg: "bg-yellow-100", text: "text-yellow-800" },
      "Lease Active": { bg: "bg-emerald-100", text: "text-emerald-800" },
      Rejected: { bg: "bg-red-100", text: "text-red-800" },
    };

    const config = statusConfig[status];

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      >
        {status}
      </span>
    );
  };

  const getActionButton = (application: Application) => {
    const actionConfig = {
      Submitted: { text: "View Details", variant: "link" as const },
      Approved: { text: "Review Lease Agreement", variant: "link" as const },
      "Payment Pending": { text: "Make Payment", variant: "link" as const },
      "Lease Active": { text: "View Property", variant: "link" as const },
      Rejected: { text: "Contact Property Manager", variant: "link" as const },
    };

    const config = actionConfig[application.status];

    return (
      <Button
        variant={config.variant}
        className="text-primary-600 hover:text-primary-700 p-0 h-fit"
        onClick={() => {
          if (application.status === "Submitted") {
            openDetailModal(application.id);
          } else {
            // Handle other actions based on status
          }
        }}
      >
        {config.text}
      </Button>
    );
  };

  const columns: Column<Application>[] = [
    {
      id: "id",
      label: "APPLICATION ID",
      render: (_, row) => (
        <span className="text-blue-500 font-medium">{row.id}</span>
      ),
    },
    {
      id: "application_date",
      label: "APPLICATION DATE",
      render: (val) => <span>{val}</span>,
    },
    {
      id: "status",
      label: "STATUS",
      render: (_, row) => getStatusBadge(row.status),
    },
    {
      id: "action",
      label: "ACTION",
      render: (_, row) => (
        <div className="flex justify-end">{getActionButton(row)}</div>
      ),
      className: "text-right",
    },
  ];

  return (
    <React.Fragment>
      {/* Header */}
      <div className="flex justify-between flex-wrap gap-2">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Applications
          </h1>
          <p className="text-gray-600">
            Track the status of your rental applications and take required
            actions
          </p>
        </div>

        <Button
          className="bg-primary-600 hover:bg-primary-700 text-white"
          onClick={() => router.push("/browse-listing")}
        >
          Browse Properties <ArrowPointerIcon fill="#fff" />
        </Button>
      </div>

      {/* <div className="flex justify-between flex-wrap items-center mt-6">
        Search
        <div className="flex lg:flex-nowrap flex-wrap items-center gap-2">
          <CustomSearchField
            placeholder="Search by application ID, property, or status"
            onChange={handleSearchFilter}
          />
        </div>

        Browse Properties Button
        <Button
          className="bg-primary-600 hover:bg-primary-700 text-white"
          onClick={() => router.push("/browse-listing")}
        >
          Browse Properties <ArrowPointerIcon fill="#fff" />
        </Button>
      </div> */}

      {/* Table */}
      <div className="mt-4">
        {filteredApplications && filteredApplications.length > 0 ? (
          <CustomTable
            columns={columns}
            data={filteredApplications}
            module="my-applications"
          />
        ) : (
          <div className="text-center py-8 text-gray-500">
            {searchQuery
              ? "No applications found matching your search."
              : "No applications found."}
          </div>
        )}
      </div>

      {/* Application Detail Modal */}
      {isDetailModalOpen && (
        <ApplicationDetail
          open={isDetailModalOpen}
          onOpenChange={(open) => {
            if (!open) {
              closeDetailModal();
            }
          }}
          applicationId={applicationId || undefined}
        />
      )}
    </React.Fragment>
  );
};

export default MyApplications;
