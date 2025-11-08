// =====================================================
// ✅ Web Worker: Generates real-time streaming data + aggregation
// =====================================================

let timerId = null;
let lastTs = Date.now();
let value = 50;

// Helper: emit batches of simulated data points
function batchEmit() {
  const out = [];
  for (let i = 0; i < 10; i++) {
    lastTs += 100; // 100ms increments (simulated)
    value += (Math.random() - 0.5) * 2 + Math.sin(lastTs / 1500) * 0.2;

    out.push({
      timestamp: lastTs,
      value: Number(value.toFixed(3)),
      category: i % 3 === 0 ? "A" : i % 3 === 1 ? "B" : "C",
    });
  }

  // Send new data points to main thread
  postMessage({ type: "batch", points: out });
}

// =====================================================
// Message handler (receives commands from main thread)
// =====================================================
onmessage = (e) => {
  const { type, interval, points, bucketMs } = e.data || {};

  switch (type) {
    // Start streaming
    case "start": {
      if (!timerId) {
        const emitInterval = interval ?? 100;
        timerId = setInterval(batchEmit, emitInterval);
      }
      break;
    }

    // Stop streaming
    case "stop": {
      if (timerId) {
        clearInterval(timerId);
        timerId = null;
      }
      break;
    }

    // Aggregate data into buckets (for 1m, 5m, 1h)
    case "aggregate": {
      if (!Array.isArray(points) || !bucketMs) return;

      const buckets = new Map();

      for (const p of points) {
        const key = Math.floor(p.timestamp / bucketMs) * bucketMs;
        const b =
          buckets.get(key) || {
            timestamp: key,
            count: 0,
            sum: 0,
            min: Infinity,
            max: -Infinity,
          };

        b.count++;
        b.sum += p.value;
        b.min = Math.min(b.min, p.value);
        b.max = Math.max(b.max, p.value);
        buckets.set(key, b);
      }

      const aggregated = [...buckets.values()].map((b) => ({
        timestamp: b.timestamp,
        value: b.sum / b.count,
        min: b.min,
        max: b.max,
        count: b.count,
      }));

      postMessage({ type: "aggregated", bucketMs, points: aggregated });
      break;
    }

    default:
      console.warn("Unknown worker message type:", type);
  }
};
