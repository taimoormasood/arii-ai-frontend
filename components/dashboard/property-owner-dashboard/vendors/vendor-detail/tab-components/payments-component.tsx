"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const payments = [
  {
    id: 1,
    title: "Kitchen Sink Repair",
    location: "Apt 4B",
    amount: 250.0,
    status: "Paid",
    paidOn: "16/04/2025",
    paymentType: "Bank Transfer",
  },
  {
    id: 2,
    title: "Bathroom Pipe Installation",
    location: "Apt 12A",
    amount: 250.0,
    status: "Unpaid",
    paidOn: "--",
    paymentType: "--",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Paid":
      return "bg-primary-200 text-primary-800 border-green-200";
    case "Unpaid":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export default function PaymentsComponent() {
  const handlePayNow = (paymentId: number) => {};

  return (
    <div className="space-y-4">
      {payments.map((payment) => (
        <Card key={payment.id} className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-blue-600 text-lg mb-4">
                  {payment.title} - {payment.location}
                </h3>

                <div className="flex gap-8 text-sm">
                  <div>
                    <p className="text-gray-500 mb-1">Paid On</p>
                    <p className="text-gray-900">{payment.paidOn}</p>
                  </div>

                  <div className="w-px bg-gray-200"></div>

                  <div>
                    <p className="text-gray-500 mb-1">Payment Type</p>
                    <p className="text-gray-900">{payment.paymentType}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-3">
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">
                    ${payment.amount.toFixed(2)}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <Badge
                    variant="outline"
                    className={`text-xs font-medium ${getStatusColor(payment.status)}`}
                  >
                    {payment.status}
                  </Badge>

                  {payment.status === "Unpaid" && (
                    <Button
                      size="sm"
                      className="text-primary-600 hover:bg-transparent bg-transparent"
                      onClick={() => handlePayNow(payment.id)}
                    >
                      Pay Now
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
