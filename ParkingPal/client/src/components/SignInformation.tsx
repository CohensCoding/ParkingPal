import { Card, CardContent } from "@/components/ui/card";
import { Clock, Calendar, Info } from "lucide-react";
import { ParkingRule } from "@shared/types";

interface SignInformationProps {
  rules: ParkingRule[];
}

export default function SignInformation({ rules }: SignInformationProps) {
  const renderRuleIcon = (rule: ParkingRule) => {
    if (rule.type === 'allowed' && rule.durationMinutes) {
      return <Clock className="text-gray-400 mt-0.5 mr-3 h-5 w-5" />;
    } else if (rule.days && rule.days.length < 7) {
      return <Calendar className="text-gray-400 mt-0.5 mr-3 h-5 w-5" />;
    } else {
      return <Info className="text-gray-400 mt-0.5 mr-3 h-5 w-5" />;
    }
  };

  const formatDays = (days: string[]) => {
    if (days.length === 7) {
      return "Every day";
    } else if (days.length === 5 && 
              days.includes("monday") && 
              days.includes("tuesday") && 
              days.includes("wednesday") && 
              days.includes("thursday") && 
              days.includes("friday")) {
      return "Monday through Friday";
    } else if (days.length === 2 && 
              days.includes("saturday") && 
              days.includes("sunday")) {
      return "Weekends";
    } else {
      return days.map(day => day.charAt(0).toUpperCase() + day.slice(1)).join(", ");
    }
  };

  const formatTimeRange = (start: string, end: string) => {
    // Convert 24h format to 12h format
    const format12h = (time: string) => {
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours, 10);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minutes} ${ampm}`;
    };
    
    return `${format12h(start)} to ${format12h(end)}`;
  };

  return (
    <Card className="rounded-lg overflow-hidden bg-white shadow-md mb-4">
      <div className="px-4 py-3 border-b border-gray-200">
        <h3 className="font-medium">Sign Information</h3>
      </div>
      <CardContent className="px-4 py-3">
        <div className="space-y-3">
          {rules.map((rule, index) => (
            <div key={index} className="flex items-start">
              {renderRuleIcon(rule)}
              <div>
                <p className="font-medium">
                  {rule.type === 'allowed' 
                    ? (rule.durationMinutes ? `${Math.floor(rule.durationMinutes / 60)} Hour Parking` : "Parking Allowed") 
                    : "No Parking"}
                </p>
                <p className="text-sm text-gray-500">{formatTimeRange(rule.startTime, rule.endTime)}</p>
                <p className="text-sm text-gray-500">{formatDays(rule.days)}</p>
                {rule.description && rule.description !== "Parking allowed" && rule.description !== "No parking" && (
                  <p className="text-sm text-gray-500">{rule.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
