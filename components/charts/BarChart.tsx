"use client";
import { useEffect, useRef } from "react";
import type { DataPoint } from "@/lib/types";
import { computeYRange, clearCanvas, drawAxes, worldToScreenX, worldToScreenY, lodSample } from "@/lib/canvasUtils";

export default function BarChart({ data }: { data: DataPoint[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return; const ctx = canvas.getContext('2d'); if (!ctx) return;
    const dpr = Math.max(1, window.devicePixelRatio || 1); const width = canvas.clientWidth * dpr; const height = canvas.clientHeight * dpr; canvas.width = width; canvas.height = height;
    const view = { xMin: Math.min(...data.map(d=>d.timestamp)), xMax: Math.max(...data.map(d=>d.timestamp)), ...computeYRange(data) };
    clearCanvas(ctx, width, height); drawAxes(ctx, width, height);
    const sampled = lodSample(data, 200);
    const barWidth = (width - 60) / Math.max(1, sampled.length);
    ctx.save(); ctx.translate(40, 0); ctx.fillStyle = '#22d3ee';
    for (let i=0;i<sampled.length;i++){ const p = sampled[i]; const x = worldToScreenX(p.timestamp, width-60, view); const y = worldToScreenY(p.value, height-20, view); const barHeight = height - 20 - y; ctx.fillRect(x, y, Math.max(2, barWidth*0.8), barHeight); }
    ctx.restore();
  }, [data]);
  return <canvas ref={canvasRef} className="w-full h-64 rounded-xl bg-neutral-950 border border-neutral-800" />;
}
