// Vercel Serverless Function: Sync card destination and status to legacy Supabase
const LEGACY_URL = 'https://hqabqueltgyhvcxxqebj.supabase.co';
const LEGACY_ANON = 'sb_publishable_QFfh1NVYRrKsgdkzzedbgg_RD3sBAIr';
const LEGACY_ADMIN_EMAIL = 'admin@cardsync.io';
const LEGACY_ADMIN_PASS = 'admin123';

let cachedToken = null;
let tokenExpiry = 0;

async function getLegacyToken() {
  const now = Date.now();
  if (cachedToken && now < tokenExpiry - 60000) {
    return cachedToken;
  }
  const res = await fetch(`${LEGACY_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: {
      'apikey': LEGACY_ANON,
      'Authorization': `Bearer ${LEGACY_ANON}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: LEGACY_ADMIN_EMAIL,
      password: LEGACY_ADMIN_PASS,
    }),
  });
  if (!res.ok) {
    throw new Error(`Legacy login failed: ${await res.text()}`);
  }
  const data = await res.json();
  cachedToken = data.access_token;
  tokenExpiry = now + (data.expires_in || 3600) * 1000;
  return cachedToken;
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { token, destination_url, status } = req.body || {};
    if (!token) {
      return res.status(400).json({ error: 'Missing token' });
    }

    const cleanToken = token.trim().toUpperCase();
    const authToken = await getLegacyToken();

    const body = {};
    if (destination_url !== undefined) body.destination_url = destination_url;
    if (status !== undefined) body.status = status;

    const patchRes = await fetch(`${LEGACY_URL}/rest/v1/cards?public_token=eq.${cleanToken}`, {
      method: 'PATCH',
      headers: {
        'apikey': LEGACY_ANON,
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify(body),
    });

    if (!patchRes.ok) {
      const errText = await patchRes.text();
      console.error('[API LegacySync] Patch error:', errText);
      return res.status(500).json({ error: errText });
    }

    const updated = await patchRes.json();
    return res.status(200).json({ success: true, card: updated });
  } catch (err) {
    console.error('[API LegacySync] Exception:', err);
    return res.status(500).json({ error: err.message });
  }
}
