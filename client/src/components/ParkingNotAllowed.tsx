import { Card, CardContent } from "@/components/ui/card";
import { XCircle } from "lucide-react";

interface ParkingNotAllowedProps {
  date: string;
  time: string;
  reason: string;
  nextAvailableTime?: string;
}

export default function ParkingNotAllowed({
  date,
  time,
  reason,
  nextAvailableTime,
}: ParkingNotAllowedProps) {
  return (
    <Card className="rounded-lg overflow-hidden bg-white shadow-md mb-4">
      <div className="bg-red-500 text-white px-4 py-5">
        <div className="flex items-center">
          <XCircle className="h-8 w-8 mr-3" />
          <div>
            <h2 className="text-xl font-semibold">Parking Not Allowed</h2>
            <p className="text-red-100">{date} • {time}</p>
          </div>
        </div>
      </div>
      <CardContent className="p-4">
        <p className="text-gray-600 mb-3">No parking allowed during:</p>
        <div className="bg-gray-100 p-3 rounded-lg">
          <p className="font-medium">{time}</p>
          <p className="text-gray-500 text-sm">{reason}</p>
        </div>
        {nextAvailableTime && (
          <div className="mt-4 text-sm text-gray-500">
            <p>Parking will be available starting at {nextAvailableTime}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
