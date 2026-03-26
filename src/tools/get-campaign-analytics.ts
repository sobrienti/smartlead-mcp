import { z } from "zod";
import { smartleadRequest } from "../api.js";

export const getCampaignAnalyticsSchema = z.object({
  campaignId: z.number().describe("Campaign ID"),
});

export async function getCampaignAnalytics(input: z.infer<typeof getCampaignAnalyticsSchema>) {
  return smartleadRequest(`/campaigns/${input.campaignId}/analytics`);
}
