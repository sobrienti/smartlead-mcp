import { z } from "zod";
import { smartleadRequest } from "../api.js";

export const addEmailAccountSchema = z.object({
  fromName: z.string().describe("Display name for the sender"),
  fromEmail: z.string().describe("Email address to send from"),
  username: z.string().describe("SMTP/IMAP username (usually the email address)"),
  password: z.string().describe("SMTP/IMAP password or app password"),
  smtpHost: z.string().default("smtp.gmail.com").describe("SMTP server host (default smtp.gmail.com)"),
  smtpPort: z.number().default(587).describe("SMTP port (default 587)"),
  smtpPortType: z.enum(["TLS", "SSL"]).default("TLS").describe("SMTP connection type (default TLS)"),
  imapHost: z.string().default("imap.gmail.com").describe("IMAP server host (default imap.gmail.com)"),
  imapPort: z.number().default(993).describe("IMAP port (default 993)"),
  maxEmailPerDay: z.number().optional().describe("Max emails per day for this account"),
  signature: z.string().optional().describe("Email signature HTML"),
});

export async function addEmailAccount(input: z.infer<typeof addEmailAccountSchema>) {
  return smartleadRequest("/email-accounts/save", {
    method: "POST",
    body: {
      from_name: input.fromName,
      from_email: input.fromEmail,
      username: input.username,
      password: input.password,
      smtp_host: input.smtpHost,
      smtp_port: input.smtpPort,
      smtp_port_type: input.smtpPortType,
      imap_host: input.imapHost,
      imap_port: input.imapPort,
      max_email_per_day: input.maxEmailPerDay,
      signature: input.signature,
    },
  });
}
