"use client";
import { useEffect, useRef } from "react";
import type { DataPoint } from "@/lib/types";
import { computeYRange, clearCanvas, drawAxes, worldToScreenX, worldToScreenY, lodSample } from "@/lib/canvasUtils";

export default function ScatterPlot({ data }: { data: DataPoint[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return; const ctx = canvas.getContext('2d'); if (!ctx) return;
    const dpr = Math.max(1, window.devicePixelRatio || 1); const width = canvas.clientWidth * dpr; const height = canvas.clientHeight * dpr; canvas.width = width; canvas.height = height;
    const view = { xMin: Math.min(...data.map(d=>d.timestamp)), xMax: Math.max(...data.map(d=>d.timestamp)), ...computeYRange(data) };
    clearCanvas(ctx, width, height); drawAxes(ctx, width, height);
    const sampled = lodSample(data, 2000);
    const colors: Record<string,string> = { A: '#60a5fa', B: '#fbbf24', C: '#f43f5e' };
    ctx.save(); ctx.translate(40,0);
    for (const p of sampled) { const x = worldToScreenX(p.timestamp, width-50, view); const y = worldToScreenY(p.value, height-20, view); ctx.beginPath(); ctx.arc(x,y,2,0,Math.PI*2); ctx.fillStyle = colors[p.category] ?? '#999'; ctx.fill(); }
    ctx.restore();
  }, [data]);
  return <canvas ref={canvasRef} className="w-full h-64 rounded-xl bg-neutral-950 border border-neutral-800" />;
}
