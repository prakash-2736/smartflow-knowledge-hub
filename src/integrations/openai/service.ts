// OpenAI client-side integration (dev/demo). For production, proxy via a secure backend.
// Expects VITE_OPENAI_API_KEY set in environment.

export interface SummaryResult {
  summary: string;
  keyInsights: string[];
}

export interface EntitiesResult {
  dates: string[];
  amounts: string[];
  people: string[];
  organizations: string[];
}

export interface ClassificationResult {
  category: string;
  confidence: number;
  tags: string[];
}

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY as string | undefined;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

const guardKey = () => {
  if (!OPENAI_API_KEY) {
    throw new Error('Missing VITE_OPENAI_API_KEY');
  }
};

async function chat(prompt: string, system: string) {
  guardKey();
  const res = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: prompt },
      ],
      temperature: 0.2,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenAI error: ${res.status} ${text}`);
  }
  const json = await res.json();
  const content = json.choices?.[0]?.message?.content ?? '';
  return content as string;
}

export async function summarizeDocumentText(text: string, languageHint?: 'en' | 'ml' | 'mixed'): Promise<SummaryResult> {
  const system = 'You are an assistant that summarizes KMRL documents. Return JSON with {"summary":"...","keyInsights":["..."]}. Keep it concise.';
  const prompt = `Language: ${languageHint || 'mixed'}\nText:\n${text}\nReturn strictly JSON.`;
  const content = await chat(prompt, system);
  try {
    const parsed = JSON.parse(content);
    return { summary: parsed.summary || '', keyInsights: parsed.keyInsights || [] };
  } catch {
    return { summary: content.slice(0, 1200), keyInsights: [] };
  }
}

export async function extractEntities(text: string): Promise<EntitiesResult> {
  const system = 'Extract dates, amounts, people, organizations from KMRL documents. Return JSON {"dates":[],"amounts":[],"people":[],"organizations":[]}';
  const prompt = `Text:\n${text}\nReturn strictly JSON.`;
  const content = await chat(prompt, system);
  try {
    const parsed = JSON.parse(content);
    return {
      dates: parsed.dates || [],
      amounts: parsed.amounts || [],
      people: parsed.people || [],
      organizations: parsed.organizations || [],
    };
  } catch {
    return { dates: [], amounts: [], people: [], organizations: [] };
  }
}

export async function classifyDocument(text: string): Promise<ClassificationResult> {
  const system = 'Classify KMRL documents by purpose (invoice, circular, maintenance, HR, legal, operations, engineering, finance). Return JSON {"category":"...","confidence":0-1,"tags":[]}';
  const prompt = `Text:\n${text}\nReturn strictly JSON.`;
  const content = await chat(prompt, system);
  try {
    const parsed = JSON.parse(content);
    return { category: parsed.category || 'general', confidence: parsed.confidence || 0.5, tags: parsed.tags || [] };
  } catch {
    return { category: 'general', confidence: 0.5, tags: [] };
  }
}


