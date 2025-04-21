import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Edit } from "lucide-react";

interface ErrorViewProps {
  onRetry: () => void;
  onManualEntry: () => void;
}

export default function ErrorView({ onRetry, onManualEntry }: ErrorViewProps) {
  return (
    <div className="h-full bg-gray-100 flex flex-col items-center justify-center p-6">
      <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-4">
        <AlertTriangle className="h-10 w-10 text-red-500" />
      </div>
      <h2 className="text-xl font-semibold mb-2">Unable to Analyze Sign</h2>
      <p className="text-gray-500 text-center mb-6">
        We couldn't clearly interpret the parking sign. Please try again with better lighting and a clearer view.
      </p>
      <div className="space-y-3 w-full max-w-xs">
        <Button
          onClick={onRetry}
          className="w-full py-6 bg-primary text-white rounded-lg shadow-md font-medium flex items-center justify-center"
        >
          <RefreshCw className="mr-2 h-5 w-5" />
          Try Again
        </Button>
        <Button
          onClick={onManualEntry}
          variant="outline"
          className="w-full py-6 border border-gray-300 bg-white text-gray-700 rounded-lg shadow-sm font-medium flex items-center justify-center"
        >
          <Edit className="mr-2 h-5 w-5" />
          Manual Entry
        </Button>
      </div>
    </div>
  );
}
