"use client";
import { useVirtualization } from "@/hooks/useVirtualization";
import type { DataPoint } from "@/lib/types";


export default function DataTable({ rows }: { rows: DataPoint[] }) {
const { visible, onScroll, padTop, padBottom, total, rowHeight, viewportHeight } = useVirtualization(rows, 28, 240);
return (
<div className="border border-neutral-800 rounded-xl overflow-hidden">
<div className="px-3 py-2 text-sm bg-neutral-900 border-b border-neutral-800 flex justify-between">
<span>Rows: {total.toLocaleString()}</span>
<span>Virtualized</span>
</div>
<div className="h-[240px] overflow-auto" onScroll={onScroll}>
<div style={{ paddingTop: padTop, paddingBottom: padBottom }}>
<table className="w-full text-xs">
<thead className="sticky top-0 bg-neutral-950">
<tr className="text-left">
<th className="px-3 py-2">Timestamp</th>
<th className="px-3 py-2">Value</th>
<th className="px-3 py-2">Category</th>
</tr>
</thead>
<tbody>
{visible.map((r, i) => (
<tr key={`${r.timestamp}-${i}`} className="odd:bg-neutral-900/30">
<td className="px-3 py-1">{new Date(r.timestamp).toLocaleTimeString()}</td>
<td className="px-3 py-1">{r.value.toFixed(3)}</td>
<td className="px-3 py-1">{r.category}</td>
</tr>
))}
</tbody>
</table>
</div>
</div>
</div>
);
}