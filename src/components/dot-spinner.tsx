export function Spinner() {
  return (
    <div className="flex items-center justify-center">
      <div className="relative w-6 h-6 animate-spin">
        <span className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-orange-500 rounded-full"></span>
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-orange-500 rounded-full"></span>
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 border-2 border-orange-500 rounded-full"></span>
        <span className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-2 border-orange-500 rounded-full"></span>
      </div>
    </div>
  );
}
