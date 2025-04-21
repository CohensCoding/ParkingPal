import { useState, useCallback } from 'react';

export function useCamera() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment', // Use the back camera on mobile devices
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        });
        
        setStream(mediaStream);
        setError(null);
      } else {
        setError('Camera not supported on this device.');
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError(
        err instanceof Error 
          ? err.message 
          : 'Failed to access camera. Please grant camera permissions.'
      );
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop();
      });
      setStream(null);
    }
  }, [stream]);

  return {
    stream,
    error,
    startCamera,
    stopCamera
  };
}
