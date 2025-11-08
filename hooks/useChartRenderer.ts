"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { DataPoint } from "@/lib/types";
import { computeYRange, drawAxes, lodSample, worldToScreenX, worldToScreenY, clearCanvas } from "@/lib/canvasUtils";

interface View { xMin: number; xMax: number; yMin: number; yMax: number }

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

export function useChartRenderer(data: DataPoint[]) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [view, setView] = useState<View>({ xMin: Date.now() - 60000, xMax: Date.now(), yMin: 0, yMax: 100 });
  const prevRef = useRef<DataPoint[]>([]);
  const animRef = useRef<number | null>(null);

  const drawFrame = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
    clearCanvas(ctx, w, h);
    drawAxes(ctx, w, h);

    const sampled = lodSample(data, 2000);
    const prev = prevRef.current;

    ctx.save(); ctx.translate(40, 0); ctx.beginPath();
    for (let i = 0; i < sampled.length; i++) {
      const p = sampled[i];
      const px = worldToScreenX(p.timestamp, w - 60, view);
      const old = prev[i];
      const oldV = old ? old.value : p.value;
      const interp = lerp(oldV, p.value, t);
      const py = worldToScreenY(interp, h - 20, view);
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#60a5fa'; ctx.stroke(); ctx.restore();
  }, [data, view]);

  const draw = useCallback(() => {
    const el = canvasRef.current; if (!el) return;
    const ctx = el.getContext('2d'); if (!ctx) return;
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const w = el.clientWidth * dpr; const h = el.clientHeight * dpr;
    if (el.width !== w) el.width = w; if (el.height !== h) el.height = h;

    if (animRef.current) cancelAnimationFrame(animRef.current);
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / 400, 1);
      drawFrame(ctx, w, h, progress);
      if (progress < 1) animRef.current = requestAnimationFrame(step); else { prevRef.current = [...data]; animRef.current = null; }
    };
    animRef.current = requestAnimationFrame(step);
  }, [data, drawFrame]);

  const onWheel = useCallback((ev: WheelEvent) => {
    ev.preventDefault(); const scale = ev.deltaY < 0 ? 0.9 : 1.1;
    setView(v => { const cx = (v.xMin + v.xMax) / 2; const half = ((v.xMax - v.xMin) / 2) * scale; return {...v, xMin: cx - half, xMax: cx + half }; });
  }, []);

  const drag = useRef({ active: false, startX: 0, startRange: [0,0] as [number,number] });
  const attachInteractions = useCallback(() => {
    const el = canvasRef.current; if (!el) return () => {};
    const wheel = (e: WheelEvent) => onWheel(e);
    const mdown = (e: MouseEvent) => { drag.current = { active: true, startX: e.clientX, startRange: [view.xMin, view.xMax] }; };
    const mmove = (e: MouseEvent) => { if (!drag.current.active) return; const dx = e.clientX - drag.current.startX; const px = (view.xMax - view.xMin) / el.clientWidth; setView(v => ({ ...v, xMin: drag.current.startRange[0] - dx * px, xMax: drag.current.startRange[1] - dx * px })); };
    const mup = () => { drag.current.active = false; };
    el.addEventListener('wheel', wheel, { passive: false }); el.addEventListener('mousedown', mdown); window.addEventListener('mousemove', mmove); window.addEventListener('mouseup', mup);
    return () => { el.removeEventListener('wheel', wheel); el.removeEventListener('mousedown', mdown); window.removeEventListener('mousemove', mmove); window.removeEventListener('mouseup', mup); };
  }, [onWheel, view.xMin, view.xMax]);

  return { canvasRef, draw, attachInteractions, setView };
}
