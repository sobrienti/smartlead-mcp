import { z } from "zod";
import { smartleadRequest } from "../api.js";

export const updateEmailAccountSchema = z.object({
  emailAccountId: z.number().describe("Email account ID to update"),
  fromName: z.string().optional().describe("Display name for the sender"),
  fromEmail: z.string().optional().describe("Email address to send from"),
  username: z.string().optional().describe("SMTP/IMAP username"),
  password: z.string().optional().describe("SMTP/IMAP password"),
  smtpHost: z.string().optional().describe("SMTP server host"),
  smtpPort: z.number().optional().describe("SMTP port"),
  smtpPortType: z.enum(["TLS", "SSL"]).optional().describe("SMTP connection type"),
  imapHost: z.string().optional().describe("IMAP server host"),
  imapPort: z.number().optional().describe("IMAP port"),
  maxEmailPerDay: z.number().optional().describe("Max emails per day"),
  signature: z.string().optional().describe("Email signature HTML"),
});

export async function updateEmailAccount(input: z.infer<typeof updateEmailAccountSchema>) {
  const { emailAccountId, ...fields } = input;
  const body: Record<string, unknown> = {};
  if (fields.fromName !== undefined) body.from_name = fields.fromName;
  if (fields.fromEmail !== undefined) body.from_email = fields.fromEmail;
  if (fields.username !== undefined) body.username = fields.username;
  if (fields.password !== undefined) body.password = fields.password;
  if (fields.smtpHost !== undefined) body.smtp_host = fields.smtpHost;
  if (fields.smtpPort !== undefined) body.smtp_port = fields.smtpPort;
  if (fields.smtpPortType !== undefined) body.smtp_port_type = fields.smtpPortType;
  if (fields.imapHost !== undefined) body.imap_host = fields.imapHost;
  if (fields.imapPort !== undefined) body.imap_port = fields.imapPort;
  if (fields.maxEmailPerDay !== undefined) body.max_email_per_day = fields.maxEmailPerDay;
  if (fields.signature !== undefined) body.signature = fields.signature;

  return smartleadRequest(`/email-accounts/${emailAccountId}`, {
    method: "POST",
    body,
  });
}
