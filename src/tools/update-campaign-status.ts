import { z } from "zod";
import { smartleadRequest } from "../api.js";

export const updateCampaignStatusSchema = z.object({
  campaignId: z.number().describe("Campaign ID"),
  status: z.enum(["ACTIVE", "PAUSED", "STOPPED"]).describe("New campaign status"),
});

export async function updateCampaignStatus(input: z.infer<typeof updateCampaignStatusSchema>) {
  return smartleadRequest(`/campaigns/${input.campaignId}/status`, {
    method: "PATCH",
    body: { status: input.status },
  });
}
