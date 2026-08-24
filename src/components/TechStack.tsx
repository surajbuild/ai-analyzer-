import { useMemo, useState } from "react";
import { Search } from "lucide-react";

interface Props {
  stack: string[];
}

export default function TechStack({ stack }: Props) {
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return stack;
    return stack.filter((t) => t.toLowerCase().includes(q));
  }, [query, stack]);

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-3">
        <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide">Tech Stack</p>
        <div className="relative w-40">
          <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter..."
            className="w-full text-xs pl-7 pr-2 py-1 rounded-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-300 dark:focus:ring-zinc-600"
          />
        </div>
      </div>
      {visible.length === 0 ? (
        <p className="text-sm text-zinc-500">No technologies match.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {visible.map((tech) => (
            <span
              key={tech}
              className="bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full border border-blue-100 transition-transform hover:scale-105"
            >
              {tech}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}