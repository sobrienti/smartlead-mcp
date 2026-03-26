import { z } from "zod";
import { smartleadRequest } from "../api.js";

export const getCampaignSequencesSchema = z.object({
  campaignId: z.number().describe("Campaign ID"),
});

export async function getCampaignSequences(input: z.infer<typeof getCampaignSequencesSchema>) {
  return smartleadRequest(`/campaigns/${input.campaignId}/sequences`);
}
