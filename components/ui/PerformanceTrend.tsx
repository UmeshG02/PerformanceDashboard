"use client";
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { usePerformanceMonitor } from "@/hooks/usePerformanceMonitor";

export default function PerformanceTrend() {
  const { fps, heapMB } = usePerformanceMonitor();
  const [data, setData] = useState<{ time: string; fps: number; heap: number }[]>([]);
  const maxPoints = 30;
  useEffect(() => {
    const id = setInterval(() => {
      const label = new Date().toLocaleTimeString('en-US', { minute: '2-digit', second: '2-digit' });
      setData(prev => { const next = [...prev, { time: label, fps, heap: heapMB }]; return next.length > maxPoints ? next.slice(next.length - maxPoints) : next; });
    }, 1000);
    return () => clearInterval(id);
  }, [fps, heapMB]);

  return (
    <div className="mt-2 p-3 bg-neutral-900 border border-neutral-700 rounded-xl shadow-inner">
      <h4 className="text-sm text-neutral-300 mb-2 font-semibold">Performance Trend (last 30s)</h4>
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={data}>
          <XAxis dataKey="time" stroke="#aaa" fontSize={11} />
          <YAxis yAxisId="left" domain={[0, 'auto']} stroke="#60a5fa" />
          <YAxis yAxisId="right" orientation="right" stroke="#fbbf24" />
          <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Line yAxisId="left" type="monotone" dataKey="fps" stroke="#60a5fa" strokeWidth={2} dot={false} isAnimationActive={false} name="FPS" />
          <Line yAxisId="right" type="monotone" dataKey="heap" stroke="#fbbf24" strokeWidth={2} dot={false} isAnimationActive={false} name="Heap (MB)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
