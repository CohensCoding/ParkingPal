export default function LoadingState() {
  return (
    <div className="absolute inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-20">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
      <p className="text-white mt-6 text-lg font-medium">Analyzing parking sign...</p>
      <p className="text-gray-400 mt-2 text-sm">This may take a moment</p>
    </div>
  );
}
