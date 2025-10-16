"use client";

import {
  ActiveJobsIcon,
  AvgTenantIcon,
  CompletedJobsIcon,
  RentalIncomeIcon,
} from "@/assets/icons";

export default function Metrics() {
  const metrics = [
    {
      title: "Total Earnings",
      value: "$1000",
      Icon: RentalIncomeIcon,
    },
    {
      title: "Jobs Completed",
      value: "120",
      Icon: CompletedJobsIcon,
    },
    {
      title: "Active Jobs",
      value: "123",
      Icon: ActiveJobsIcon,
    },
    {
      title: "Average Rating",
      value: "4.5",
      Icon: AvgTenantIcon,
    },
  ];

  return (
    <div className="w-full mx-auto bg-white p-4 rounded-md">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-4">
        {metrics.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            Icon={metric.Icon}
          />
        ))}
      </div>
    </div>
  );
}

const MetricCard = ({
  title,
  value,
  Icon,
}: {
  title: string;
  value: string | number;
  Icon: React.FC;
}) => {
  return (
    <div className="flex gap-4 bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-center mb-4 p-3 rounded-lg bg-gradient-to-r from-primary-200 to-primary-100 border border-primary-500 w-12">
        <Icon />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-gray-900">{value}</span>
        </div>
      </div>
    </div>
  );
};
