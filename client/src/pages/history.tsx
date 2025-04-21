import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CheckIcon, XIcon, ClockIcon, MapPinIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ParkingSign, ParkingHistory } from "@shared/schema";
import { cn } from "@/lib/utils";

// Define a type for history items with the sign data
interface HistoryItemWithSign extends ParkingHistory {
  sign?: ParkingSign;
}

export default function HistoryPage() {
  const { data: parkingHistory, isLoading, isError, error } = useQuery<HistoryItemWithSign[]>({
    queryKey: ['/api/history'],
    refetchOnWindowFocus: false,
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm z-10">
        <div className="px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-primary">Parking History</h1>
        </div>
      </header>

      <main className="flex-1 p-4">
        {isLoading ? (
          // Loading skeleton
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="mb-4">
              <CardHeader className="pb-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-24 mt-1" />
              </CardHeader>
              <CardContent>
                <div className="flex justify-between mb-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-16 w-full rounded-md" />
              </CardContent>
            </Card>
          ))
        ) : isError ? (
          // Error state
          <div className="flex flex-col items-center justify-center h-96">
            <div className="bg-red-100 rounded-full p-4 mb-4">
              <XIcon className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Unable to Load History</h2>
            <p className="text-gray-500 text-center max-w-xs">
              There was a problem loading your parking history. Please try again later.
            </p>
          </div>
        ) : parkingHistory && parkingHistory.length > 0 ? (
          // History items
          parkingHistory.map((item: any) => (
            <Card key={item.id} className="mb-4">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {new Date(item.createdAt).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </CardTitle>
                  <Badge variant={item.isAllowed ? "success" : "destructive"}>
                    {item.isAllowed ? (
                      <CheckIcon className="h-3 w-3 mr-1" />
                    ) : (
                      <XIcon className="h-3 w-3 mr-1" />
                    )}
                    {item.isAllowed ? "Allowed" : "Not Allowed"}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500">
                  {new Date(item.createdAt).toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit',
                    hour12: true
                  })}
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between mb-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    {item.timeRemaining || "N/A"}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    {item.sign?.location || "Unknown location"}
                  </div>
                </div>
                <div className="mt-2 bg-gray-100 p-3 rounded-md text-sm">
                  <p className="font-medium mb-1">Sign text:</p>
                  <p className="text-gray-600 line-clamp-2">{item.sign?.imageText || "No text available"}</p>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          // Empty state
          <div className="flex flex-col items-center justify-center h-96">
            <div className="bg-gray-100 rounded-full p-4 mb-4">
              <ClockIcon className="h-8 w-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No History Yet</h2>
            <p className="text-gray-500 text-center max-w-xs">
              Your parking scan history will appear here after you analyze your first parking sign.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
