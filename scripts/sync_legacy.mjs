// Dual-Sync helper script: syncs card destination and status to the legacy Supabase instance
const OLD_URL = 'https://hqabqueltgyhvcxxqebj.supabase.co';
const OLD_ANON = 'sb_publishable_QFfh1NVYRrKsgdkzzedbgg_RD3sBAIr';

let cachedToken = null;
let tokenExpiresAt = 0;

export async function getLegacyAuthToken() {
  const now = Date.now();
  if (cachedToken && now < tokenExpiresAt - 60000) {
    return cachedToken;
  }
  const res = await fetch(`${OLD_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: {
      'apikey': OLD_ANON,
      'Authorization': `Bearer ${OLD_ANON}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'admin@cardsync.io',
      password: 'admin123',
    }),
  });
  if (!res.ok) {
    throw new Error(`Legacy auth failed: ${await res.text()}`);
  }
  const data = await res.json();
  cachedToken = data.access_token;
  tokenExpiresAt = now + (data.expires_in || 3600) * 1000;
  return cachedToken;
}

export async function syncCardToLegacy(token, destinationUrl, status) {
  try {
    const authToken = await getLegacyAuthToken();
    const body = {};
    if (destinationUrl !== undefined) body.destination_url = destinationUrl;
    if (status !== undefined) body.status = status;

    const res = await fetch(`${OLD_URL}/rest/v1/cards?public_token=eq.${token.toUpperCase()}`, {
      method: 'PATCH',
      headers: {
        'apikey': OLD_ANON,
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      console.warn(`[LegacySync] Warning updating ${token}:`, await res.text());
      return null;
    }
    const updated = await res.json();
    console.log(`[LegacySync] Successfully updated legacy card ${token} -> ${destinationUrl}`);
    return updated;
  } catch (err) {
    console.warn(`[LegacySync] Error syncing ${token}:`, err.message);
    return null;
  }
}

// If run directly:
if (process.argv[1]?.endsWith('sync_legacy.mjs')) {
  const token = process.argv[2] || 'KJEB9TKZ';
  const dest = process.argv[3] || 'https://www.google.com/';
  console.log(`Testing sync for ${token} -> ${dest}`);
  syncCardToLegacy(token, dest).then(r => console.log('Result:', r));
}
