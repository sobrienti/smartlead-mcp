import { z } from "zod";
import { smartleadRequest } from "../api.js";

export const removeEmailFromCampaignSchema = z.object({
  campaignId: z.number().describe("Campaign ID"),
  emailAccountId: z.number().describe("Email account ID to remove"),
});

export async function removeEmailFromCampaign(input: z.infer<typeof removeEmailFromCampaignSchema>) {
  return smartleadRequest(`/campaigns/${input.campaignId}/email-accounts`, {
    method: "DELETE",
    body: { email_account_id: input.emailAccountId },
  });
}
