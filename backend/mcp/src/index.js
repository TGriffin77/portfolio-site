import { createServer } from 'node:http';
import { randomUUID } from 'node:crypto';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { z } from 'zod';

const port = Number(process.env.PORT || 3001);
const pocketBaseUrl = (process.env.POCKETBASE_URL || 'https://www.thomasgriffin.dev').replace(/\/$/, '');

function createMcpServer() {
  const server = new McpServer({ name: 'resume-projects', version: '1.0.0' });

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
