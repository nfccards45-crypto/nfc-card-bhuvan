const SUPABASE_URL = 'https://ybrhzwsquyzpnzwyvang.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlicmh6d3NxdXl6cG56d3l2YW5nIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MTEzMDk2MCwiZXhwIjoyMTA2NzA2OTYwfQ.sTkNde_yWqEvRpj4nVRoaIFQQRFTNUK9QmitLNk19cc';

async function wipeDatabaseToZero() {
  console.log('--- Wiping NEW Supabase public.cards Table to 0 Rows ---');
  
  const delRes = await fetch(`${SUPABASE_URL}/rest/v1/cards?id=neq.00000000-0000-0000-0000-000000000000`, {
    method: 'DELETE',
    headers: {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`
    }
  });

  console.log('Delete response status:', delRes.status, delRes.statusText);

  // Check count
  const checkRes = await fetch(`${SUPABASE_URL}/rest/v1/cards?select=*`, {
    headers: {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`
    }
  });

  if (checkRes.ok) {
    const cards = await checkRes.json();
    console.log(`✓ Current row count in NEW Supabase public.cards: ${cards.length}`);
    if (cards.length === 0) {
      console.log('✓ SUCCESS: Database is completely empty (0 rows) and ready for fresh testing!');
    }
  } else {
    console.error('Failed to query cards:', await checkRes.text());
  }
}

wipeDatabaseToZero().catch(console.error);
