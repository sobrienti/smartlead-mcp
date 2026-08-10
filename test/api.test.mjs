import assert from "node:assert/strict";
import test from "node:test";

import { getSmartleadConfig, smartleadRequest } from "../dist/api.js";

test("reads account credentials and API URL from runtime configuration", () => {
  assert.deepEqual(
    getSmartleadConfig({
      SMARTLEAD_API_KEY: "  account-specific-key  ",
      SMARTLEAD_API_BASE_URL: "https://smartlead.example/api/v1/",
    }),
    {
      apiKey: "account-specific-key",
      baseUrl: "https://smartlead.example/api/v1",
    }
  );
});

test("requires a Smartlead API key", () => {
  assert.throws(
    () => getSmartleadConfig({}),
    /Missing required env var: SMARTLEAD_API_KEY/
  );
});

test("uses the configured key for each request and protects it from query overrides", async (t) => {
  const requestedUrls = [];
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (input) => {
    requestedUrls.push(String(input));
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  };
  t.after(() => {
    globalThis.fetch = originalFetch;
  });

  await smartleadRequest(
    "/campaigns/",
    { params: { api_key: "ignored", offset: 10 } },
    { apiKey: "first-account-key", baseUrl: "https://one.example/api/v1" }
  );
  await smartleadRequest(
    "/campaigns/",
    {},
    { apiKey: "second-account-key", baseUrl: "https://two.example/api/v1" }
  );

  const firstUrl = new URL(requestedUrls[0]);
  const secondUrl = new URL(requestedUrls[1]);
  assert.equal(firstUrl.origin, "https://one.example");
  assert.equal(firstUrl.searchParams.get("api_key"), "first-account-key");
  assert.equal(firstUrl.searchParams.get("offset"), "10");
  assert.equal(secondUrl.origin, "https://two.example");
  assert.equal(secondUrl.searchParams.get("api_key"), "second-account-key");
});
