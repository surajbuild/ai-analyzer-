import { useMemo, useState } from "react";

interface Item {
  label: string;
  status: "ok" | "warn" | "bad";
}

interface Props {
  checklist: Item[];
}

const statusConfig = {
  ok: { icon: "✓", className: "bg-green-50 text-green-700 border-green-100" },
  warn: { icon: "⚠", className: "bg-yellow-50 text-yellow-700 border-yellow-100" },
  bad: { icon: "✕", className: "bg-red-50 text-red-700 border-red-100" },
};

type Filter = "all" | "ok" | "warn" | "bad";

export default function SeoChecklist({ checklist }: Props) {
  const [filter, setFilter] = useState<Filter>("all");

  const counts = useMemo(() => {
    return checklist.reduce(
      (acc, item) => {
        acc[item.status]++;
        acc.all++;
        return acc;
      },
      { all: 0, ok: 0, warn: 0, bad: 0 } as Record<Filter, number>,
    );
  }, [checklist]);

  const visible = useMemo(
    () => (filter === "all" ? checklist : checklist.filter((c) => c.status === filter)),
    [filter, checklist],
  );

  const filters: { key: Filter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "ok", label: "Pass" },
    { key: "warn", label: "Warn" },
    { key: "bad", label: "Fail" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide">SEO Checklist</p>
        <div className="flex gap-1">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`text-xs px-2 py-1 rounded-full border transition-colors ${
                filter === f.key
                  ? "bg-zinc-800 text-white border-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100"
                  : "bg-transparent text-zinc-500 border-zinc-200 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
              }`}
            >
              {f.label} <span className="opacity-60">{counts[f.key]}</span>
            </button>
          ))}
        </div>
      </div>
      {visible.length === 0 ? (
        <p className="text-sm text-zinc-500">No items match this filter.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {visible.map((item) => {
            const { icon, className } = statusConfig[item.status];
            return (
              <span
                key={item.label}
                className={`text-xs font-medium px-3 py-1 rounded-full border ${className}`}
              >
                {icon} {item.label}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}