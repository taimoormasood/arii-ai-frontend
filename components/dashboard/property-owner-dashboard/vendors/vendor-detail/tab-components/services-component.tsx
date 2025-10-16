import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  servicesData: {
    [category: string]: string[];
  };
}

const ServicesComponent = ({ servicesData }: Props) => {
  return (
    <React.Fragment>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {servicesData ? (
          <>
            {Object.entries(servicesData).map(([category, services]) => (
              <Card key={category}>
                <CardHeader className="p-3">
                  <CardTitle className="text-sm text-semibold">
                    {category}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3">
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(services) &&
                      services.map((service, index) => (
                        <span
                          key={index}
                          className="inline-block text-xs text-gray-700 bg-gray-100 rounded-full px-3 py-1"
                        >
                          {service}
                        </span>
                      ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          <div className="col-span-full">
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">
                  No services information available.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default ServicesComponent;
