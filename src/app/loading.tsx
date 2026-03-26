export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <div className="flex flex-col items-center">
        <div className="relative">
          {/* Outer ring */}
          <div className="w-16 h-16 border-4 border-primary-200 rounded-full" />
          {/* Spinning inner ring */}
          <div className="w-16 h-16 border-4 border-transparent border-t-primary-500 rounded-full absolute top-0 left-0 animate-spin" />
        </div>
        <p className="mt-4 text-primary-500 font-semibold">Loading...</p>
      </div>
    </div>
  );
}
