"use client";

import { useEffect, useState } from "react";
import { useData } from "@/components/providers/DataProvider";
import PerformanceMonitor from "@/components/ui/PerformanceMonitor";
import PerformanceTrend from "@/components/ui/PerformanceTrend";
import FilterPanel from "@/components/controls/FilterPanel";
import TimeRangeSelector from "@/components/controls/TimeRangeSelector";
import DataTable from "@/components/ui/DataTable";
import LineChart from "@/components/charts/LineChart";
import BarChart from "@/components/charts/BarChart";
import ScatterPlot from "@/components/charts/ScatterPlot";
import Heatmap from "@/components/charts/Heatmap";
import type { Aggregation } from "@/lib/types";

export default function Dashboard() {
  const { points, workerRef, aggregate } = useData();
  const [rangeMs, setRangeMs] = useState(60000);
  const [streamActive, setStreamActive] = useState(true);
  const [display, setDisplay] = useState(points);
  const [aggregation, setAggregation] = useState<Aggregation>("raw");
  const [categoryOn, setCategoryOn] = useState<Record<string, boolean>>({ A: true, B: true, C: true });

  const handleToggleStream = () => {
    if (!workerRef?.current) return;
    if (streamActive) { workerRef.current.postMessage({ type: 'stop' }); setStreamActive(false); }
    else { workerRef.current.postMessage({ type: 'start', interval: 100 }); setStreamActive(true); }
  };

  const handleAggregation = (agg: Aggregation) => { setAggregation(agg); aggregate(agg); };

  useEffect(() => {
    if (!points?.length) return;
    const now = Date.now();
    const filtered = points.filter(p => p.timestamp >= now - rangeMs && categoryOn[p.category as keyof typeof categoryOn]);
    setDisplay(filtered);
  }, [points, rangeMs, categoryOn]);

  return (
    <div className="flex flex-col gap-4 p-4 min-h-screen overflow-y-auto">
      <div className="flex flex-wrap justify-between items-center sticky top-0 z-20 bg-neutral-950/80 backdrop-blur-md rounded-lg p-3 border-b border-neutral-800">
        <div className="flex gap-3 md:grid-cols-3">
          <FilterPanel onAggregation={handleAggregation} onCategoryToggle={(cat, on) => setCategoryOn(prev => ({ ...prev, [cat]: on }))} />
          <TimeRangeSelector onRange={setRangeMs} />
        </div>
        <PerformanceMonitor streamActive={streamActive} onToggleStream={handleToggleStream} />
      </div>

      <PerformanceTrend />

      <div className="grid gap-4 md:grid-cols-2">
        <div><h3 className="mb-2 text-sm opacity-80">Line</h3><LineChart data={display} /></div>
        <div><h3 className="mb-2 text-sm opacity-80">Bar</h3><BarChart data={display} /></div>
        <div><h3 className="mb-2 text-sm opacity-80">Scatter</h3><ScatterPlot data={display} /></div>
        <div><h3 className="mb-2 text-sm opacity-80">Heatmap</h3><Heatmap data={display} /></div>
      </div>

      <DataTable rows={display} />
    </div>
  );
}
