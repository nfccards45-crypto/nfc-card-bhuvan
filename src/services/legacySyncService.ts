/**
 * Legacy Supabase Synchronizer
 * 
 * Ensures that whenever a destination or status is updated in the CRM,
 * the change is also immediately pushed to the legacy Supabase instance
 * (hqabqueltgyhvcxxqebj).
 * 
 * This ensures that physical PRINTED QR cards (which route to dynamic-qr-1.vercel.app -> hqabqueltgyhvcxxqebj)
 * always update instantly when edited in this CRM.
 */

const LEGACY_URL = 'https://hqabqueltgyhvcxxqebj.supabase.co';
const LEGACY_ANON = 'sb_publishable_QFfh1NVYRrKsgdkzzedbgg_RD3sBAIr';
const LEGACY_ADMIN_EMAIL = 'admin@cardsync.io';
const LEGACY_ADMIN_PASS = 'admin123';

let cachedLegacyToken: string | null = null;
let tokenExpiryTimestamp = 0;

async function getLegacyAuthToken(): Promise<string | null> {
  const now = Date.now();
  if (cachedLegacyToken && now < tokenExpiryTimestamp - 60000) {
    return cachedLegacyToken;
  }

  try {
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
      console.warn('[LegacySync] Auth request failed:', res.status, await res.text());
      return null;
    }

    const data = await res.json();
    cachedLegacyToken = data.access_token;
    tokenExpiryTimestamp = now + (data.expires_in || 3600) * 1000;
    return cachedLegacyToken;
  } catch (err) {
    console.warn('[LegacySync] Exception obtaining legacy token:', err);
    return null;
  }
}

export const legacySyncService = {
  /**
   * Sync a single card's destination and/or status to the legacy Supabase database
   */
  async syncCard(publicToken: string, destinationUrl?: string, status?: string): Promise<boolean> {
    if (!publicToken) return false;
    const cleanToken = publicToken.trim().toUpperCase();

    try {
      const token = await getLegacyAuthToken();
      if (!token) return false;

      const body: Record<string, string> = {};
      if (destinationUrl !== undefined) body.destination_url = destinationUrl;
      if (status !== undefined) body.status = status;

      const res = await fetch(`${LEGACY_URL}/rest/v1/cards?public_token=eq.${cleanToken}`, {
        method: 'PATCH',
        headers: {
          'apikey': LEGACY_ANON,
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation',
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        console.warn(`[LegacySync] Failed to patch card ${cleanToken}:`, await res.text());
        return false;
      }

      console.info(`[LegacySync] ✓ Successfully synced printed card ${cleanToken} to legacy backend`);
      return true;
    } catch (err) {
      console.warn(`[LegacySync] Error syncing card ${cleanToken}:`, err);
      return false;
    }
  },

  /**
   * Bulk sync an array of cards
   */
  async syncCardsBulk(cards: Array<{ token: string; destinationUrl?: string; status?: string }>): Promise<void> {
    if (!cards || !cards.length) return;
    try {
      const token = await getLegacyAuthToken();
      if (!token) return;

      await Promise.all(
        cards.map(async c => {
          if (!c.token) return;
          const body: Record<string, string> = {};
          if (c.destinationUrl !== undefined) body.destination_url = c.destinationUrl;
          if (c.status !== undefined) body.status = c.status;

          try {
            await fetch(`${LEGACY_URL}/rest/v1/cards?public_token=eq.${c.token.trim().toUpperCase()}`, {
              method: 'PATCH',
              headers: {
                'apikey': LEGACY_ANON,
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(body),
            });
          } catch (e) {
            console.warn(`[LegacySync] Bulk sync error for ${c.token}:`, e);
          }
        })
      );
      console.info(`[LegacySync] ✓ Bulk synced ${cards.length} cards to legacy backend`);
    } catch (err) {
      console.warn('[LegacySync] Exception in bulk sync:', err);
    }
  },
};
