import { useState, useEffect } from 'react';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  error: string | null;
  loading: boolean;
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    address: null,
    error: null,
    loading: true
  });

  const getAddress = async (latitude: number, longitude: number) => {
    try {
      // In a real app, you'd use a geocoding service like Google Maps API
      // For this MVP, we'll create a simple formatted string
      const addressString = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
      setState(prev => ({ ...prev, address: addressString }));
    } catch (error) {
      console.error('Error getting address:', error);
      setState(prev => ({ ...prev, error: 'Failed to get address' }));
    }
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: 'Geolocation is not supported by this browser.',
        loading: false
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setState(prev => ({
          ...prev,
          latitude,
          longitude,
          loading: false
        }));
        
        // Get the address from coordinates
        getAddress(latitude, longitude);
      },
      (error) => {
        console.error('Error getting location:', error);
        setState(prev => ({
          ...prev,
          error: 'Unable to retrieve your location. Please enable location services.',
          loading: false
        }));
      },
      { 
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000
      }
    );
  }, []);

  return state;
};