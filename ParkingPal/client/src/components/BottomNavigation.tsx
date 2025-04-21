import { Link, useLocation } from "wouter";
import { Camera, Clock, User } from "lucide-react";

export default function BottomNavigation() {
  const [location] = useLocation();
  
  const isActive = (path: string): boolean => {
    return location === path;
  };

  return (
    <nav className="bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 z-10">
      <div className="grid grid-cols-3 h-16">
        <Link href="/">
          <div className={`flex flex-col items-center justify-center cursor-pointer ${isActive('/') ? 'text-primary' : 'text-gray-500'}`}>
            <Camera className="h-5 w-5" />
            <span className="text-xs mt-1">Scan</span>
          </div>
        </Link>
        <Link href="/history">
          <div className={`flex flex-col items-center justify-center cursor-pointer ${isActive('/history') ? 'text-primary' : 'text-gray-500'}`}>
            <Clock className="h-5 w-5" />
            <span className="text-xs mt-1">History</span>
          </div>
        </Link>
        <Link href="/profile">
          <div className={`flex flex-col items-center justify-center cursor-pointer ${isActive('/profile') ? 'text-primary' : 'text-gray-500'}`}>
            <User className="h-5 w-5" />
            <span className="text-xs mt-1">Profile</span>
          </div>
        </Link>
      </div>
    </nav>
  );
}
