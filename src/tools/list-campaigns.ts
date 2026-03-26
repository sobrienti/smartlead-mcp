import { z } from "zod";
import { smartleadRequest } from "../api.js";

export const listCampaignsSchema = z.object({});

export async function listCampaigns(_input: z.infer<typeof listCampaignsSchema>) {
  return smartleadRequest("/campaigns/");
}
