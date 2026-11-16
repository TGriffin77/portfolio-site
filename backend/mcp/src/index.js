import { createServer } from 'node:http';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { z } from 'zod';

const port = Number(process.env.PORT || 3001);
const pocketBaseUrl = (process.env.POCKETBASE_URL || 'https://www.thomasgriffin.dev').replace(/\/$/, '');

function createMcpServer() {
  const server = new McpServer({ name: 'resume-projects', version: '1.0.0' });

  server.registerTool('list_experiences', {
    title: 'List work experience',
    description: 'Read Thomas Griffin’s work experience from PocketBase. Use alongside list_projects and list_technologies when tailoring a resume. Use only the recorded facts; do not infer unsupported accomplishments, metrics, or qualifications.',
    inputSchema: {
      query: z.string().optional().describe('Case-insensitive search across job titles, companies, and descriptions.'),
      limit: z.number().int().min(1).max(500).optional().default(100).describe('Maximum number of matching experiences to return.'),
    },
    annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: true },
  }, async ({ query, limit }) => {
    try {
      const records = [];
      let page = 1;
      while (true) {
        const response = await fetch(`${pocketBaseUrl}/api/collections/experiences/records?sort=display_order,id&perPage=100&page=${page}`, { signal: AbortSignal.timeout(15000) });
        if (!response.ok) throw new Error(`PocketBase returned HTTP ${response.status}`);
        const data = await response.json();
        records.push(...data.items);
        if (page * data.perPage >= data.totalItems) break;
        page++;
      }
      const q = query?.trim().toLowerCase();
      const matches = records.filter((record) =>
        !q || `${record.title} ${record.company} ${record.description}`.toLowerCase().includes(q));
      const experiences = matches.slice(0, limit).map(({ id, title, company, duration, description, display_order }) =>
        ({ id, title, company, duration, description, display_order }));
      return { content: [{ type: 'text', text: JSON.stringify({ total: matches.length, experiences }, null, 2) }] };
    } catch (error) {
      return { isError: true, content: [{ type: 'text', text: `Unable to read work experience: ${error.message}` }] };
    }
  });

  server.registerTool('list_technologies', {
    title: 'List technical skills',
    description: 'Read Thomas Griffin’s technical skills from the technologies collection. Use alongside list_projects when tailoring a resume. A listed technology alone does not establish proficiency, years of experience, or project accomplishments.',
    inputSchema: {
      query: z.string().optional().describe('Case-insensitive search in technology names and categories.'),
      category: z.string().optional().describe('Optional category to match, ignoring case.'),
      limit: z.number().int().min(1).max(500).optional().default(100),
    },
    annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: true },
  }, async ({ query, category, limit }) => {
    try {
      const records = [];
      let page = 1;
      while (true) {
        const response = await fetch(`${pocketBaseUrl}/api/collections/technologies/records?sort=category,name&perPage=100&page=${page}`, { signal: AbortSignal.timeout(15000) });
        if (!response.ok) throw new Error(`PocketBase returned HTTP ${response.status}`);
        const data = await response.json();
        records.push(...data.items);
        if (page * data.perPage >= data.totalItems) break;
        page++;
      }
      const q = query?.trim().toLowerCase();
      const c = category?.trim().toLowerCase();
      const matches = records.filter((record) =>
        (!q || `${record.name} ${record.category}`.toLowerCase().includes(q)) &&
        (!c || record.category.toLowerCase() === c));
      const technologies = matches.slice(0, limit).map(({ id, name, category, icon }) => ({ id, name, category, icon }));
      return { content: [{ type: 'text', text: JSON.stringify({ total: matches.length, technologies }, null, 2) }] };
    } catch (error) {
      return { isError: true, content: [{ type: 'text', text: `Unable to read technical skills: ${error.message}` }] };
    }
  });

  server.registerTool('list_projects', {
    title: 'List portfolio projects',
    description: 'List projects from Thomas Griffin’s portfolio, including descriptions, skills, and links. Use these records as evidence when tailoring a resume; do not infer unsupported accomplishments.',
    inputSchema: {
      query: z.string().optional().describe('Optional case-insensitive search across title, description, and skills.'),
      skill: z.string().optional().describe('Optional skill or technology to filter by.'),
      limit: z.number().int().min(1).max(100).optional().default(100).describe('Maximum number of matching projects to return.'),
    },
  }, async ({ query, skill, limit }) => {
    const response = await fetch(`${pocketBaseUrl}/api/collections/projects/records?sort=-created&perPage=500`);
    if (!response.ok) throw new Error(`PocketBase returned HTTP ${response.status}`);
    const data = await response.json();
    const q = query?.trim().toLowerCase();
    const s = skill?.trim().toLowerCase();
    const projects = (data.items || []).filter((project) => {
      const searchable = [project.title, project.description, ...(Array.isArray(project.skills) ? project.skills : [])].join(' ').toLowerCase();
      const matchesQuery = !q || searchable.includes(q);
      const matchesSkill = !s || (Array.isArray(project.skills) && project.skills.some((item) => String(item).toLowerCase().includes(s)));
      return matchesQuery && matchesSkill;
    }).slice(0, limit).map(({ id, title, description, link, skills, created, updated }) => ({ id, title, description, link, skills, created, updated }));

    return { content: [{ type: 'text', text: JSON.stringify({ total: projects.length, projects }, null, 2) }] };
  });
  return server;
}

const httpServer = createServer(async (req, res) => {
  if (req.url === '/health' && req.method === 'GET') {
    res.writeHead(200, { 'content-type': 'application/json' }).end(JSON.stringify({ status: 'ok' }));
    return;
  }
  if (req.url !== '/mcp') {
    res.writeHead(404).end('Not found');
    return;
  }
  if (!['GET', 'POST', 'DELETE'].includes(req.method || '')) {
    res.writeHead(405).end('Method not allowed');
    return;
  }

  let body;
  if (req.method === 'POST') {
    try {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      body = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    } catch {
      res.writeHead(400).end('Invalid JSON');
      return;
    }
  }

  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
  const server = createMcpServer();
  res.on('close', () => { void transport.close(); void server.close(); });
  try {
    await server.connect(transport);
    await transport.handleRequest(req, res, body);
  } catch (error) {
    console.error('MCP request failed:', error);
    if (!res.headersSent) res.writeHead(500).end('MCP request failed');
  }
});

httpServer.listen(port, '0.0.0.0', () => console.log(`Resume Projects MCP listening on ${port}`));
