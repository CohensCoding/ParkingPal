import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Loader2 } from "lucide-react";
import { useGeolocation } from "@/hooks/useGeolocation";

export default function Location() {
  const { latitude, longitude, address, loading, error } = useGeolocation();

  return (
    <Card className="rounded-lg overflow-hidden bg-white shadow-md mb-4">
      <div className="px-4 py-3 border-b border-gray-200">
        <h3 className="font-medium">Location</h3>
      </div>
      <CardContent className="p-3">
        <div className="bg-gray-100 rounded-lg overflow-hidden h-32 flex items-center justify-center">
          {loading ? (
            <div className="text-gray-400 flex flex-col items-center">
              <Loader2 className="h-8 w-8 mb-2 animate-spin" />
              <span className="text-sm">Getting location...</span>
            </div>
          ) : error ? (
            <div className="text-gray-400 flex flex-col items-center text-center px-4">
              <MapPin className="h-8 w-8 mb-2 text-red-400" />
              <span className="text-sm">{error}</span>
            </div>
          ) : (
            <div className="w-full h-full p-3 flex flex-col justify-center">
              <div className="text-center mb-2">
                <span className="text-sm font-medium">Current Coordinates</span>
              </div>
              <div className="bg-white p-2 rounded-md text-sm text-center">
                {latitude && longitude ? (
                  <span className="font-mono">{latitude.toFixed(6)}, {longitude.toFixed(6)}</span>
                ) : (
                  <span>Coordinates not available</span>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="mt-2 text-sm text-gray-500 flex items-center">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{address || "Location data unavailable"}</span>
        </div>
      </CardContent>
    </Card>
  );
}
