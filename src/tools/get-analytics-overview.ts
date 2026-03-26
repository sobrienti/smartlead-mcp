import { z } from "zod";
import { smartleadRequest } from "../api.js";

export const getAnalyticsOverviewSchema = z.object({});

export async function getAnalyticsOverview(_input: z.infer<typeof getAnalyticsOverviewSchema>) {
  return smartleadRequest("/analytics/overview");
}
