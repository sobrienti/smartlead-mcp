import { z } from "zod";
import { smartleadRequest } from "../api.js";

export const getCampaignStatisticsSchema = z.object({
  campaignId: z.number().describe("Campaign ID"),
});

export async function getCampaignStatistics(input: z.infer<typeof getCampaignStatisticsSchema>) {
  return smartleadRequest(`/campaigns/${input.campaignId}/statistics`);
}
