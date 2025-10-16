"use client";
import { Mail, MapPin, Phone } from "lucide-react";
import { useParams } from "next/navigation";
import React from "react";

import { ChatIcon } from "@/assets/icons";
import { girlAvatarImg } from "@/assets/images";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatText } from "@/helpers";
import { useGetVendorDetails } from "@/hooks/api/use-vendors";

import Metrics from "./metrics";
import CertificationsComponent from "./tab-components/certifications-component";
import JobsComponent from "./tab-components/jobs-component";
import PaymentsComponent from "./tab-components/payments-component";
import ServicesComponent from "./tab-components/services-component";
import TabsSection from "./tabs-section";

const VendorDetailComponent: React.FC = () => {
  const params = useParams();
  const vendorId = typeof params?.id === "string" ? params.id : undefined;

  if (!vendorId) {
    return (
      <div className="text-center py-8 text-gray-500">No vendor selected.</div>
    );
  }

  const { data, isLoading, error } = useGetVendorDetails(vendorId);

  if (isLoading) {
    return <div className="text-center py-8">Loading vendor details...</div>;
  }
  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Error loading vendor details. Please try again later.
      </div>
    );
  }
  if (!data?.data) {
    return (
      <div className="text-center py-8 text-gray-500">
        No vendor details found.
      </div>
    );
  }

  const vendorDetail = data.data;
  const basic = vendorDetail.basic_info || {};
  const info = vendorDetail.vendor_info || {};

  return (
    <React.Fragment>
      <div className="flex-1 space-y-6">
        <Card>
          <CardContent className="pt-6">
            {/* Vendor Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={girlAvatarImg.src}
                    alt={basic.full_name || "Vendor"}
                  />
                  <AvatarFallback>
                    {basic.full_name ? basic.full_name[0] : "V"}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <div>
                    <h1 className="text-lg font-semibold">
                      {basic.full_name || "-"}
                    </h1>
                    <p className="text-gray-500 text-sm font-semibold">
                      {basic.vendor_role || "-"}
                    </p>
                  </div>
                  {/* You may want to show reviews if available in future */}
                </div>
              </div>

              <div className="space-y-3 text-right">
                {basic.phone_number && (
                  <div className="flex items-center justify-end space-x-2 text-sm text-gray-700">
                    <Phone className="h-4 w-4" />
                    <span>{basic.phone_number}</span>
                  </div>
                )}
                {basic.email && (
                  <div className="flex items-center justify-end space-x-2 text-sm text-gray-700">
                    <Mail className="h-4 w-4" />
                    <span>{basic.email}</span>
                  </div>
                )}
                {info.business_address && (
                  <div className="flex items-center justify-end space-x-2 text-sm text-gray-700">
                    <MapPin className="h-4 w-4" />
                    <span>{info.business_address}</span>
                  </div>
                )}
                <Button className="bg-primary-600 hover:bg-primary-700">
                  <ChatIcon className="h-4 w-4 mr-2" />
                  Chat with Vendor
                </Button>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-800 text-sm">
                Description
              </h3>
              <p className="text-sm text-gray-800 leading-relaxed">
                {basic.description || "-"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* metrics */}
        <Metrics />

        <TabsSection
          tabs={[
            {
              label: "Vendor Info",
              value: "vendor-info",
              content: (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Basic Info</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-6">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">
                            Years of Experience
                          </p>
                          <p className="font-medium text-gray-700">
                            {info?.years_of_experience}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">
                            Availability
                          </p>
                          <p className="font-medium text-gray-700">
                            {info?.availability || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">
                            Emergency Service Available
                          </p>
                          <p className="font-medium text-gray-700">
                            {info?.emergency_services ? "Yes" : "No"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">
                            Languages Spoken
                          </p>
                          <p className="font-medium text-gray-700">
                            {info?.languages || "-"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">
                            Insurance Coverage
                          </p>
                          <p className="font-medium text-gray-700">
                            {info?.insurance_coverage ? "Yes" : "No"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">
                            Registration Type
                          </p>
                          <p className="font-medium text-gray-700">
                            {" "}
                            {formatText(info?.registration_type) || "-"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Business Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">
                            Business Name
                          </p>
                          <p className="font-medium text-gray-700">
                            {info?.business_name || "-"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Website</p>
                          {info?.business_website &&
                          info.business_website.startsWith("http") ? (
                            <a
                              href={
                                info.business_website.startsWith("http")
                                  ? info.business_website
                                  : `https://${info.business_website}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium text-blue-600 hover:underline"
                            >
                              {info.business_website}
                            </a>
                          ) : (
                            <p className="font-medium text-gray-700">-</p>
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">
                            Registration ID
                          </p>
                          <p className="font-medium text-gray-700">
                            {info?.registration_id || "-"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">
                            Business Type
                          </p>
                          <p className="font-medium text-gray-700">
                            {info?.business_type || "-"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Address</p>
                          <p className="font-medium text-gray-700">
                            {info?.business_address || "-"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">
                            Business Licenses
                          </p>
                          <div className="space-y-1">
                            {info?.business_license?.length > 0
                              ? info?.business_license?.map((item) => (
                                  <p
                                    key={item.id}
                                    className="font-medium text-gray-700 text-sm"
                                  >
                                    • {item.name}
                                  </p>
                                ))
                              : "-"}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ),
            },
            {
              label: "Services",
              value: "services",
              content: (
                <Card>
                  <CardHeader>
                    <CardTitle>Services Offered</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ServicesComponent servicesData={vendorDetail?.services} />
                  </CardContent>
                </Card>
              ),
            },
            {
              label: "Certification",
              value: "certification",
              content: (
                <Card>
                  <CardHeader>
                    <CardTitle>Certifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CertificationsComponent
                      certificationData={vendorDetail?.certification_info}
                    />
                  </CardContent>
                </Card>
              ),
            },
            {
              label: "Jobs",
              value: "jobs",
              content: (
                <Card>
                  <CardHeader>
                    <CardTitle>Jobs</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3">
                    <JobsComponent />
                  </CardContent>
                </Card>
              ),
            },
            {
              label: "Payments",
              value: "payments",
              content: (
                <Card>
                  <CardHeader>
                    <CardTitle>Payment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PaymentsComponent />
                  </CardContent>
                </Card>
              ),
            },
          ]}
          defaultValue="vendor-info"
        />
      </div>
    </React.Fragment>
  );
};

export default VendorDetailComponent;
