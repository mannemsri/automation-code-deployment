const test = require('node:test');
const assert = require('node:assert');
const { createServer } = require('../src/app');

async function start(t) {
  const server = createServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  t.after(() => {
    server.closeAllConnections();
    server.close();
  });
  return `http://127.0.0.1:${server.address().port}`;
}

test('GET /health returns ok', async (t) => {
  const base = await start(t);
  const res = await fetch(`${base}/health`);
  assert.strictEqual(res.status, 200);
  assert.deepStrictEqual(await res.json(), { status: 'ok' });
});

test('GET / serves the home page', async (t) => {
  const base = await start(t);
  const res = await fetch(base);
  assert.strictEqual(res.status, 200);
  assert.match(await res.text(), /Deployed via GitHub Actions/);
});

test('unknown route returns 404', async (t) => {
  const base = await start(t);
  const res = await fetch(`${base}/nope`);
  assert.strictEqual(res.status, 404);
});
