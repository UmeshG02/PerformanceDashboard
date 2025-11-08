"use client";
import { useEffect, useState } from "react";
import { usePerformanceMonitor } from "@/hooks/usePerformanceMonitor";

interface Props { streamActive?: boolean; onToggleStream?: () => void; }
export default function PerformanceMonitor({ streamActive, onToggleStream }: Props) {
  const metrics = usePerformanceMonitor();
  const [fps, setFps] = useState(0);
  useEffect(() => { if (!metrics?.fps) return; setFps(Number(metrics.fps.toFixed(1))); }, [metrics]);

  return (
    <div className="flex flex-wrap gap-2 text-sm text-neutral-200 justify-end items-center">
      <div className={`flex items-center gap-2 px-2 py-1 rounded-md border ${streamActive ? 'border-green-500 text-green-400' : 'border-red-500 text-red-400'}`}>
        <span className={`w-2.5 h-2.5 rounded-full ${streamActive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
        <span className="font-medium w-20 text-center">{streamActive ? 'Stream ON' : 'Stream OFF'}</span>
        <button onClick={onToggleStream} className={`ml-2 px-2 py-0.5 rounded-md border text-xs font-medium ${streamActive ? 'border-yellow-500 text-yellow-400' : 'border-blue-500 text-blue-400'}`}>{streamActive ? 'Pause' : 'Resume'}</button>
      </div>

      <div className="px-2 py-1 rounded-md border border-neutral-700 bg-neutral-900">FPS: <span className="font-semibold">{fps}</span></div>
      <div className="px-2 py-1 rounded-md border border-neutral-700 bg-neutral-900">Frame: {metrics?.frameTime?.toFixed(2)} ms</div>
      <div className="px-2 py-1 rounded-md border border-neutral-700 bg-neutral-900">Heap: {metrics?.heapMB?.toFixed(2)} MB</div>
    </div>
  );
}
