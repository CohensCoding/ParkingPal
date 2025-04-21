import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { Camera } from '@/components/Camera';
import LoadingState from "@/components/LoadingState";
import ErrorView from "@/components/ErrorView";
import ParkingAllowed from "@/components/ParkingAllowed";
import ParkingNotAllowed from "@/components/ParkingNotAllowed";
import SignInformation from "@/components/SignInformation";
import Location from "@/components/Location";
import NotificationToast from "@/components/NotificationToast";
import TestData from "@/components/TestData";
import { useGeolocation } from "@/hooks/useGeolocation";
import { Button } from "@/components/ui/button";
import { Camera as CameraIcon } from "lucide-react";
import { ParkingAnalysisResult } from "@shared/types";

type ViewState = "camera" | "loading" | "results" | "error";

export default function HomePage() {
  const [viewState, setViewState] = useState<ViewState>("camera");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<ParkingAnalysisResult | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  // Use geolocation
  const { latitude, longitude, address } = useGeolocation();

  const analyzeMutation = useMutation({
    mutationFn: async (imageData: string) => {
      const locationData = address || (latitude && longitude ? `${latitude.toFixed(6)}, ${longitude.toFixed(6)}` : "Unknown location");
      
      const response = await apiRequest("POST", "/api/analyze-sign", {
        imageData,
        location: locationData,
      });
      return response.json();
    },
    onSuccess: (data: ParkingAnalysisResult) => {
      setAnalysisResult(data);
      setViewState("results");
      
      // Show notification after 5 seconds
      setTimeout(() => {
        if (data.isAllowed && data.timeRemaining) {
          setNotificationMessage(`Your parking time will expire in ${data.timeRemaining}`);
          setShowNotification(true);
          
          // Auto-hide notification after 5 seconds
          setTimeout(() => {
            setShowNotification(false);
          }, 5000);
        }
      }, 5000);
    },
    onError: (error) => {
      console.error("Error analyzing sign:", error);
      setViewState("error");
    },
  });

  const handleCapture = (imageData: string) => {
    setCapturedImage(imageData);
    setViewState("loading");
    analyzeMutation.mutate(imageData);
  };

  const handleNewScan = () => {
    setCapturedImage(null);
    setAnalysisResult(null);
    setViewState("camera");
  };

  const handleRetry = () => {
    setViewState("camera");
  };

  const handleManualEntry = () => {
    // For future implementation
    console.log("Manual entry not implemented yet");
  };

  const dismissNotification = () => {
    setShowNotification(false);
  };

  return (
    <>
      {/* Header */}
      <header className="bg-white shadow-sm z-10">
        <div className="px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-primary">ParkSmart</h1>
          <button className="p-2 rounded-full hover:bg-gray-100" aria-label="Settings">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative overflow-hidden">
        {/* Camera View */}
        {viewState === "camera" && (
          <>
            <Camera onCapture={handleCapture} />
            <div className="absolute bottom-20 left-0 right-0 px-4">
              <TestData 
                onTest={(testData) => {
                  // Simulate the analysis process with test data
                  setViewState("loading");
                  setTimeout(() => {
                    setAnalysisResult(testData);
                    setViewState("results");
                    
                    // Show notification for allowed parking
                    if (testData.isAllowed && testData.timeRemaining) {
                      setTimeout(() => {
                        setNotificationMessage(`Your parking time will expire in ${testData.timeRemaining}`);
                        setShowNotification(true);
                        setTimeout(() => setShowNotification(false), 5000);
                      }, 2000);
                    }
                  }, 1500); // Simulate loading for 1.5 seconds
                }}
              />
            </div>
          </>
        )}

        {/* Loading State */}
        {viewState === "loading" && <LoadingState />}

        {/* Results View */}
        {viewState === "results" && analysisResult && (
          <div className="h-full bg-gray-100 overflow-auto">
            <div className="p-4">
              {/* Image Preview */}
              <div className="w-full rounded-lg overflow-hidden shadow-md mb-4 relative bg-white">
                {capturedImage && (
                  <img 
                    src={capturedImage} 
                    alt="Captured parking sign" 
                    className="w-full h-56 object-cover"
                  />
                )}
                <button 
                  onClick={handleNewScan}
                  className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full"
                  aria-label="Retake photo"
                >
                  <CameraIcon className="h-5 w-5" />
                </button>
              </div>

              {/* Parking Status Summary - Prominent confirmation */}
              <div className={`rounded-lg p-4 mb-4 text-center font-medium ${analysisResult.isAllowed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {analysisResult.isAllowed ? (
                  <p>✅ You can park here until {analysisResult.endTime}</p>
                ) : (
                  <p>❌ No parking now – {analysisResult.reason}</p>
                )}
              </div>

              {/* Analysis Result */}
              {analysisResult.isAllowed ? (
                <ParkingAllowed 
                  date={analysisResult.date}
                  time={analysisResult.currentTime}
                  timeRemaining={analysisResult.timeRemaining || ""}
                  currentTime={analysisResult.currentTime}
                  endTime={analysisResult.endTime || ""}
                />
              ) : (
                <ParkingNotAllowed 
                  date={analysisResult.date}
                  time={analysisResult.currentTime}
                  reason={analysisResult.reason || "No parking allowed"}
                  nextAvailableTime={analysisResult.endTime}
                />
              )}
              
              {/* Extracted Text Section */}
              <div className="mb-4 bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200">
                  <h3 className="font-medium">Extracted Text</h3>
                </div>
                <div className="p-4">
                  <div className="bg-gray-50 p-3 rounded border border-gray-200 text-sm whitespace-pre-wrap break-words">
                    {analysisResult.signText || "No text extracted"}
                  </div>
                </div>
              </div>

              {/* Sign Information */}
              <SignInformation rules={analysisResult.rules} />

              {/* Location */}
              <Location />

              <div className="mt-6 mb-20">
                <Button 
                  onClick={handleNewScan}
                  className="w-full py-6 bg-primary text-white rounded-lg shadow-md font-medium flex items-center justify-center text-lg"
                >
                  <CameraIcon className="mr-2 h-6 w-6" />
                  Scan Another Sign
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Error View */}
        {viewState === "error" && (
          <ErrorView onRetry={handleRetry} onManualEntry={handleManualEntry} />
        )}
      </main>

      {/* Notification Toast */}
      <NotificationToast 
        show={showNotification}
        title="Parking Alert"
        message={notificationMessage}
        onDismiss={dismissNotification}
      />
    </>
  );
}
