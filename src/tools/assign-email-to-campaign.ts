import { z } from "zod";
import { smartleadRequest } from "../api.js";

export const assignEmailToCampaignSchema = z.object({
  campaignId: z.number().describe("Campaign ID"),
  emailAccountId: z.number().describe("Email account ID to assign"),
});

export async function assignEmailToCampaign(input: z.infer<typeof assignEmailToCampaignSchema>) {
  return smartleadRequest(`/campaigns/${input.campaignId}/email-accounts`, {
    method: "POST",
    body: { email_account_id: input.emailAccountId },
  });
}
