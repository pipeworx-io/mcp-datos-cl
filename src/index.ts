interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * datos.gob.cl CKAN MCP.
 */


const BASE = 'https://datos.gob.cl/api/3/action';
const UA = 'pipeworx-mcp-datos-cl/1.0 (+https://pipeworx.io)';

const tools: McpToolExport['tools'] = [
  { name: 'package_list', description: 'List dataset names.', inputSchema: { type: 'object', properties: { limit: { type: 'number' }, offset: { type: 'number' } } } },
  {
    name: 'package_search',
    description: 'Full-text + faceted search.',
    inputSchema: { type: 'object', properties: { q: { type: 'string' }, fq: { type: 'string' }, sort: { type: 'string' }, rows: { type: 'number' }, start: { type: 'number' }, facet_field: { type: 'string' } } },
  },
  { name: 'package_show', description: 'Single dataset.', inputSchema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] } },
  {
    name: 'organization_list',
    description: 'Publishing orgs.',
    inputSchema: { type: 'object', properties: { all_fields: { type: 'boolean' }, limit: { type: 'number' }, offset: { type: 'number' } } },
  },
  { name: 'organization_show', description: 'Single org.', inputSchema: { type: 'object', properties: { id: { type: 'string' }, include_datasets: { type: 'boolean' } }, required: ['id'] } },
  { name: 'group_list', description: 'Groups/categories.', inputSchema: { type: 'object', properties: { all_fields: { type: 'boolean' }, limit: { type: 'number' }, offset: { type: 'number' } } } },
  { name: 'group_show', description: 'Single group.', inputSchema: { type: 'object', properties: { id: { type: 'string' }, include_datasets: { type: 'boolean' } }, required: ['id'] } },
  {
    name: 'tag_list',
    description: 'Tag list.',
    inputSchema: { type: 'object', properties: { query: { type: 'string' }, all_fields: { type: 'boolean' }, vocabulary_id: { type: 'string' } } },
  },
  { name: 'recently_changed_packages', description: 'Recent updates.', inputSchema: { type: 'object', properties: { limit: { type: 'number' }, offset: { type: 'number' } } } },
  { name: 'resource_show', description: 'Single resource.', inputSchema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] } },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  const get = async (action: string, params?: Record<string, unknown>) => {
    const p = new URLSearchParams();
    if (params) for (const [k, v] of Object.entries(params)) if (v != null) p.set(k, String(v));
    const res = await fetch(`${BASE}/${action}${[...p].length ? `?${p}` : ''}`, { headers: { Accept: 'application/json', 'User-Agent': UA } });
    if (!res.ok) throw new Error(`datos.gob.cl: ${res.status}`);
    const j = (await res.json()) as { success?: boolean; result?: unknown; error?: { message?: string } };
    if (!j.success) throw new Error(`datos.gob.cl: ${j.error?.message ?? 'request failed'}`);
    return j.result;
  };
  const reqStr = (k: string, ex: string) => {
    const v = args[k];
    if (typeof v !== 'string' || !v.trim()) throw new Error(`Required argument "${k}" is missing. Pass a string like ${ex}.`);
    return v;
  };
  switch (name) {
    case 'package_list':
      return get('package_list', args);
    case 'package_search':
      return get('package_search', args);
    case 'package_show':
      return get('package_show', { id: reqStr('id', '"<dataset-id>"') });
    case 'organization_list':
      return get('organization_list', args);
    case 'organization_show':
      return get('organization_show', { id: reqStr('id', '"<org-id>"'), include_datasets: args.include_datasets });
    case 'group_list':
      return get('group_list', args);
    case 'group_show':
      return get('group_show', { id: reqStr('id', '"<group-id>"'), include_datasets: args.include_datasets });
    case 'tag_list':
      return get('tag_list', args);
    case 'recently_changed_packages':
      return get('recently_changed_packages_activity_list', args);
    case 'resource_show':
      return get('resource_show', { id: reqStr('id', '"<resource-id>"') });
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
