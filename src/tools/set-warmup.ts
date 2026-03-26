import { z } from "zod";
import { smartleadRequest } from "../api.js";

export const setWarmupSchema = z.object({
  emailAccountId: z.number().describe("Email account ID"),
  warmupEnabled: z.boolean().describe("Enable or disable warmup"),
  totalWarmupPerDay: z.number().optional().describe("Total warmup emails per day"),
  dailyRampup: z.number().optional().describe("Daily ramp-up increment"),
  replyRatePercentage: z.number().optional().describe("Reply rate percentage for warmup"),
});

export async function setWarmup(input: z.infer<typeof setWarmupSchema>) {
  return smartleadRequest(`/email-accounts/${input.emailAccountId}/warmup`, {
    method: "POST",
    body: {
      warmup_enabled: input.warmupEnabled,
      total_warmup_per_day: input.totalWarmupPerDay,
      daily_rampup: input.dailyRampup,
      reply_rate_percentage: input.replyRatePercentage,
    },
  });
}
