const BASE_URL = "https://server.smartlead.ai/api/v1";

function getApiKey(): string {
  const key = process.env.SMARTLEAD_API_KEY;
  if (!key) {
    throw new Error("Missing required env var: SMARTLEAD_API_KEY");
  }
  return key;
}

export async function smartleadRequest(
  path: string,
  options: {
    method?: string;
    body?: Record<string, unknown> | unknown[];
    params?: Record<string, string | number>;
  } = {}
): Promise<any> {
  const { method = "GET", body, params } = options;

  const url = new URL(`${BASE_URL}${path}`);
  url.searchParams.set("api_key", getApiKey());
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, String(value));
    }
  }

  const response = await fetch(url.toString(), {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();

  if (!response.ok) {
    let errorMsg: string;
    try {
      const err = JSON.parse(text);
      errorMsg = err.message || err.error || text;
    } catch {
      errorMsg = text;
    }
    throw new Error(`Smartlead API error (${response.status}): ${errorMsg}`);
  }

  if (!text) return {};
  return JSON.parse(text);
}
