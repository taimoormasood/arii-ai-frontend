import { Edit, Trash2 } from "lucide-react";
import React from "react";

import TrashIcon from "@/assets/icons/trash-icon";
import { Button } from "@/components/ui/button";
import { formatText } from "@/helpers";

interface FeeItem {
  category?: string;
  feeName: string;
  paymentFrequency: string;
  feeAmount: string | number;
  feeType: string;
  refundableFee?: "non_refundable" | "partially_refundable" | "refundable";
  requiredFee: "required" | "in_rent" | "optional";
}

interface FeeCardProps {
  index: number;
  item: FeeItem;
  onEdit: (index: number, item: FeeItem) => void;
  onDelete: () => void;
}

const FeeCard = ({ index, item, onEdit, onDelete }: FeeCardProps) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg lg:p-6 p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="lg:text-xl text-base font-semibold text-gray-900 capitalize">
          {formatText(item.feeName)}
        </h2>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            onClick={() => onEdit(index, item)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 bg-white hover:bg-gray-50"
          >
            <Edit size={16} />
            <span className="lg:text-sm text-xs font-medium xl:inline-block hidden">
              Edit
            </span>
          </Button>
          <Button
            type="button"
            onClick={onDelete}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 bg-white hover:bg-gray-50"
          >
            <TrashIcon />
            <span className="lg:text-sm text-xs font-medium xl:inline-block hidden">
              Remove
            </span>
          </Button>
        </div>
      </div>

      {/* Fee Details */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="lg:text-sm text-xs text-gray-600 font-medium">
            Fee Name
          </span>
          <span className="lg:text-sm text-xs text-gray-900 font-medium">
            {formatText(item.feeName)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="lg:text-sm text-xs text-gray-600 font-medium">
            Payment Frequency
          </span>
          <span className="lg:text-sm text-xs text-gray-900 font-medium">
            {formatText(item.paymentFrequency)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="lg:text-sm text-xs text-gray-600 font-medium">
            Fee Amount
          </span>
          <span className="lg:text-sm text-xs text-gray-900 font-medium">
            ${item.feeAmount}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="lg:text-sm text-xs text-gray-600 font-medium">
            Fee Type
          </span>
          <span className="lg:text-sm text-xs text-gray-900 font-medium">
            {formatText(item.feeType)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="lg:text-sm text-xs text-gray-600 font-medium">
            Is This Fee Refundable?
          </span>
          <span className="lg:text-sm text-xs text-gray-900 font-medium">
            {item.refundableFee === "refundable"
              ? "Yes"
              : item.refundableFee === "partially_refundable"
                ? "Partially"
                : "No"}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="lg:text-sm text-xs text-gray-600 font-medium">
            Is This Fee Required?
          </span>
          <span className="lg:text-sm text-xs text-gray-900 font-medium">
            {item.requiredFee === "required"
              ? "Yes"
              : item.requiredFee === "in_rent"
                ? "Included"
                : "Optional"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FeeCard;
