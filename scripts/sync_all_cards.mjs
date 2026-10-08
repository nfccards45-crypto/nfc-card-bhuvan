// Sync all cards from NEW Supabase (ybrhzwsquyzpnzwyvang) to OLD Supabase (hqabqueltgyhvcxxqebj)
const NEW_URL = 'https://ybrhzwsquyzpnzwyvang.supabase.co';
const NEW_SERVICE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlicmh6d3NxdXl6cG56d3l2YW5nIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MTEzMDk2MCwiZXhwIjoyMTA2NzA2OTYwfQ.sTkNde_yWqEvRpj4nVRoaIFQQRFTNUK9QmitLNk19cc';

const OLD_URL = 'https://hqabqueltgyhvcxxqebj.supabase.co';
const OLD_ANON = 'sb_publishable_QFfh1NVYRrKsgdkzzedbgg_RD3sBAIr';

async function main() {
  console.log('1. Authenticating with OLD Supabase...');
  const loginRes = await fetch(`${OLD_URL}/auth/v1/token?grant_type=password`, {
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
  if (!loginRes.ok) {
    throw new Error(`Failed to login to OLD Supabase: ${await loginRes.text()}`);
  }
  const { access_token: oldAuthToken } = await loginRes.json();
  console.log('   Authenticated successfully.');

  console.log('2. Fetching all cards from NEW Supabase...');
  const newRes = await fetch(`${NEW_URL}/rest/v1/cards?select=*`, {
    headers: {
      'apikey': NEW_SERVICE,
      'Authorization': `Bearer ${NEW_SERVICE}`,
    },
  });
  if (!newRes.ok) {
    throw new Error(`Failed to fetch cards from NEW Supabase: ${await newRes.text()}`);
  }
  const newCards = await newRes.json();
  console.log(`   Found ${newCards.length} cards in NEW Supabase.`);

  console.log('3. Syncing each card to OLD Supabase...');
  let successCount = 0;
  let failCount = 0;

  for (const card of newCards) {
    try {
      const res = await fetch(`${OLD_URL}/rest/v1/cards?public_token=eq.${card.public_token.toUpperCase()}`, {
        method: 'PATCH',
        headers: {
          'apikey': OLD_ANON,
          'Authorization': `Bearer ${oldAuthToken}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation',
        },
        body: JSON.stringify({
          destination_url: card.destination_url || 'https://www.google.com/',
          status: card.status || 'READY',
        }),
      });

      if (res.ok) {
        const rows = await res.json();
        if (rows.length > 0) {
          successCount++;
          console.log(`   [✓] ${card.internal_card_no} (${card.public_token}) -> ${card.destination_url || 'https://www.google.com/'}`);
        } else {
          // Card doesn't exist in old DB yet, insert it
          const insertRes = await fetch(`${OLD_URL}/rest/v1/cards`, {
            method: 'POST',
            headers: {
              'apikey': OLD_ANON,
              'Authorization': `Bearer ${oldAuthToken}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=representation',
            },
            body: JSON.stringify({
              internal_card_no: card.internal_card_no,
              public_token: card.public_token,
              destination_url: card.destination_url || 'https://www.google.com/',
              status: card.status || 'READY',
              scan_count: card.scan_count || 0,
            }),
          });
          if (insertRes.ok) {
            successCount++;
            console.log(`   [✓ Inserted] ${card.internal_card_no} (${card.public_token})`);
          } else {
            failCount++;
            console.error(`   [✗ Insert Failed] ${card.internal_card_no}:`, await insertRes.text());
          }
        }
      } else {
        failCount++;
        console.error(`   [✗ Error] ${card.internal_card_no}:`, await res.text());
      }
    } catch (e) {
      failCount++;
      console.error(`   [✗ Exception] ${card.internal_card_no}:`, e.message);
    }
  }

  console.log(`\nSync complete! Successfully synced: ${successCount}, Failed: ${failCount}`);
}

main().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
