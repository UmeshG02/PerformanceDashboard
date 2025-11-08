"use client";
export default function TimeRangeSelector({ onRange }: { onRange: (ms: number) => void; }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm opacity-70">Range:</span>
      <button className="px-2 py-1 text-xs border border-neutral-700 rounded" onClick={() => onRange(60_000)}>1m</button>
      <button className="px-2 py-1 text-xs border border-neutral-700 rounded" onClick={() => onRange(5 * 60_000)}>5m</button>
      <button className="px-2 py-1 text-xs border border-neutral-700 rounded" onClick={() => onRange(60 * 60_000)}>1h</button>
    </div>
  );
}
