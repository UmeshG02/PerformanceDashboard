"use client";
import { createContext, useContext, useRef, useState, useEffect, useTransition } from "react";
import type { DataPoint } from "@/lib/types";

interface DataContextType { points: DataPoint[]; workerRef: React.MutableRefObject<Worker | null>; aggregate: (agg: string) => void }
const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children, initialData }: { children: React.ReactNode; initialData?: DataPoint[] }) {
  const [points, setPoints] = useState<DataPoint[]>(initialData || []);
  const workerRef = useRef<Worker | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const worker = new Worker('/workers/dataWorker.js');
    workerRef.current = worker;
    worker.onmessage = (e: MessageEvent) => {
      const { type, points: newPoints, bucketMs } = e.data || {};
      if (type === 'batch') {
        const batch: DataPoint[] = newPoints;
        startTransition(() => setPoints(prev => { const merged = prev.concat(batch); return merged.length > 10000 ? merged.slice(merged.length - 10000) : merged; }));
      }
      if (type === 'aggregated') {
        startTransition(() => setPoints(newPoints));
      }
    };
    worker.postMessage({ type: 'start', interval: 100 });
    return () => { worker.postMessage({ type: 'stop' }); worker.terminate(); workerRef.current = null; };
  }, []);

  const aggregate = (agg: string) => {
    if (!workerRef.current) return;
    const bucketMs = agg === '1m' ? 60000 : agg === '5m' ? 300000 : agg === '1h' ? 3600000 : 0;
    if (bucketMs === 0) { workerRef.current.postMessage({ type: 'start', interval: 100 }); return; }
    workerRef.current.postMessage({ type: 'stop' });
    workerRef.current.postMessage({ type: 'aggregate', points, bucketMs });
  };

  return (
    <DataContext.Provider value={{ points, workerRef, aggregate }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() { const ctx = useContext(DataContext); if (!ctx) throw new Error('useData must be used within DataProvider'); return ctx; }
