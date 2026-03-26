import { z } from "zod";
import { smartleadRequest } from "../api.js";

export const setCampaignSettingsSchema = z.object({
  campaignId: z.number().describe("Campaign ID"),
  trackSettings: z.array(z.string()).optional().describe("Tracking options (e.g. DONT_TRACK_EMAIL_OPEN)"),
  stopLeadSettings: z.string().optional().describe("When to stop emailing a lead (e.g. REPLY_TO_AN_EMAIL)"),
  unsubscribeText: z.string().optional().describe("Unsubscribe text appended to emails"),
  sendAsPlainText: z.boolean().optional().describe("Send emails as plain text"),
  followUpPercentage: z.number().optional().describe("Percentage of leads receiving follow-ups"),
  enableAiEspMatching: z.boolean().optional().describe("Enable AI ESP matching"),
});

export async function setCampaignSettings(input: z.infer<typeof setCampaignSettingsSchema>) {
  const { campaignId, ...fields } = input;
  const body: Record<string, unknown> = {};
  if (fields.trackSettings !== undefined) body.track_settings = fields.trackSettings;
  if (fields.stopLeadSettings !== undefined) body.stop_lead_settings = fields.stopLeadSettings;
  if (fields.unsubscribeText !== undefined) body.unsubscribe_text = fields.unsubscribeText;
  if (fields.sendAsPlainText !== undefined) body.send_as_plain_text = fields.sendAsPlainText;
  if (fields.followUpPercentage !== undefined) body.follow_up_percentage = fields.followUpPercentage;
  if (fields.enableAiEspMatching !== undefined) body.enable_ai_esp_matching = fields.enableAiEspMatching;

  return smartleadRequest(`/campaigns/${campaignId}/settings`, {
    method: "POST",
    body,
  });
}
