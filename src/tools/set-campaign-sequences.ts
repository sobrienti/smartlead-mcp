import { z } from "zod";
import { smartleadRequest } from "../api.js";

const variantSchema = z.object({
  subject: z.string().describe("Email subject line"),
  emailBody: z.string().describe("Email body (HTML or plain text)"),
  variantLabel: z.string().optional().describe("Variant label (e.g. A, B)"),
});

const sequenceSchema = z.object({
  seqNumber: z.number().describe("Sequence number (1 = first email, 2 = first follow-up, etc.)"),
  seqDelayDays: z.number().default(1).describe("Days to wait before sending this sequence step"),
  variants: z.array(variantSchema).describe("Email variants for A/B testing"),
});

export const setCampaignSequencesSchema = z.object({
  campaignId: z.number().describe("Campaign ID"),
  sequences: z.array(sequenceSchema).describe("Array of sequence steps with email variants"),
});

export async function setCampaignSequences(input: z.infer<typeof setCampaignSequencesSchema>) {
  const sequences = input.sequences.map((seq) => ({
    seq_number: seq.seqNumber,
    seq_delay_details: { delay_in_days: seq.seqDelayDays },
    variants: seq.variants.map((v) => ({
      subject: v.subject,
      email_body: v.emailBody,
      variant_label: v.variantLabel,
    })),
  }));

  return smartleadRequest(`/campaigns/${input.campaignId}/sequences`, {
    method: "POST",
    body: { sequences } as any,
  });
}
