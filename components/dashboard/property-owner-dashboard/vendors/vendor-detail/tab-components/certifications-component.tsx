import React from "react";

import { BulkTemplateDownloadIcon } from "@/assets/icons";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  certificationData: Array<{
    name: string;
    url: string;
  }>;
}

const CertificationsComponent: React.FC<Props> = ({
  certificationData = [],
}) => {
  const handleCertificationDownload = (url: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = url.split("/").pop() || "certificate";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <React.Fragment>
      {certificationData && certificationData?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificationData.map((cert, index) => (
            <Card key={index} className="space-y-3">
              <CardContent className="p-3">
                <div className="aspect-[4/3] bg-gray-50 rounded-lg border-2 border-gray-200 overflow-hidden relative">
                  <img
                    src={cert.url}
                    alt={cert.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.currentTarget;
                      const fallback = target.nextElementSibling as HTMLElement;
                      target.style.display = "none";
                      if (fallback) {
                        fallback.style.display = "flex";
                      }
                    }}
                  />
                  <div
                    className="absolute inset-0 bg-gray-100 items-center justify-center text-gray-500 text-sm"
                    style={{ display: "none" }}
                  >
                    Certificate Preview
                  </div>
                </div>
                <div className="text-center flex justify-between items-center pt-2">
                  <h3 className="text-sm font-semibold text-gray-800 mb-1">
                    {cert?.name?.slice(0, 20)}...
                  </h3>
                  <span
                    onClick={() => handleCertificationDownload(cert.url)}
                    className="cursor-pointer"
                  >
                    <BulkTemplateDownloadIcon />
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">
          No certification information available.
        </p>
      )}
    </React.Fragment>
  );
};

export default CertificationsComponent;
