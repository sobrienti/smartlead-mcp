const DEFAULT_BASE_URL = "https://server.smartlead.ai/api/v1";

export interface SmartleadConfig {
  apiKey: string;
  baseUrl: string;
}

export function getSmartleadConfig(
  env: NodeJS.ProcessEnv = process.env
): SmartleadConfig {
  const apiKey = env.SMARTLEAD_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("Missing required env var: SMARTLEAD_API_KEY");
  }

  const configuredBaseUrl = env.SMARTLEAD_API_BASE_URL?.trim() || DEFAULT_BASE_URL;
  let baseUrl: URL;
  try {
    baseUrl = new URL(configuredBaseUrl);
  } catch {
    throw new Error("SMARTLEAD_API_BASE_URL must be a valid URL");
  }

  if (baseUrl.protocol !== "https:" && baseUrl.protocol !== "http:") {
    throw new Error("SMARTLEAD_API_BASE_URL must use http or https");
  }

  baseUrl.search = "";
  baseUrl.hash = "";

  return {
    apiKey,
    baseUrl: baseUrl.toString().replace(/\/$/, ""),
  };
}

export async function smartleadRequest(
  path: string,
  options: {
    method?: string;
    body?: Record<string, unknown> | unknown[];
    params?: Record<string, string | number>;
  } = {},
  config: SmartleadConfig = getSmartleadConfig()
): Promise<any> {
  const { method = "GET", body, params } = options;

  const url = new URL(`${config.baseUrl}/${path.replace(/^\/+/, "")}`);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, String(value));
    }
  }
  // Authentication always comes from server configuration and cannot be
  // overridden accidentally by a tool's query parameters.
  url.searchParams.set("api_key", config.apiKey);

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
