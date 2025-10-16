import React from "react";

const UnavailabilityDialog = ({
  open,
  onClose,
  date,
}: {
  open: boolean;
  onClose: () => void;
  date: string;
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100 bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-lg font-semibold mb-4">Mark Date Unavailable</h2>
        <p className="mb-4">
          Are you sure you want to mark <strong>{date}</strong> as unavailable?
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-gray-200 rounded"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onClose();
              // Optionally handle save here or in parent
            }}
            className="px-4 py-2 text-sm bg-red-500 text-white rounded"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnavailabilityDialog;
