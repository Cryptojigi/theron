// Animated shimmer skeleton — used while data is loading
// (replaces the old "..." placeholder look)
export default function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-shimmer rounded-md ${className}`} />;
}
