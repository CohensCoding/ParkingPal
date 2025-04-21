import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle } from "lucide-react";

interface ParkingAllowedProps {
  date: string;
  time: string;
  timeRemaining: string;
  currentTime: string;
  endTime: string;
}

export default function ParkingAllowed({
  date,
  time,
  timeRemaining,
  currentTime,
  endTime,
}: ParkingAllowedProps) {
  // Calculate progress percentage based on time remaining
  // This is a simplified calculation
  const calculateProgress = (): number => {
    try {
      const timeparts = timeRemaining.split(/[hm\s]+/);
      const hours = parseInt(timeparts[0]) || 0;
      const minutes = parseInt(timeparts[1]) || 0;
      const totalMinutesRemaining = hours * 60 + minutes;
      
      // Assume a standard 2-hour parking
      const totalAllowedMinutes = 120;
      const minutesUsed = totalAllowedMinutes - totalMinutesRemaining;
      
      const percentage = (minutesUsed / totalAllowedMinutes) * 100;
      return Math.min(Math.max(percentage, 0), 100);
    } catch (e) {
      return 50; // Default fallback
    }
  };

  return (
    <Card className="rounded-lg overflow-hidden bg-white shadow-md mb-4">
      <div className="bg-green-500 text-white px-4 py-5">
        <div className="flex items-center">
          <CheckCircle className="h-8 w-8 mr-3" />
          <div>
            <h2 className="text-xl font-semibold">Parking Allowed</h2>
            <p className="text-green-100">{date} • {time}</p>
          </div>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-500">Time remaining:</span>
          <span className="text-lg font-medium" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {timeRemaining}
          </span>
        </div>
        <Progress value={calculateProgress()} className="h-2.5 bg-gray-200" />
        <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
          <span>Current: {currentTime}</span>
          <span>Until: {endTime}</span>
        </div>
      </CardContent>
    </Card>
  );
}
