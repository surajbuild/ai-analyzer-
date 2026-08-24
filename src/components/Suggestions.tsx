import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Suggestion {
  title: string;
  body: string;
  priority: "high" | "med" | "low";
}

interface Props {
  suggestions: Suggestion[];
}

const priorityConfig = {
  high: "bg-red-50 text-red-700 border-red-100",
  med: "bg-yellow-50 text-yellow-700 border-yellow-100",
  low: "bg-green-50 text-green-700 border-green-100",
};

export default function Suggestions({ suggestions }: Props) {
  const [open, setOpen] = useState<Record<number, boolean>>({});
  const [filter, setFilter] = useState<"all" | "high" | "med" | "low">("all");

  const visible = suggestions
    .map((s, i) => ({ s, i }))
    .filter(({ s }) => filter === "all" || s.priority === filter);

  const filters: { key: typeof filter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "high", label: "High" },
    { key: "med", label: "Medium" },
    { key: "low", label: "Low" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide">AI Suggestions</p>
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
              {f.label}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        {visible.length === 0 && (
          <p className="text-sm text-zinc-500">No suggestions for this filter.</p>
        )}
        {visible.map(({ s, i }) => {
          const isOpen = !!open[i];
          return (
            <div
              key={`${s.title}-${i}`}
              className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpen((prev) => ({ ...prev, [i]: !prev[i] }))}
                className="w-full flex items-center justify-between gap-2 p-4 text-left hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <p className="text-sm font-medium text-zinc-800 dark:text-zinc-100 truncate">{s.title}</p>
                  <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full border font-medium ${priorityConfig[s.priority]}`}>
                    {s.priority}
                  </span>
                </div>
                {isOpen ? <ChevronUp size={16} className="text-zinc-400 shrink-0" /> : <ChevronDown size={16} className="text-zinc-400 shrink-0" />}
              </button>
              {isOpen && (
                <div className="px-4 pb-4 -mt-1">
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">{s.body}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}