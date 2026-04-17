export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[linear-gradient(180deg,#FFFFFF_0%,#F9FAFB_100%)]">
      <div className="flex flex-col items-center">
        <div className="relative">
          {/* Outer ring */}
          <div className="w-16 h-16 border-4 border-[#D2B48C]/30 rounded-full" />
          {/* Spinning inner ring */}
          <div className="w-16 h-16 border-4 border-transparent border-t-[#FF8C00] rounded-full absolute top-0 left-0 animate-spin" />
        </div>
        <p className="mt-4 font-semibold text-[#3E2723]">Loading...</p>
      </div>
    </div>
  );
}
