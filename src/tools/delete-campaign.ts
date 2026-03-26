import { z } from "zod";
import { smartleadRequest } from "../api.js";

export const deleteCampaignSchema = z.object({
  campaignId: z.number().describe("Campaign ID to delete"),
});

export async function deleteCampaign(input: z.infer<typeof deleteCampaignSchema>) {
  return smartleadRequest(`/campaigns/${input.campaignId}`, { method: "DELETE" });
}
