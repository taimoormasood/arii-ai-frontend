"use client";

import { MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { FC, useState } from "react";

import { InviteIcon } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import CustomSearchField from "@/components/ui/custom-searchfield";
import CustomTable, { Column } from "@/components/ui/custom-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuDefaultTrigger,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import GenericTabs from "@/components/ui/GenericTabs";

import { ConfirmationModal } from "./confirmation-modal";
import InvitationModal from "./invitation-modal";
import RenewLeaseModal from "./renew-lease-modal";
import useTenantManagement from "./use-tenant-management";

const TenantManagementComponent: FC = () => {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isRenewLeaseModalOpen, setIsRenewLeaseModalOpen] = useState(false);
  const [isEndLeaseModalOpen, setIsEndLeaseModalOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<any>(null);

  const router = useRouter();

  const {
    handleSearchFilter,
    selectedTab,
    handleTabChange,
    tenants,
    isPending,
    error,
    handleResendInvitation,
    searchFieldRef,
    isResending,
    resendingInvitationId,
    handleLeaseUpdateStatus,
    isUpdatingLease,
  } = useTenantManagement();

  // Columns for joined tab
  const joinedColumns: Column<any>[] = [
    {
      id: "first_name",
      label: "TENANT NAME",
      render: (_, row) => <span>{`${row.first_name} ${row.last_name}`}</span>,
    },
    {
      id: "assignment_name",
      label: "PROPERTY",
      render: (_, row) => (
        <span
          className="cursor-pointer text-[#0089D4] hover:underline"
          onClick={() =>
            router.push(`/my-properties/property-detail/${row.assignment_id}`)
          }
        >
          {row.assignment_name || "N/A"}
        </span>
      ),
    },
    {
      id: "maintenance_request",
      label: "MAINTENANCE REQUESTS",
      render: (_, row) => <span>{row.maintenance_request || 0}</span>,
    },
    {
      id: "email",
      label: "EMAIL",
      render: (val) => <span>{val}</span>,
    },
    {
      id: "actions",
      label: "ACTION",
      render: (_, row) => {
        const joinedActions = [
          {
            label: "View Details",
            action: () => router.push(`/tenants/tenant-detail/${row.id}`),
          },
          {
            label: row.lease_ended ? "Renew Lease" : "End Lease",
            action: () => {
              if (row.lease_ended) {
                setSelectedTenant(row);
                setIsRenewLeaseModalOpen(true);
              } else {
                setSelectedTenant(row);
                setIsEndLeaseModalOpen(true);
              }
            },
          },
        ];

        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <DropdownMenuDefaultTrigger aria-label="Open actions menu">
                  <MoreVertical size={18} className="text-gray-500" />
                </DropdownMenuDefaultTrigger>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 bg-white border-none"
              >
                {joinedActions.map((item) => (
                  <DropdownMenuItem key={item.label} onClick={item.action}>
                    {item.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
      className: "text-right",
    },
  ];

  // Columns for invited tab
  const invitedColumns: Column<any>[] = [
    {
      id: "first_name",
      label: "TENANT NAME",
      render: (_, row) => <span>{`${row.first_name} ${row.last_name}`}</span>,
    },
    {
      id: "tenant_type",
      label: "TENANT TYPE",
      render: (_, row) => <span>{row.tenant_type || "Standard"}</span>,
    },
    {
      id: "email",
      label: "EMAIL",
      render: (val) => <span>{val}</span>,
    },
    {
      id: "actions",
      label: "ACTION",
      render: (_, row) => {
        const isCurrentlyResending = resendingInvitationId === row.id;

        return (
          <div className="flex justify-end">
            <Button
              variant="link"
              disabled={isCurrentlyResending}
              className="text-primary-600 hover:text-primary-700 p-0 h-fit"
              onClick={() => handleResendInvitation(row.id)}
            >
              {isCurrentlyResending ? "Resending..." : "Resend Invitation"}
            </Button>
          </div>
        );
      },
      className: "text-right",
    },
  ];

  const columns = selectedTab === "invited" ? invitedColumns : joinedColumns;

  return (
    <React.Fragment>
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Tenant Management
        </h1>
        <p className="text-gray-600">
          Simplify tenant onboarding, invitations, and profile management.
        </p>
      </div>

      <div className="flex justify-between flex-wrap">
        {/* tabs */}
        <div className="mt-6">
          <GenericTabs
            tabs={tabItems}
            defaultValue={selectedTab}
            value={selectedTab}
            onValueChange={handleTabChange}
            className="w-full"
          />
        </div>
        {/* actions */}
        <div className="flex lg:flex-nowrap flex-wrap items-center gap-2 mt-4">
          <CustomSearchField
            ref={searchFieldRef}
            placeholder="Search by tenant name, role, or email"
            onChange={handleSearchFilter}
          />

          <Button
            className="bg-primary-600 hover:bg-primary-700 text-white !cursor-pointer"
            onClick={() => setIsInviteModalOpen(true)}
          >
            <InviteIcon className="mr-1" /> Invite
          </Button>
        </div>
      </div>
      {/* table */}
      <div className="mt-4">
        {isPending ? (
          <div className="text-center py-8">Loading tenants...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            Error loading tenants data.
          </div>
        ) : tenants && tenants.length > 0 ? (
          <CustomTable
            columns={columns}
            data={tenants}
            module="tenants-management"
          />
        ) : (
          <div className="text-center py-8 text-gray-500">
            No {selectedTab} tenants found.
          </div>
        )}
      </div>

      {/* Invitation Modal */}
      {isInviteModalOpen && (
        <InvitationModal
          open={isInviteModalOpen}
          onOpenChange={setIsInviteModalOpen}
        />
      )}

      {/* Renew Lease Modal */}
      {isRenewLeaseModalOpen && (
        <RenewLeaseModal
          open={isRenewLeaseModalOpen}
          onOpenChange={setIsRenewLeaseModalOpen}
          tenant={selectedTenant}
        />
      )}

      {/* End Lease Modal */}
      {isEndLeaseModalOpen && (
        <ConfirmationModal
          title="Are you sure you want to end this lease? This will terminate the current lease and mark the unit as available for listing."
          isOpen={isEndLeaseModalOpen}
          onClose={() => setIsEndLeaseModalOpen(false)}
          actions={[
            {
              text: "Cancel",
              variant: "outline",
              onClick: () => setIsEndLeaseModalOpen(false),
            },
            {
              text: "Confirm End Lease",
              variant: "default",
              onClick: () => {
                handleLeaseUpdateStatus(selectedTenant.id, "end", () => {
                  setIsEndLeaseModalOpen(false);
                });
              },
              isLoading: isUpdatingLease,
            },
          ]}
        />
      )}
    </React.Fragment>
  );
};

export default TenantManagementComponent;

const tabItems = [
  { label: "Joined", value: "joined", content: null },
  { label: "Invited", value: "invited", content: null },
];
