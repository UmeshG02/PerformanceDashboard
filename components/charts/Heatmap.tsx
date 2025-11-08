"use client";
import { useEffect, useRef } from "react";
import type { DataPoint } from "@/lib/types";
import { computeYRange, clearCanvas, drawAxes } from "@/lib/canvasUtils";

export default function Heatmap({ data }: { data: DataPoint[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return; const ctx = canvas.getContext('2d'); if (!ctx) return;
    const dpr = Math.max(1, window.devicePixelRatio || 1); const width = canvas.clientWidth * dpr; const height = canvas.clientHeight * dpr; canvas.width = width; canvas.height = height;
    const { yMin, yMax } = computeYRange(data); const xMin = Math.min(...data.map(d=>d.timestamp)); const xMax = Math.max(...data.map(d=>d.timestamp));
    clearCanvas(ctx, width, height); drawAxes(ctx, width, height);
    const cols = 80; const rows = 40; const cellW = (width - 60) / cols; const cellH = (height - 30) / rows;
    const grid = Array.from({ length: rows }, () => Array(cols).fill(0));
    for (const p of data) { const xIdx = Math.floor(((p.timestamp - xMin)/(xMax - xMin))*(cols-1)); const yIdx = Math.floor(((p.value - yMin)/(yMax - yMin))*(rows-1)); grid[rows-1 - Math.max(0, Math.min(rows-1, yIdx))][Math.max(0, Math.min(cols-1, xIdx))] += 1; }
    const maxCount = Math.max(...grid.flat()); ctx.save(); ctx.translate(40,0);
    for (let r=0;r<rows;r++){ for (let c=0;c<cols;c++){ const count = grid[r][c]; if (!count) continue; const alpha = Math.min(1, count / maxCount); ctx.fillStyle = `rgba(99,102,241,${alpha})`; ctx.fillRect(c*cellW, r*cellH, cellW, cellH); } }
    ctx.restore();
  }, [data]);
  return <canvas ref={canvasRef} className="w-full h-64 rounded-xl bg-neutral-950 border border-neutral-800" />;
}
