import { Calendar, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const JobsComponent = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-primary-200 text-primary-800 border-green-200";
      case "In Progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Scheduled":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {jobs.map((job) => (
        <Card
          key={job.id}
          className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          <CardHeader className="p-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-blue-600 text-sm mb-1">
                  {job.title} - {job.location}
                </h3>
                <p className="text-gray-600 text-sm mb-2">{job.category}</p>
              </div>
              <Badge
                variant="outline"
                className={`text-xs font-medium ${getStatusColor(job.status)}`}
              >
                {job.status}
              </Badge>
            </div>

            {job.rating && (
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm text-gray-600">
                  ({job.rating} Reviews)
                </span>
              </div>
            )}
          </CardHeader>

          <CardContent className="p-3">
            <div className="space-y-2 text-sm text-gray-600 border-t border-gray-200 pt-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Start: {job.startDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>End: {job.endDate}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default JobsComponent;

const jobs = [
  {
    id: 1,
    title: "Kitchen Sink Repair",
    location: "Apt 4B",
    category: "Plumbing",
    status: "Completed",
    rating: 4.5,
    reviewCount: 5,
    startDate: "12/04/2025",
    endDate: "12/05/2025",
  },
  {
    id: 2,
    title: "Bathroom Pipe Installation",
    location: "Apt 12A",
    category: "Plumbing",
    status: "In Progress",
    startDate: "12/04/2025",
    endDate: "12/05/2025",
  },
  {
    id: 3,
    title: "Emergency Leak Fix",
    location: "Apt 7C",
    category: "Plumbing",
    status: "Pending",
    startDate: "12/04/2025",
    endDate: "12/05/2025",
  },
  {
    id: 4,
    title: "Water Heater Maintenance",
    location: "Apt 15B",
    category: "Plumbing",
    status: "Scheduled",
    startDate: "12/06/2025",
    endDate: "12/06/2025",
  },
];
