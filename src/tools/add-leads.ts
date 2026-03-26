import { z } from "zod";
import { smartleadRequest } from "../api.js";

const leadSchema = z.object({
  email: z.string().describe("Lead's email address"),
  firstName: z.string().optional().describe("Lead's first name"),
  lastName: z.string().optional().describe("Lead's last name"),
  company: z.string().optional().describe("Lead's company"),
  customFields: z.record(z.string()).optional().describe("Custom fields as key-value pairs"),
});

export const addLeadsSchema = z.object({
  campaignId: z.number().describe("Campaign ID to add leads to"),
  leads: z.array(leadSchema).describe("Array of leads to add"),
});

export async function addLeads(input: z.infer<typeof addLeadsSchema>) {
  const leads = input.leads.map((lead) => ({
    email: lead.email,
    first_name: lead.firstName,
    last_name: lead.lastName,
    company: lead.company,
    ...lead.customFields,
  }));

  return smartleadRequest(`/campaigns/${input.campaignId}/leads`, {
    method: "POST",
    body: { lead_list: leads } as any,
  });
}
