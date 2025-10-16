import { MoreHorizontal } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type TaskStatus = "in-progress" | "pending" | "completed";
type TaskPriority = "Low" | "Medium" | "High";

interface TaskCardProps {
  title: string;
  priority: TaskPriority;
  assignee: string;
  status: TaskStatus;
  progressPercentage: number;
}

export function TaskCard({
  title,
  priority,
  assignee,
  status,
  progressPercentage,
}: TaskCardProps) {
  // Determine status label and color
  const statusConfig = {
    "in-progress": {
      label: "In Progress",
      color: "text-primary-500",
      badgeClass: "bg-[#ECFCCB]",
    },
    pending: {
      label: "Pending",
      color: "text-[#F79009]",
      badgeClass: "bg-[#FEF0C7]",
    },
    completed: {
      label: "Completed",
      color: "text-[#039855]",
      badgeClass: "bg-[#D1FADF]",
    },
  };

  // Determine avatar background color based on status
  const avatarBgColor = {
    "in-progress": "bg-primary-500",
    pending: "bg-[#F79009]",
    completed: "bg-[#039855]",
  };

  // Determine progress bar colors
  const progressBarColor = {
    "in-progress": "progress-green",
    pending: "progress-orange",
    completed: "progress-green",
  };

  return (
    <div className="bg-[#F9FAFB] rounded-lg p-3 card-shadow">
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-sm font-medium">{title}</h4>
        <button className="text-gray-500">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      <div className="flex gap-2 mb-3">
        <span className="text-xs px-2 py-0.5 rounded-full bg-[#F2F4F7] text-[#344054]">
          2 Jul, 9:00a
        </span>
        <span className="text-xs px-2 py-0.5 rounded-full bg-[#F2F4F7] text-[#344054]">
          Priority: {priority}
        </span>
        <span
          className={`text-xs px-2 py-0.5 rounded-full ${statusConfig[status].badgeClass} ${statusConfig[status].color}`}
        >
          {statusConfig[status].label}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-[#F2F4F7] rounded-full h-1 mb-3">
        <div
          className={`progress-bar ${progressBarColor[status]}`}
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      <div className="flex justify-between items-center">
        <Avatar className="w-6 h-6">
          <AvatarFallback
            className={`${avatarBgColor[status]} text-white text-xs`}
          >
            {assignee}
          </AvatarFallback>
        </Avatar>

        <span className={`text-xs ${statusConfig[status].color}`}>
          Status: {statusConfig[status].label}
        </span>
      </div>
    </div>
  );
}
