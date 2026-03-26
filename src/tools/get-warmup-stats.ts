import { z } from "zod";
import { smartleadRequest } from "../api.js";

export const getWarmupStatsSchema = z.object({
  emailAccountId: z.number().describe("Email account ID"),
});

export async function getWarmupStats(input: z.infer<typeof getWarmupStatsSchema>) {
  return smartleadRequest(`/email-accounts/${input.emailAccountId}/warmup-stats`);
}
