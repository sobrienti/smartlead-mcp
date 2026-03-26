import { z } from "zod";
import { smartleadRequest } from "../api.js";

export const getEmailAccountSchema = z.object({
  emailAccountId: z.number().describe("Email account ID"),
});

export async function getEmailAccount(input: z.infer<typeof getEmailAccountSchema>) {
  return smartleadRequest(`/email-accounts/${input.emailAccountId}/`);
}
