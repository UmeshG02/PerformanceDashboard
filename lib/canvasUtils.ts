import type { DataPoint } from "./types";

export function clearCanvas(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#060606";
  ctx.fillRect(0, 0, w, h);
}

export function computeYRange(data: DataPoint[]) {
  if (!data || !data.length) return { yMin: 0, yMax: 100 };
  let min = Infinity; let max = -Infinity;
  for (const p of data) { min = Math.min(min, p.value); max = Math.max(max, p.value); }
  return { yMin: min, yMax: max };
}

export function lodSample(data: DataPoint[], limit = 2000) {
  if (!data.length) return [];
  if (data.length <= limit) return data;
  const step = Math.ceil(data.length / limit);
  const out: DataPoint[] = [];
  for (let i = 0; i < data.length; i += step) out.push(data[i]);
  return out;
}

export function worldToScreenX(ts: number, width: number, view: any) {
  const t = (ts - view.xMin) / (view.xMax - view.xMin);
  return t * width;
}
export function worldToScreenY(v: number, height: number, view: any) {
  const t = (v - view.yMin) / (view.yMax - view.yMin);
  return height - t * height;
}

export function drawAxes(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.save();
  ctx.strokeStyle = '#222';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(40, height - 20);
  ctx.lineTo(width - 10, height - 20);
  ctx.moveTo(40, 10);
  ctx.lineTo(40, height - 20);
  ctx.stroke();
  ctx.restore();
}
