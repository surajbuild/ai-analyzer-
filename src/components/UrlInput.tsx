import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
  onAnalyze: (url: string) => void;
  loading: boolean;
}

const STORAGE_KEY = "ai-detective:last-url";

export default function UrlInput({ onAnalyze, loading }: Props) {
  const [url, setUrl] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) ?? "";
    } catch {
      return "";
    }
  });

  useEffect(() => {
    try {
      if (url) localStorage.setItem(STORAGE_KEY, url);
    } catch {
      // ignore quota / privacy errors
    }
  }, [url]);

  function handleSubmit() {
    if (!url.trim()) return;
    let formatted = url.trim();
    if (!formatted.startsWith("http")) formatted = "https://" + formatted;
    onAnalyze(formatted);
  }

  return (
    <div className="flex gap-2">
      <Input
        placeholder="https://yourwebsite.com"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        disabled={loading}
      />
      <Button onClick={handleSubmit} disabled={loading}>
        {loading ? "Analyzing..." : "Analyze"}
      </Button>
    </div>
  );
}