import { z } from "zod";
import { smartleadRequest } from "../api.js";

export const getCampaignSchema = z.object({
  campaignId: z.number().describe("Campaign ID"),
});

export async function getCampaign(input: z.infer<typeof getCampaignSchema>) {
  return smartleadRequest(`/campaigns/${input.campaignId}`);
}
