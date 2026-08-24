import { useState } from "react";
import { analyzeUrl } from "@/utils/analyzeUrl";
import type { AnalysisResult } from "@/utils/analyzeUrl";
import UrlInput from "@/components/UrlInput";
import ScoreCards from "@/components/ScoreCard";
import TechStack from "@/components/TechStack";
import SeoChecklist from "@/components/SeoChecklist";
import Suggestions from "@/components/Suggestions";
import { useTheme } from "@/components/theme-provider";
import { Moon, Sun, Copy, Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

function ResultSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div>
        <div className="h-3 w-16 bg-zinc-200 dark:bg-zinc-700 rounded mb-3" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800" />
          ))}
        </div>
      </div>
      <div>
        <div className="h-3 w-20 bg-zinc-200 dark:bg-zinc-700 rounded mb-3" />
        <div className="flex gap-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="h-6 w-16 bg-blue-50 dark:bg-zinc-700 rounded-full" />
          ))}
        </div>
      </div>
      <div>
        <div className="h-3 w-24 bg-zinc-200 dark:bg-zinc-700 rounded mb-3" />
        <div className="flex gap-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-6 w-20 bg-zinc-100 dark:bg-zinc-700 rounded-full" />
          ))}
        </div>
      </div>
      <div>
        <div className="h-3 w-28 bg-zinc-200 dark:bg-zinc-700 rounded mb-3" />
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-16 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const { theme, setTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [analyzedUrl, setAnalyzedUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleAnalyze(url: string) {
    setLoading(true);
    setError(null);
    setResult(null);
    setAnalyzedUrl(url);
    try {
      const data = await analyzeUrl(url);
      setResult(data);
    } catch (e) {
      setError("Analysis failed. Check your API key or URL.");
    } finally {
      setLoading(false);
    }
  }

  async function copyUrl() {
    if (!analyzedUrl) return;
    try {
      await navigator.clipboard.writeText(analyzedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  }

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-900 py-10 px-4 transition-colors">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-100">🤖 AI Detective</h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Analyze any website instantly</p>
          </div>
          <Button variant="outline" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </Button>
        </div>

        <UrlInput onAnalyze={handleAnalyze} loading={loading} />

        {analyzedUrl && !loading && (
          <div className="flex items-center justify-between gap-2 px-1 -mt-4 text-xs text-zinc-500 dark:text-zinc-400">
            <a
              href={analyzedUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors truncate min-w-0"
            >
              <ExternalLink size={12} className="shrink-0" />
              <span className="truncate">{analyzedUrl}</span>
            </a>
            <button
              onClick={copyUrl}
              className="inline-flex items-center gap-1 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors shrink-0"
              aria-label="Copy URL"
            >
              {copied ? <Check size={12} className="text-green-600" /> : <Copy size={12} />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        )}

        {error && <p className="text-red-500 text-sm">{error}</p>}

        {loading && <ResultSkeleton />}

        {result && !loading && (
          <div className="space-y-6 animate-[fadeIn_300ms_ease-out]">
            <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }`}</style>
            <div style={{ animation: "fadeIn 300ms ease-out 0ms backwards" }}>
              <ScoreCards result={result} />
            </div>
            <div style={{ animation: "fadeIn 300ms ease-out 80ms backwards" }}>
              <TechStack stack={result.tech_stack} />
            </div>
            <div style={{ animation: "fadeIn 300ms ease-out 160ms backwards" }}>
              <SeoChecklist checklist={result.seo_checklist} />
            </div>
            <div style={{ animation: "fadeIn 300ms ease-out 240ms backwards" }}>
              <Suggestions suggestions={result.suggestions} />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}