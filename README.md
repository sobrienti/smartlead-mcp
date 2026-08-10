# Smartlead MCP server

An MCP server for managing Smartlead email accounts, campaigns, leads, and analytics. The server is account-agnostic: each running instance authenticates with the Smartlead API key supplied by its MCP client.

## Configuration

Set configuration in the MCP client's environment. No Smartlead account ID, API key, or sender credentials are stored in this package.

| Variable | Required | Description |
| --- | --- | --- |
| `SMARTLEAD_API_KEY` | Yes | API key for the Smartlead account this server instance should use. |
| `SMARTLEAD_API_BASE_URL` | No | Smartlead-compatible API root. Defaults to `https://server.smartlead.ai/api/v1`. |

Example MCP client configuration:

```json
{
  "mcpServers": {
    "smartlead": {
      "command": "npx",
      "args": ["-y", "smartlead-mcp"],
      "env": {
        "SMARTLEAD_API_KEY": "YOUR_SMARTLEAD_API_KEY"
      }
    }
  }
}
```

To switch accounts, change `SMARTLEAD_API_KEY` in the MCP client configuration and restart that server instance. Run multiple instances with different names and environment values to connect to multiple Smartlead accounts at once.

The `add-email-account` tool requires the SMTP and IMAP host, port, and connection type supplied by that email provider; it does not assume Gmail or any other provider.

## Development

```bash
npm install
npm test
```
