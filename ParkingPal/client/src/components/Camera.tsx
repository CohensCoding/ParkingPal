import { useEffect, useRef, useState } from 'react';
import { useCamera } from '@/hooks/useCamera';
import { Button } from "@/components/ui/button";
import { formatCurrentDateTime } from '@/utils/time';

interface CameraProps {
  onCapture: (dataUrl: string) => void;
}

export function Camera({ onCapture }: CameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentDateTime, setCurrentDateTime] = useState<string>(formatCurrentDateTime());
  const { stream, error, startCamera } = useCamera();

  useEffect(() => {
    startCamera();
    
    // Update date/time every minute
    const interval = setInterval(() => {
      setCurrentDateTime(formatCurrentDateTime());
    }, 60000);
    
    return () => {
      clearInterval(interval);
    };
  }, [startCamera]);

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw current video frame to canvas
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to data URL
        const dataUrl = canvas.toDataURL('image/jpeg');
        onCapture(dataUrl);
      }
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center bg-black p-4">
        <div className="relative w-full max-w-md camera-viewfinder overflow-hidden rounded-lg border-2 border-white border-opacity-50" style={{ aspectRatio: '3/4' }}>
          {error ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white text-center p-4">
              <div>
                <p className="mb-2 font-semibold">Camera access is required</p>
                <p className="text-sm text-gray-300">Please allow camera access to scan parking signs</p>
              </div>
            </div>
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          )}
          
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-3/4 h-3/4 border-2 border-white border-opacity-70 rounded"></div>
          </div>
          
          <div className="absolute top-4 left-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-xs">
            <span>{currentDateTime}</span>
          </div>
        </div>
        
        <div className="text-white mt-4 text-center text-sm max-w-xs mx-auto">
          <p>Position the parking sign within the frame</p>
        </div>
      </div>
      
      <div className="bg-black p-6 flex justify-center">
        <button 
          onClick={handleCapture}
          className="custom-capture-button w-16 h-16 bg-white rounded-full flex items-center justify-center focus:outline-none focus-ring"
          style={{ boxShadow: '0 0 0 8px rgba(255, 255, 255, 0.3)' }}
        >
          <div className="w-14 h-14 rounded-full border-2 border-gray-300"></div>
        </button>
      </div>
      
      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}
