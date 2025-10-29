import type { ZodTypeAny } from 'zod';

export interface ToolHandler<TInput = unknown, TResult = unknown> {
  name: string;
  description: string;
  schema?: ZodTypeAny;
  invoke(input: TInput): Promise<TResult>;
}

export interface ToolRegistry {
  tools: ToolHandler[];
}

export function createToolRegistry(tools: ToolHandler[]): ToolRegistry {
  return { tools };
}
