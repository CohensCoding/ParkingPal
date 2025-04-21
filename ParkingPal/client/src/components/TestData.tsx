import { Button } from "@/components/ui/button";
import { ParkingAnalysisResult } from "@shared/types";

// Sample test data to simulate a scan result
const testData: ParkingAnalysisResult = {
  isAllowed: true,
  timeRemaining: "1h 30m",
  currentTime: "3:45 PM",
  date: "Monday, April 21, 2025",
  endTime: "5:15 PM",
  rules: [
    {
      type: "allowed",
      days: ["monday", "tuesday", "wednesday", "thursday", "friday"],
      startTime: "09:00",
      endTime: "18:00",
      description: "2 Hour Parking",
      durationMinutes: 120
    },
    {
      type: "notAllowed",
      days: ["saturday", "sunday"],
      startTime: "00:00",
      endTime: "23:59",
      description: "No Parking on Weekends"
    }
  ],
  signText: "2 HOUR PARKING\n8AM - 6PM\nMON - FRI\nNO PARKING WEEKENDS\nTOW-AWAY ZONE"
};

// Sample test data for not allowed parking
const testDataNotAllowed: ParkingAnalysisResult = {
  isAllowed: false,
  currentTime: "7:30 PM",
  date: "Monday, April 21, 2025",
  endTime: "8:00 AM",
  reason: "No parking after 6:00 PM",
  rules: [
    {
      type: "allowed",
      days: ["monday", "tuesday", "wednesday", "thursday", "friday"],
      startTime: "08:00",
      endTime: "18:00",
      description: "Parking allowed during business hours",
    },
    {
      type: "notAllowed",
      days: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
      startTime: "18:00",
      endTime: "08:00",
      description: "No parking overnight"
    }
  ],
  signText: "PARKING\n8AM - 6PM\nMON - FRI\nNO PARKING\nOVERNIGHT"
};

interface TestDataProps {
  onTest: (data: ParkingAnalysisResult) => void;
}

export default function TestData({ onTest }: TestDataProps) {
  return (
    <div className="p-4 bg-gray-100 rounded-lg mb-4">
      <h3 className="font-medium mb-3">Test Data (Developer Options)</h3>
      <div className="space-y-2">
        <Button 
          onClick={() => onTest(testData)}
          variant="outline"
          className="w-full"
        >
          Test: Parking Allowed
        </Button>
        <Button 
          onClick={() => onTest(testDataNotAllowed)}
          variant="outline"
          className="w-full"
        >
          Test: Parking Not Allowed
        </Button>
      </div>
    </div>
  );
}