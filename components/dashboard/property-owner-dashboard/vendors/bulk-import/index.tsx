"use client";

import FileUploadInterface from "./file-upload-interface";

const BulkImportScreen = () => {
  return (
    <div>
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Bulk Import Vendors
        </h1>
        <p className="text-gray-600">
          Upload a CSV or Excel file to import multiple vendors at once
        </p>
      </div>
      <FileUploadInterface />
    </div>
  );
};

export default BulkImportScreen;
