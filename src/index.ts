#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { getSmartleadConfig } from "./api.js";

import { addEmailAccountSchema, addEmailAccount } from "./tools/add-email-account.js";
import { listEmailAccountsSchema, listEmailAccounts } from "./tools/list-email-accounts.js";
import { getEmailAccountSchema, getEmailAccount } from "./tools/get-email-account.js";
import { updateEmailAccountSchema, updateEmailAccount } from "./tools/update-email-account.js";
import { setWarmupSchema, setWarmup } from "./tools/set-warmup.js";
import { getWarmupStatsSchema, getWarmupStats } from "./tools/get-warmup-stats.js";
import { createCampaignSchema, createCampaign } from "./tools/create-campaign.js";
import { listCampaignsSchema, listCampaigns } from "./tools/list-campaigns.js";
import { getCampaignSchema, getCampaign } from "./tools/get-campaign.js";
import { updateCampaignStatusSchema, updateCampaignStatus } from "./tools/update-campaign-status.js";
import { setCampaignScheduleSchema, setCampaignSchedule } from "./tools/set-campaign-schedule.js";
import { setCampaignSettingsSchema, setCampaignSettings } from "./tools/set-campaign-settings.js";
import { setCampaignSequencesSchema, setCampaignSequences } from "./tools/set-campaign-sequences.js";
import { getCampaignSequencesSchema, getCampaignSequences } from "./tools/get-campaign-sequences.js";
import { deleteCampaignSchema, deleteCampaign } from "./tools/delete-campaign.js";
import { assignEmailToCampaignSchema, assignEmailToCampaign } from "./tools/assign-email-to-campaign.js";
import { removeEmailFromCampaignSchema, removeEmailFromCampaign } from "./tools/remove-email-from-campaign.js";
import { addLeadsSchema, addLeads } from "./tools/add-leads.js";
import { listLeadsSchema, listLeads } from "./tools/list-leads.js";
import { getCampaignAnalyticsSchema, getCampaignAnalytics } from "./tools/get-campaign-analytics.js";
import { getCampaignStatisticsSchema, getCampaignStatistics } from "./tools/get-campaign-statistics.js";
import { getAnalyticsOverviewSchema, getAnalyticsOverview } from "./tools/get-analytics-overview.js";

const server = new McpServer(
  {
    name: "smartlead",
    version: "1.0.0",
  },
  {
    instructions:
      "Smartlead cold email platform server. Use these tools to manage email sending accounts, " +
      "create and configure outreach campaigns, manage leads, and monitor campaign analytics. " +
      "Typical workflow: add email accounts → create campaign → set sequences (email copy) → " +
      "set schedule → add leads → assign email accounts → activate campaign → monitor analytics.",
  }
);

// Email account tools
const tool = (name: string, desc: string, schema: any, handler: any) =>
  server.tool(name, desc, schema.shape, async (input: any) => {
    const result = await handler(input);
    return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
  });

tool("add-email-account", "Add a new email sending account with provider-specific SMTP/IMAP credentials", addEmailAccountSchema, addEmailAccount);
tool("list-email-accounts", "List all email sending accounts", listEmailAccountsSchema, listEmailAccounts);
tool("get-email-account", "Get details of a specific email account", getEmailAccountSchema, getEmailAccount);
tool("update-email-account", "Update an email account's settings", updateEmailAccountSchema, updateEmailAccount);
tool("set-warmup", "Enable or configure email warmup for an account", setWarmupSchema, setWarmup);
tool("get-warmup-stats", "Get warmup statistics for an email account (last 7 days)", getWarmupStatsSchema, getWarmupStats);

// Campaign tools
tool("create-campaign", "Create a new campaign (starts in DRAFTED status)", createCampaignSchema, createCampaign);
tool("list-campaigns", "List all campaigns", listCampaignsSchema, listCampaigns);
tool("get-campaign", "Get details of a specific campaign", getCampaignSchema, getCampaign);
tool("update-campaign-status", "Set campaign status to ACTIVE, PAUSED, or STOPPED", updateCampaignStatusSchema, updateCampaignStatus);
tool("set-campaign-schedule", "Configure when emails are sent (timezone, hours, days, rate limits)", setCampaignScheduleSchema, setCampaignSchedule);
tool("set-campaign-settings", "Configure campaign settings (tracking, unsubscribe, AI ESP matching)", setCampaignSettingsSchema, setCampaignSettings);
tool("set-campaign-sequences", "Create or update email sequences with A/B variants", setCampaignSequencesSchema, setCampaignSequences);
tool("get-campaign-sequences", "Get all email sequences for a campaign", getCampaignSequencesSchema, getCampaignSequences);
tool("delete-campaign", "Permanently delete a campaign", deleteCampaignSchema, deleteCampaign);
tool("assign-email-to-campaign", "Assign an email sending account to a campaign", assignEmailToCampaignSchema, assignEmailToCampaign);
tool("remove-email-from-campaign", "Remove an email account from a campaign", removeEmailFromCampaignSchema, removeEmailFromCampaign);

// Lead tools
tool("add-leads", "Add leads to a campaign", addLeadsSchema, addLeads);
tool("list-leads", "List leads in a campaign", listLeadsSchema, listLeads);

// Analytics tools
tool("get-campaign-analytics", "Get top-level analytics for a campaign", getCampaignAnalyticsSchema, getCampaignAnalytics);
tool("get-campaign-statistics", "Get detailed statistics for a campaign", getCampaignStatisticsSchema, getCampaignStatistics);
tool("get-analytics-overview", "Get global analytics overview across all campaigns", getAnalyticsOverviewSchema, getAnalyticsOverview);

async function main() {
  // Fail at startup with a clear configuration error instead of waiting for
  // the first tool call to discover that credentials are missing.
  getSmartleadConfig();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Smartlead MCP server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
