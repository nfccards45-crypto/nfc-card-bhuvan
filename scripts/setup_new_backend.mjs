const SUPABASE_URL = 'https://ybrhzwsquyzpnzwyvang.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlicmh6d3NxdXl6cG56d3l2YW5nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTExMzA5NjAsImV4cCI6MjEwNjcwNjk2MH0.W3F0fEx0umofiXI-zZV8wugWaHXnR3aVZSOYNvvHssE';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlicmh6d3NxdXl6cG56d3l2YW5nIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MTEzMDk2MCwiZXhwIjoyMTA2NzA2OTYwfQ.sTkNde_yWqEvRpj4nVRoaIFQQRFTNUK9QmitLNk19cc';

async function setup() {
  console.log('--- 1. Setting up Admin User in NEW Supabase Auth ---');
  
  const adminEmail = 'admin@cardsync.io';
  const adminPassword = 'AdminPassword123!';

  // List users
  const listRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
    headers: {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`
    }
  });

  const listData = await listRes.json();
  const existingUser = (listData.users || []).find(u => u.email === adminEmail);

  if (existingUser) {
    console.log(`Admin user already exists in NEW project: ${existingUser.email} (ID: ${existingUser.id})`);
  } else {
    const createRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
      method: 'POST',
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
        user_metadata: {
          name: 'Master Admin',
          role: 'Admin'
        }
      })
    });

    if (createRes.ok) {
      const created = await createRes.json();
      console.log(`SUCCESS: Created Admin user in NEW project: ${created.email} (ID: ${created.id})`);
    } else {
      console.error('Failed to create admin user:', await createRes.text());
    }
  }

  // Verify login with Anon Key
  console.log('--- 2. Verifying Login with Anon Key on NEW Supabase ---');
  const loginRes = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: {
      'apikey': ANON_KEY,
      'Authorization': `Bearer ${ANON_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: adminEmail,
      password: adminPassword
    })
  });

  if (loginRes.ok) {
    const loginData = await loginRes.json();
    console.log('SUCCESS: Admin authentication verified! Access token issued for user:', loginData.user.email);
  } else {
    console.error('Login verification failed:', await loginRes.text());
  }
}

setup().catch(console.error);
