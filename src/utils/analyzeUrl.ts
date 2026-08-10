export interface AnalysisResult {
  performance: number;
  seo: number;
  accessibility: number;
  best_practices: number;
  tech_stack: string[];
  seo_checklist: { label: string; status: "ok" | "warn" | "bad" }[];
  suggestions: {
    title: string;
    body: string;
    priority: "high" | "med" | "low";
  }[];
}

export async function analyzeUrl(url: string): Promise<AnalysisResult> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const model = "gemini-2.5-flash";
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const prompt = `You are a website analyzer. Analyze this URL: ${url}

Instructions:
- Even if you don't know this exact website, analyze based on URL structure, domain name, and make reasonable educated guesses
- For unknown/obscure sites, still provide realistic estimated scores
- Never refuse to analyze — always return valid JSON

Return ONLY this JSON structure, no markdown, no explanation:
{
  "performance": <0-100, estimate based on hosting/stack clues>,
  "seo": <0-100>,
  "accessibility": <0-100>,
  "best_practices": <0-100>,
  "tech_stack": ["infer from URL, subdomain, or common patterns"],
  "seo_checklist": [
    {"label": "Meta title", "status": "ok|warn|bad"},
    {"label": "Meta description", "status": "ok|warn|bad"},
    {"label": "Open Graph tags", "status": "ok|warn|bad"},
    {"label": "Mobile friendly", "status": "ok|warn|bad"},
    {"label": "HTTPS", "status": "ok|warn|bad"},
    {"label": "Sitemap", "status": "ok|warn|bad"},
    {"label": "robots.txt", "status": "ok|warn|bad"},
    {"label": "Canonical URL", "status": "ok|warn|bad"}
  ],
  "suggestions": [
    {"title": "...", "body": "...", "priority": "high|med|low"},
    {"title": "...", "body": "...", "priority": "high|med|low"},
    {"title": "...", "body": "...", "priority": "high|med|low"},
    {"title": "...", "body": "...", "priority": "high|med|low"}
  ]
}`;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      // Using Structured Output JSON mode
      generationConfig: { responseMimeType: "application/json" },
    }),
  });

  const data = await res.json();

  if (!data.candidates || data.candidates.length === 0) {
    throw new Error(
      "API failed to return content. Check payload or safety ratings.",
    );
  }

  const text = data.candidates[0].content.parts[0].text;
  return JSON.parse(text) as AnalysisResult;
}
