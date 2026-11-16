// Node.js 22+. Creates the collection without adding fictional work history.
const baseUrl = (process.env.POCKETBASE_URL || 'https://www.thomasgriffin.dev').replace(/\/$/, '');
const identity = process.env.POCKETBASE_ADMIN_EMAIL;
const password = process.env.POCKETBASE_ADMIN_PASSWORD;
if (!identity || !password) throw new Error('Set POCKETBASE_ADMIN_EMAIL and POCKETBASE_ADMIN_PASSWORD.');

async function request(path, { token, ...options } = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: token } : {}) },
    signal: AbortSignal.timeout(15000),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(`PocketBase HTTP ${response.status}: ${JSON.stringify(data)}`);
    error.status = response.status;
    throw error;
  }
  return data;
}

const { token } = await request('/api/collections/_superusers/auth-with-password', {
  method: 'POST', body: JSON.stringify({ identity, password }),
});
let collection;
try {
  collection = await request('/api/collections/experiences', { token });
} catch (error) {
  if (error.status !== 404) throw error;
  collection = await request('/api/collections', {
    token, method: 'POST',
    body: JSON.stringify({
      name: 'experiences', type: 'base', listRule: '', viewRule: '',
      createRule: null, updateRule: null, deleteRule: null,
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'company', type: 'text', required: true },
        { name: 'duration', type: 'text', required: true },
        { name: 'description', type: 'text', required: true },
        { name: 'display_order', type: 'number', onlyInt: true, min: 0 },
      ],
    }),
  });
}

for (const [name, type] of [['title', 'text'], ['company', 'text'], ['duration', 'text'], ['description', 'text'], ['display_order', 'number']]) {
  if (!collection.fields.some((field) => field.name === name && field.type === type)) {
    throw new Error(`Existing experiences collection needs a ${type} field named ${name}.`);
  }
}
if (collection.listRule !== '' || collection.viewRule !== '') {
  throw new Error('Allow public List and View access to experiences in PocketBase so the website can read it.');
}
console.log('Experiences collection is ready. Add roles in PocketBase; lower display_order values appear first.');
