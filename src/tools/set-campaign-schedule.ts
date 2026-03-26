import { z } from "zod";
import { smartleadRequest } from "../api.js";

export const setCampaignScheduleSchema = z.object({
  campaignId: z.number().describe("Campaign ID"),
  timezone: z.string().optional().describe("Timezone (e.g. America/New_York)"),
  daysOfTheWeek: z.array(z.number()).optional().describe("Days to send (0=Sun, 1=Mon, ..., 6=Sat)"),
  startHour: z.string().optional().describe("Start hour (e.g. 09:00)"),
  endHour: z.string().optional().describe("End hour (e.g. 17:00)"),
  minTimeBtwEmails: z.number().optional().describe("Minimum minutes between emails"),
  maxLeadsPerDay: z.number().optional().describe("Max leads contacted per day"),
});

export async function setCampaignSchedule(input: z.infer<typeof setCampaignScheduleSchema>) {
  const { campaignId, ...fields } = input;
  const body: Record<string, unknown> = {};
  if (fields.timezone !== undefined) body.timezone = fields.timezone;
  if (fields.daysOfTheWeek !== undefined) body.days_of_the_week = fields.daysOfTheWeek;
  if (fields.startHour !== undefined) body.start_hour = fields.startHour;
  if (fields.endHour !== undefined) body.end_hour = fields.endHour;
  if (fields.minTimeBtwEmails !== undefined) body.min_time_btw_emails = fields.minTimeBtwEmails;
  if (fields.maxLeadsPerDay !== undefined) body.max_leads_per_day = fields.maxLeadsPerDay;

  return smartleadRequest(`/campaigns/${campaignId}/schedule`, {
    method: "POST",
    body,
  });
}
