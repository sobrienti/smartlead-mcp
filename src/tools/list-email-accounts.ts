import { z } from "zod";
import { smartleadRequest } from "../api.js";

export const listEmailAccountsSchema = z.object({
  offset: z.number().default(0).describe("Pagination offset (default 0)"),
  limit: z.number().default(100).describe("Max results to return (default 100, max 100)"),
});

export async function listEmailAccounts(input: z.infer<typeof listEmailAccountsSchema>) {
  return smartleadRequest("/email-accounts/", {
    params: { offset: input.offset, limit: input.limit },
  });
}
