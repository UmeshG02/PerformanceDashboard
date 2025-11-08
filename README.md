# Performance Dashboard (Next.js 14 + TS)


A real-time data visualization dashboard that maintains ~60fps with 10k+ points using a Canvas + SVG-ready architecture, React concurrency, and Web Workers. No chart libraries.


## ▶️ Quick Start


```bash
pnpm i # or npm install / yarn
pnpm dev # or npm run dev / yarn dev
```


Open http://localhost:3000 and click **Go to Dashboard**.


## 🧱 Tech Highlights
- Next.js 14 App Router (Server comp for initial data, Client for interactivity)
- Canvas rendering with requestAnimationFrame and devicePixelRatio scaling
- Web Worker for streaming data + background aggregations
- React 18 concurrency (useTransition) to avoid blocking
- Virtualized table (simple custom implementation)
- FPS + memory HUD


## 🧪 Performance Testing
- Toggle aggregation levels and time range; watch FPS remain stable
- Increase load by letting it run (sliding window caps at 100k points)
- Use Chrome Performance Profiler to verify ~1.0–2.5ms draw time on modern hardware


## 📦 Production Build
```bash
pnpm build && pnpm start
```


## 🌐 Browser Support
Modern Chromium, Firefox, Safari. Memory HUD needs `performance.memory` (Chromium).


## ⚙️ Next.js Optimizations
- Route Handler on Edge runtime for snappy bootstrap
- Server component loads initial snapshot; client streams afterward
- Minimal client bundle: no chart libs
- Tailwind JIT for styles


## 🧭 Structure
See repository tree in this document.
