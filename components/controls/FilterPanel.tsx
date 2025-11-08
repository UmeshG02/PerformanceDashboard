"use client";
import { useMemo, useState, useTransition } from "react";
import type { Aggregation } from "@/lib/types";

export default function FilterPanel({ onAggregation, onCategoryToggle }: { onAggregation: (agg: Aggregation) => void; onCategoryToggle: (cat: string, on: boolean) => void; }) {
  const [agg, setAgg] = useState<Aggregation>("raw");
  const [pending, startTransition] = useTransition();
  const cats = useMemo(() => ["A", "B", "C"], []);

  return (
    <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
      <div className="flex items-center gap-2">
        <label className="text-sm opacity-80">Aggregation</label>
        <select className="bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-sm" value={agg} onChange={(e) => startTransition(() => { const v = e.target.value as Aggregation; setAgg(v); onAggregation(v); })}>
          <option value="raw">raw</option>
          <option value="1m">1 min</option>
          <option value="5m">5 min</option>
          <option value="1h">1 hour</option>
        </select>
        {pending && <span className="text-xs opacity-60 ml-2">aggregating…</span>}
      </div>
      <div className="flex items-center gap-2">
        {cats.map(c => (
          <label key={c} className="inline-flex items-center gap-1 text-sm">
            <input type="checkbox" defaultChecked onChange={(e) => onCategoryToggle(c, e.target.checked)} />
            {c}
          </label>
        ))}
      </div>
    </div>
  );
}
