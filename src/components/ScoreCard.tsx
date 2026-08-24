import { useEffect, useRef, useState } from "react";
import type { AnalysisResult } from "@/utils/analyzeUrl";

interface Props {
  result: AnalysisResult;
}

function scoreColor(n: number) {
  if (n >= 75) return "text-green-600";
  if (n >= 50) return "text-yellow-600";
  return "text-red-600";
}

function scoreBg(n: number) {
  if (n >= 75) return "bg-green-50 border-green-100";
  if (n >= 50) return "bg-yellow-50 border-yellow-100";
  return "bg-red-50 border-red-100";
}

const scores = [
  { key: "performance", label: "Performance" },
  { key: "seo", label: "SEO" },
  { key: "accessibility", label: "Accessibility" },
  { key: "best_practices", label: "Best Practices" },
] as const;

function useCountUp(target: number, duration = 800) {
  const [value, setValue] = useState(0);
  const startRef = useRef<number | null>(null);
  const fromRef = useRef(0);

  useEffect(() => {
    fromRef.current = 0;
    startRef.current = null;
    let raf = 0;
    const tick = (t: number) => {
      if (startRef.current === null) startRef.current = t;
      const elapsed = t - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(fromRef.current + (target - fromRef.current) * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return value;
}

function ScoreCell({ label, value }: { label: string; value: number }) {
  const animated = useCountUp(value);
  return (
    <div className={`rounded-xl border p-4 transition-colors ${scoreBg(value)}`}>
      <p className="text-xs text-zinc-500 mb-1">{label}</p>
      <p className={`text-3xl font-semibold ${scoreColor(value)}`}>{animated}</p>
    </div>
  );
}

export default function ScoreCards({ result }: Props) {
  return (
    <div>
      <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide mb-3">Scores</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {scores.map(({ key, label }) => (
          <ScoreCell key={key} label={label} value={result[key]} />
        ))}
      </div>
    </div>
  );
}