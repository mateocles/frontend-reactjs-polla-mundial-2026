// Skeleton de carga reutilizable para listas (partidos, grupos…).
export function SkeletonCard() {
  return (
    <div className="glass-card rounded-xl p-4 mb-3 animate-pulse">
      <div className="flex justify-between items-center mb-4">
        <div className="h-3 w-24 rounded bg-surface-container-highest" />
        <div className="h-3 w-12 rounded bg-surface-container-highest" />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex-1 flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-surface-container-highest" />
          <div className="h-2 w-12 rounded bg-surface-container-highest" />
        </div>
        <div className="h-6 w-10 rounded bg-surface-container-highest" />
        <div className="flex-1 flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-surface-container-highest" />
          <div className="h-2 w-12 rounded bg-surface-container-highest" />
        </div>
      </div>
    </div>
  );
}

export default function Loader({ count = 4 }) {
  return (
    <div className="mt-4" aria-busy="true">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
