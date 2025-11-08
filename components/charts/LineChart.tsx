"use client";
import { useMemo, useState, useEffect } from "react";
import { useChartRenderer } from "@/hooks/useChartRenderer";
import BaseCanvas from "./BaseCanvas";
import type { DataPoint } from "@/lib/types";

const COLORS: Record<string, string> = { A: "#60a5fa", B: "#34d399", C: "#f87171" };

export default function LineChart({ data }: { data: DataPoint[] }) {
  const [enabledCats, setEnabledCats] = useState<Record<string, boolean>>({ A: true, B: true, C: true });
  const filtered = useMemo(() => data.filter(d => enabledCats[d.category] !== false), [data, enabledCats]);
  const { canvasRef, draw, attachInteractions } = useChartRenderer(filtered as DataPoint[]);

  useEffect(() => { draw(); }, [filtered, draw]);
  useEffect(() => { const detach = attachInteractions(); return () => detach && detach(); }, [attachInteractions]);

  return (
    <div>
      <BaseCanvas canvasRef={canvasRef} draw={draw} attachInteractions={attachInteractions} />
      <div className="flex gap-3 text-xs justify-center opacity-80 mt-2">
        {Object.keys(COLORS).map(cat => (
          <label key={cat} className="flex items-center gap-1 cursor-pointer">
            <input type="checkbox" checked={enabledCats[cat]} onChange={() => setEnabledCats(prev => ({ ...prev, [cat]: !prev[cat] }))} />
            <span style={{ color: COLORS[cat] }}>{cat}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
