export default function NoteSkeleton() {
  return (
    <div className="p-4 rounded-lg border-2 border-gray-200 bg-gray-50 animate-pulse">
      <div className="flex justify-between items-start mb-2">
        <div className="h-4 w-20 bg-gray-300 rounded"></div>
        <div className="h-3 w-32 bg-gray-300 rounded"></div>
      </div>
      <div className="space-y-2">
        <div className="h-3 w-full bg-gray-300 rounded"></div>
        <div className="h-3 w-5/6 bg-gray-300 rounded"></div>
        <div className="h-3 w-4/6 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
}
