# Clio
A personal assistant MCP server

## Running the MCP server

1. Install dependencies and compile the TypeScript sources:
   ```bash
   npm install
   npm run build
   ```
2. Ensure `.env` is populated with Supabase credentials (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ANON_KEY`) and that the `supabase db push` command has been run against your project.
3. Start the MCP server over stdio:
   ```bash
   npm start
   ```

When the process logs `Clio MCP server ready on stdio transport.`, it is ready for an LLM client.

### Connecting an LLM client (example)

You can exercise the server with any MCP-aware client. For example, using the MCP Inspector:

1. Install the inspector globally (if needed):
   ```bash
   npx @modelcontextprotocol/inspector
   ```
2. In the inspector UI, add a new stdio server with:
   - **Command:** `npm`
   - **Args:** `["run", "dev"]`
   - **Working directory:** the root of this repository.
3. Once connected, call the `collections.create` tool with:
   ```json
   {
     "ownerId": "2a96f6e6-6dfe-4aec-8f18-5ef2a467e1d6",
     "name": "Inspector test collection",
     "structureProxy": {}
   }
   ```
4. Follow up with `collections.list` for the same `userId` to verify the entry round trip.

Any MCP-compatible IDE integration (Claude Code, VS Code Copilot MCP, Cursor, etc.) can be configured similarly by pointing it at the stdio command.
