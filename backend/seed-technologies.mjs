const baseUrl = (process.env.POCKETBASE_URL || 'https://www.thomasgriffin.dev').replace(/\/$/, '');
const adminEmail = process.env.POCKETBASE_ADMIN_EMAIL;
const adminPassword = process.env.POCKETBASE_ADMIN_PASSWORD;
if (!adminEmail || !adminPassword) throw new Error('PocketBase admin credentials are required.');

const technologies = [
  ['Python', 'Programming and Markdown Languages', 'logos:python'],
  ['JavaScript', 'Programming and Markdown Languages', 'logos:javascript'],
  ['TypeScript', 'Programming and Markdown Languages', 'logos:typescript-icon'],
  ['Java', 'Programming and Markdown Languages', 'logos:java'],
  ['C++', 'Programming and Markdown Languages', 'logos:c-plusplus'],
  ['HTML', 'Programming and Markdown Languages', 'logos:html-5'],
  ['CSS', 'Programming and Markdown Languages', 'logos:css-3'],
  ['Markdown', 'Programming and Markdown Languages', 'logos:markdown'],
  ['SQL', 'Programming and Markdown Languages', 'logos:postgresql'],
  ['React', 'Frameworks and Libraries', 'logos:react'],
  ['Tailwind CSS', 'Frameworks and Libraries', 'logos:tailwindcss-icon'],
  ['Node.js', 'Frameworks and Libraries', 'logos:nodejs-icon'],
  ['Express.js', 'Frameworks and Libraries', ''],
  ['Next.js', 'Frameworks and Libraries', 'logos:nextjs-icon'],
  ['Linux', 'Tools and Platforms', 'logos:linux-tux'],
  ['Git', 'Tools and Platforms', 'logos:git-icon'],
  ['GitHub', 'Tools and Platforms', 'logos:github-icon'],
  ['VS Code', 'Tools and Platforms', 'logos:visual-studio-code'],
  ['AWS', 'Tools and Platforms', 'logos:aws'],
  ['Docker', 'Tools and Platforms', 'logos:docker-icon'],
  ['Vercel', 'Tools and Platforms', 'logos:vercel-icon'],
  ['Jira', 'Tools and Platforms', 'logos:jira'],
].map(([name, category, icon]) => ({ name, category, icon }));

async function api(path, { token, ...options } = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: { ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...(token ? { Authorization: token } : {}), ...options.headers },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`${options.method || 'GET'} ${path}: HTTP ${response.status} ${JSON.stringify(data)}`);
  return data;
}

const auth = await api('/api/collections/_superusers/auth-with-password', {
  method: 'POST', body: JSON.stringify({ identity: adminEmail, password: adminPassword }),
});
const token = auth.token;

try {
  await api('/api/collections/technologies', { token });
  console.log('Using existing technologies collection.');
} catch (error) {
  if (!String(error.message).includes('HTTP 404')) throw error;
  await api('/api/collections', {
    token, method: 'POST',
    body: JSON.stringify({
      name: 'technologies', type: 'base', listRule: '', viewRule: '',
      createRule: null, updateRule: null, deleteRule: null,
      fields: [
        { name: 'name', type: 'text', required: true, min: 1, max: 100, pattern: '' },
        { name: 'category', type: 'text', required: true, min: 1, max: 100, pattern: '' },
        { name: 'icon', type: 'text', required: false, min: 0, max: 100, pattern: '' },
      ],
      indexes: ['CREATE UNIQUE INDEX idx_technologies_name ON technologies (name)'],
    }),
  });
  console.log('Created public-read technologies collection.');
}

for (const technology of technologies) {
  const filter = encodeURIComponent(`name = ${JSON.stringify(technology.name)}`);
  const found = await api(`/api/collections/technologies/records?filter=${filter}&perPage=1`, { token });
  if (found.items.length) {
    await api(`/api/collections/technologies/records/${found.items[0].id}`, { token, method: 'PATCH', body: JSON.stringify(technology) });
  } else {
    await api('/api/collections/technologies/records', { token, method: 'POST', body: JSON.stringify(technology) });
  }
}

console.log(`Seeded ${technologies.length} technologies at ${baseUrl}/api/collections/technologies/records.`);
