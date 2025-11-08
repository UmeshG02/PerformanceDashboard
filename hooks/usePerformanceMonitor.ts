"use client";
import { useEffect, useState } from "react";

export function usePerformanceMonitor() {
  const [metrics, setMetrics] = useState({ fps: 0, frameTime: 0, heapMB: 0 });

  useEffect(() => {
    let last = performance.now();
    let frames = 0;
    let lastUpdate = last;
    let raf = 0;
    const loop = () => {
      const now = performance.now();
      frames++;
      if (now - lastUpdate >= 500) {
        const fps = (frames * 1000) / (now - lastUpdate);
        const frameTime = (now - last) / Math.max(1, frames);
        const mem = (performance as any).memory?.usedJSHeapSize / 1048576 || 0;
        setMetrics({ fps, frameTime, heapMB: mem });
        lastUpdate = now;
        frames = 0;
      }
      last = now;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return metrics;
}
