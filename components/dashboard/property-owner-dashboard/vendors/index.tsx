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
import { formatText } from "@/helpers";

import AssignTaskModal from "./assign-task-modal-ui";
import { ConfirmationModal } from "./confirmation-modal";
import InvitationModal from "./invitation-modal";
import useVendorManagement from "./use-vendor-management";
import { VendorConfirmationModal } from "./vendor-confirmation-modal";

const VendorManagementComponent: FC = () => {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isVendorConfirmationModalOpen, setIsVendorConfirmationModalOpen] =
    useState(false);
  const [isAssignTaskModalOpen, setIsAssignTaskModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    block: boolean;
    vendorId: number | null;
    isDeleteMode?: boolean;
  }>({ block: true, vendorId: null, isDeleteMode: false });

  const router = useRouter();

  const {
    handleSearchFilter,
    selectedTab,
    handleTabChange,
    vendors,
    isPending,
    error,
    handleVendorStatus,
    handleDeleteVendor,
    isDeleting,
    isUpdating,
    searchFieldRef,
    handleResendInvitation,
    isResending,
    resendingInvitationId,
  } = useVendorManagement();

  const columns: Column<any>[] = [
    {
      id: "first_name",
      label: "VENDOR NAME",
      render: (_, row) => <span>{`${row.first_name} ${row.last_name}`}</span>,
    },
    {
      id: "role",
      label: "Role",
      render: (val) => <span>{formatText(val)}</span>,
    },
    {
      id: "email",
      label: "Email",
      render: (val) => <span>{val}</span>,
    },
    {
      id: "actions",
      label: "ACTION",
      render: (_, row) => {
        if (selectedTab === "invited") {
          const isCurrentlyResending = resendingInvitationId === row.id;

          return (
            <div className="flex justify-end">
              <Button
                variant="link"
                className="text-primary-600 hover:text-primary-700 p-0 h-fit"
                onClick={() => handleResendInvitation(row.id)}
                disabled={isCurrentlyResending}
              >
                {isCurrentlyResending ? "Resending..." : "Resend Invitation"}
              </Button>
            </div>
          );
        }

        const joinedActions = [
          {
            label: "View",
            action: () => router.push(`/vendors/vendor-detail/${row.id}`),
          },
          {
            label: "Assign Task",
            action: () => setIsAssignTaskModalOpen(true),
          },
          {
            label: "Block",
            action: () => {
              setConfirmAction({
                block: true,
                vendorId: row.id,
              });
              setIsConfirmModalOpen(true);
            },
          },
          {
            label: "Delete",
            action: () => {
              setConfirmAction({
                block: false,
                vendorId: row.id,
                isDeleteMode: true,
              });
              setIsConfirmModalOpen(true);
            },
          },
        ];

        const blockedActions = [
          {
            label: "View",
            action: () => router.push(`/vendors/vendor-detail/${row.id}`),
          },
          {
            label: "Unblock",
            action: () => {
              setConfirmAction({
                block: false,
                vendorId: row.id,
              });
              setIsConfirmModalOpen(true);
            },
          },
          {
            label: "Delete",
            action: () => {
              setConfirmAction({
                block: false,
                vendorId: row.id,
                isDeleteMode: true,
              });
              setIsConfirmModalOpen(true);
            },
          },
        ];

        const actionList =
          selectedTab === "joined" ? joinedActions : blockedActions;

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
                {actionList.map((item) => (
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

  return (
    <React.Fragment>
      {isVendorConfirmationModalOpen && (
        <VendorConfirmationModal
          isOpen={isVendorConfirmationModalOpen}
          onClose={() => setIsVendorConfirmationModalOpen(false)}
          actions={[
            {
              text: "Add Manually",
              variant: "outline",
              onClick: () => {
                setIsInviteModalOpen(true);
              },
            },
            {
              text: "Bulk Import",
              variant: "default",
              onClick: () => {
                router.push(`/vendors/bulk-import`);
              },
            },
          ]}
        />
      )}
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Vendor Management
        </h1>
        <p className="text-gray-600">
          Simplify vendor onboarding, invitations, and profile management.
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
            placeholder="Search by vendor name, role, or email"
            onChange={handleSearchFilter}
          />

          <Button
            className="bg-primary-600 hover:bg-primary-700 text-white !cursor-pointer"
            onClick={() => setIsVendorConfirmationModalOpen(true)}
          >
            <InviteIcon className="mr-1" /> Invite
          </Button>
        </div>
      </div>
      {/* table */}
      <div className="mt-4">
        {isPending ? (
          <div className="text-center py-8">Loading vendors...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            Error loading vendors data.
          </div>
        ) : vendors && vendors.length > 0 ? (
          <CustomTable
            columns={columns}
            data={vendors}
            module="vendors-management"
          />
        ) : (
          <div className="text-center py-8 text-gray-500">
            No {selectedTab} vendors found.
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

      {/* Assign Task Modal */}
      {isAssignTaskModalOpen && (
        <AssignTaskModal
          open={isAssignTaskModalOpen}
          onOpenChange={setIsAssignTaskModalOpen}
        />
      )}

      {/* Confirmation Modal */}
      {isConfirmModalOpen && (
        <ConfirmationModal
          title={
            confirmAction.isDeleteMode
              ? "Are you sure you want to delete this vendor? Deleting this vendor will remove them from the platform and any tasks/jobs associated with them."
              : confirmAction.block
                ? "Are you sure you want to block this vendor? They will no longer be able to receive tasks until unblocked."
                : "Are you sure you want to unblock this vendor? They will be eligible to receive tasks."
          }
          isOpen={isConfirmModalOpen}
          isDeleteMode={confirmAction.isDeleteMode}
          onClose={() => setIsConfirmModalOpen(false)}
          actions={[
            {
              text: "Cancel",
              variant: "outline",
              onClick: () => setIsConfirmModalOpen(false),
            },
            confirmAction.isDeleteMode
              ? {
                  text: "Yes, Delete",
                  variant: "destructive",
                  onClick: () => {
                    if (confirmAction.vendorId) {
                      handleDeleteVendor(confirmAction.vendorId, () => {
                        setIsConfirmModalOpen(false);
                      });
                    }
                  },
                  isLoading: isDeleting,
                }
              : {
                  text: confirmAction.block ? "Yes, Block" : "Yes, Unblock",
                  variant: "default",
                  onClick: () => {
                    if (confirmAction.vendorId) {
                      handleVendorStatus(
                        confirmAction.block,
                        confirmAction.vendorId,
                        () => {
                          setIsConfirmModalOpen(false);
                        }
                      );
                    }
                  },
                  isLoading: isUpdating,
                },
          ]}
        />
      )}
    </React.Fragment>
  );
};

export default VendorManagementComponent;

const tabItems = [
  { label: "Joined", value: "joined", content: null },
  { label: "Invited", value: "invited", content: null },
  { label: "Blocked", value: "blocked", content: null },
];
