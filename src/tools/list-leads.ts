import { z } from "zod";
import { smartleadRequest } from "../api.js";

export const listLeadsSchema = z.object({
  campaignId: z.number().describe("Campaign ID"),
  offset: z.number().default(0).describe("Pagination offset (default 0)"),
  limit: z.number().default(100).describe("Max results (default 100, max 100)"),
});

export async function listLeads(input: z.infer<typeof listLeadsSchema>) {
  return smartleadRequest(`/campaigns/${input.campaignId}/leads`, {
    params: { offset: input.offset, limit: input.limit },
  });
}
