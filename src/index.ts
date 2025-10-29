import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import type { ZodObject, ZodTypeAny, ZodRawShape } from 'zod';
import packageJson from '../package.json' with { type: 'json' };
import { loadEnv } from './config/env.js';
import { registry } from './mcp/tools/index.js';
import type { ToolHandler } from './mcp/router.js';

loadEnv();

function registerTool(server: McpServer, handler: ToolHandler): void {
  const config: {
    description?: string;
    inputSchema?: ZodRawShape;
  } = { description: handler.description };

  const schema = handler.schema as ZodTypeAny | undefined;
  const isZodObject = schema instanceof z.ZodObject;

  if (isZodObject) {
    config.inputSchema = (schema as ZodObject<ZodRawShape>).shape;
  }

  server.registerTool(handler.name, config, async (rawArgs: Record<string, unknown>) => {
    const parsedInput = schema
      ? (schema as ZodTypeAny).parse(rawArgs ?? {})
      : ((rawArgs ?? {}) as unknown);

    const result = await handler.invoke(parsedInput);
    const structured = (result ?? {}) as Record<string, unknown>;

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify(structured, null, 2)
        }
      ],
      structuredContent: structured
    };
  });
}

async function start() {
  const server = new McpServer({
    name: 'clio',
    version: typeof packageJson.version === 'string' ? packageJson.version : '0.0.0'
  });

  for (const tool of registry.tools) {
    registerTool(server, tool);
  }

  const transport = new StdioServerTransport();

  await server.connect(transport);
  console.log('Clio MCP server ready on stdio transport.');
}

start().catch((error) => {
  console.error('Failed to start Clio MCP server.', error);
  process.exit(1);
});
