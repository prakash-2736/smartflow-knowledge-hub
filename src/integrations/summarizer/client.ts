export interface ExternalSummaryResponse {
  summary: string;
}

const SUMMARIZER_URL = import.meta.env.VITE_SUMMARIZER_URL as string | undefined;

export const hasExternalSummarizer = () => Boolean(SUMMARIZER_URL);

export async function summarizeViaExternal(text: string, opts?: { ratio?: number; min_sentences?: number; max_sentences?: number }) {
  if (!SUMMARIZER_URL) throw new Error('VITE_SUMMARIZER_URL is not set');
  const res = await fetch(SUMMARIZER_URL.replace(/\/$/, '') + '/summarize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, ratio: opts?.ratio ?? 0.3, min_sentences: opts?.min_sentences ?? 3, max_sentences: opts?.max_sentences ?? 8 })
  });
  if (!res.ok) throw new Error(`Summarizer error ${res.status}`);
  const json = (await res.json()) as ExternalSummaryResponse;
  return json.summary || '';
}


