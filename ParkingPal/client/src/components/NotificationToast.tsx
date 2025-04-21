import { Bell, X } from "lucide-react";

interface NotificationToastProps {
  show: boolean;
  title: string;
  message: string;
  onDismiss: () => void;
}

export default function NotificationToast({
  show,
  title,
  message,
  onDismiss,
}: NotificationToastProps) {
  return (
    <div 
      className={`fixed top-4 left-0 right-0 mx-auto w-5/6 max-w-sm bg-white rounded-lg shadow-lg p-4 flex items-center z-50 transition-all duration-300 ${
        show ? 'transform translate-y-0 opacity-100' : 'transform -translate-y-20 opacity-0 pointer-events-none'
      }`}
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
        <Bell className="h-5 w-5 text-primary" />
      </div>
      <div className="flex-1">
        <h4 className="font-medium text-gray-900">{title}</h4>
        <p className="text-sm text-gray-500">{message}</p>
      </div>
      <button 
        onClick={onDismiss}
        className="ml-2 text-gray-400 hover:text-gray-500"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}
