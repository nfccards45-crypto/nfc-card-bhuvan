const SUPABASE_URL = 'https://ybrhzwsquyzpnzwyvang.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlicmh6d3NxdXl6cG56d3l2YW5nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTExMzA5NjAsImV4cCI6MjEwNjcwNjk2MH0.W3F0fEx0umofiXI-zZV8wugWaHXnR3aVZSOYNvvHssE';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlicmh6d3NxdXl6cG56d3l2YW5nIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MTEzMDk2MCwiZXhwIjoyMTA2NzA2OTYwfQ.sTkNde_yWqEvRpj4nVRoaIFQQRFTNUK9QmitLNk19cc';

async function verify() {
  console.log('====================================================');
  console.log('VERIFYING NEW SUPABASE BACKEND (ybrhzwsquyzpnzwyvang)');
  console.log('====================================================');

  // 1. Verify Auth
  console.log('\n[1] Checking Auth User in NEW project:');
  const authRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
    headers: {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`
    }
  });
  if (authRes.ok) {
    const authData = await authRes.json();
    console.log(`✓ NEW Supabase Auth reachable. Users registered: ${authData.users.length}`);
    authData.users.forEach(u => console.log(`  - Admin: ${u.email} (Confirmed: ${!!u.email_confirmed_at})`));
  } else {
    console.log('✗ Auth verification failed:', await authRes.text());
  }

  // 2. Verify Cards Table
  console.log('\n[2] Checking public.cards table in NEW project:');
  const cardsRes = await fetch(`${SUPABASE_URL}/rest/v1/cards?select=*`, {
    headers: {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`
    }
  });
  if (cardsRes.ok) {
    const cards = await cardsRes.json();
    console.log(`✓ public.cards table exists! Current row count: ${cards.length}`);
    if (cards.length === 0) {
      console.log('✓ Clean database confirmed (0 old production records).');
    }
  } else {
    console.log('⚠ public.cards table not yet created in Supabase SQL editor.');
    console.log('  Response:', await cardsRes.text());
  }

  // 3. Verify RPC Function
  console.log('\n[3] Checking resolve_and_increment_scan RPC:');
  const rpcRes = await fetch(`${SUPABASE_URL}/rest/v1/rpc/resolve_and_increment_scan`, {
    method: 'POST',
    headers: {
      'apikey': ANON_KEY,
      'Authorization': `Bearer ${ANON_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ token_input: 'NONEXISTENT_TEST' })
  });
  if (rpcRes.ok) {
    const rpcData = await rpcRes.json();
    console.log('✓ RPC resolve_and_increment_scan exists and is callable by anon key! Result:', rpcData);
  } else {
    console.log('⚠ RPC function not yet deployed.');
  }

  // 4. Verify Edge Function
  console.log('\n[4] Checking Edge Function c resolver:');
  try {
    const fnRes = await fetch(`${SUPABASE_URL}/functions/v1/c/TESTTOKEN`);
    console.log(`✓ Edge Function c response status: ${fnRes.status} (${fnRes.statusText})`);
  } catch (err) {
    console.log('⚠ Edge function endpoint error:', err.message);
  }

  console.log('\n====================================================');
}

verify().catch(console.error);
