import { z } from "zod";
import { smartleadRequest } from "../api.js";

export const createCampaignSchema = z.object({
  name: z.string().describe("Campaign name"),
  clientId: z.number().optional().describe("Client ID for white-label accounts"),
});

export async function createCampaign(input: z.infer<typeof createCampaignSchema>) {
  return smartleadRequest("/campaigns/create", {
    method: "POST",
    body: {
      name: input.name,
      client_id: input.clientId,
    },
  });
}
