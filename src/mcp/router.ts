export interface ToolHandler<TInput = unknown, TResult = unknown> {
  name: string;
  description: string;
  invoke(input: TInput): Promise<TResult>;
}

export interface ToolRegistry {
  tools: ToolHandler[];
}

export function createToolRegistry(tools: ToolHandler[]): ToolRegistry {
  return { tools };
}
