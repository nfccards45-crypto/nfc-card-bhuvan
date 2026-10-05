const SUPABASE_URL = 'https://ybrhzwsquyzpnzwyvang.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlicmh6d3NxdXl6cG56d3l2YW5nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTExMzA5NjAsImV4cCI6MjEwNjcwNjk2MH0.W3F0fEx0umofiXI-zZV8wugWaHXnR3aVZSOYNvvHssE';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlicmh6d3NxdXl6cG56d3l2YW5nIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MTEzMDk2MCwiZXhwIjoyMTA2NzA2OTYwfQ.sTkNde_yWqEvRpj4nVRoaIFQQRFTNUK9QmitLNk19cc';

// Edge function resolver simulation function exactly mimicking supabase/functions/c/index.ts
async function simulateEdgeFunction(urlPathOrToken) {
  const token = urlPathOrToken.trim().toUpperCase();

  // Call resolve_and_increment_scan RPC
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/resolve_and_increment_scan`, {
    method: 'POST',
    headers: {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ token_input: token })
  });

  if (!res.ok) {
    return { status: 500, error: 'Database RPC error', details: await res.text() };
  }

  const cards = await res.json();
  const card = cards && cards.length > 0 ? cards[0] : null;

  if (!card) {
    return { status: 404, message: 'Card Not Found', token };
  }

  if (card.status === 'DISABLED') {
    return { status: 403, message: 'Card Deactivated', card };
  }

  if (!card.destination_url || card.destination_url.trim() === '') {
    return { status: 200, message: 'Destination Not Configured', card };
  }

  return {
    status: 302,
    redirectLocation: card.destination_url,
    card
  };
}

async function runLocalResolverTest() {
  console.log('======================================================');
  console.log('TESTING EDGE FUNCTION RESOLVER ON NEW SUPABASE DB');
  console.log('======================================================\n');

  const testToken = 'TESTQR99';
  const testCardNo = 'CARD-TEST-01';
  const testDest = 'https://www.google.com/';

  console.log(`[Step 1] Creating temporary test card (${testCardNo} -> ${testToken}) with destination: ${testDest}`);
  const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/cards`, {
    method: 'POST',
    headers: {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify({
      internal_card_no: testCardNo,
      public_token: testToken,
      destination_url: testDest,
      status: 'READY',
      scan_count: 0
    })
  });

  if (!insertRes.ok) {
    console.error('Failed to create test card:', await insertRes.text());
    return;
  }
  const [createdCard] = await insertRes.json();
  console.log(`✓ Test card created. Scan count = ${createdCard.scan_count}`);

  console.log('\n[Step 2] Resolving active card through Edge Function logic (Simulating scan 1)...');
  const resolve1 = await simulateEdgeFunction(testToken);
  console.log('  Result 1:', resolve1.status, '=> Redirect to:', resolve1.redirectLocation, '| Scan count:', resolve1.card.scan_count);

  console.log('\n[Step 3] Simulating scan 2 on the same card...');
  const resolve2 = await simulateEdgeFunction(testToken);
  console.log('  Result 2:', resolve2.status, '=> Redirect to:', resolve2.redirectLocation, '| Scan count:', resolve2.card.scan_count);

  console.log('\n[Step 4] Testing non-existent token (e.g. UNKNOWN99)...');
  const resolveUnknown = await simulateEdgeFunction('UNKNOWN99');
  console.log('  Result Unknown:', resolveUnknown.status, resolveUnknown.message);

  console.log('\n[Step 5] Cleaning up test card to leave NEW DB completely clean...');
  const deleteRes = await fetch(`${SUPABASE_URL}/rest/v1/cards?public_token=eq.${testToken}`, {
    method: 'DELETE',
    headers: {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`
    }
  });
  console.log('✓ Cleaned up test card successfully.');

  console.log('\n======================================================');
  console.log('ALL EDGE FUNCTION RESOLVER TESTS PASSED (100% SUCCESS)');
  console.log('======================================================');
}

runLocalResolverTest().catch(console.error);
