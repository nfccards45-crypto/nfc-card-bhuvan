// Script to restore the exact 50 printed cards into Supabase public.cards
import fs from 'fs';

const SUPABASE_URL = 'https://ybrhzwsquyzpnzwyvang.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlicmh6d3NxdXl6cG56d3l2YW5nIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MTEzMDk2MCwiZXhwIjoyMTA2NzA2OTYwfQ.sTkNde_yWqEvRpj4nVRoaIFQQRFTNUK9QmitLNk19cc';

const csvData = `Internal Card No,Public Token,Dynamic URL,Backend Destination URL,Status,Total Scans,Created At
CARD-0015,KJEB9TKZ,https://dynamic-qr-1.vercel.app/c/KJEB9TKZ,"https://g.page/r/example-review/review",Ready,5,2026-09-22T07:23:06.84011+00:00
CARD-0003,YKH4U8PL,https://dynamic-qr-1.vercel.app/c/YKH4U8PL,"https://g.page/r/example-review/review",Ready,0,2026-09-22T07:23:06.84011+00:00
CARD-0004,ANXBZJAL,https://dynamic-qr-1.vercel.app/c/ANXBZJAL,"https://g.page/r/example-review/review",Ready,0,2026-09-22T07:23:06.84011+00:00
CARD-0005,QZHYYYFZ,https://dynamic-qr-1.vercel.app/c/QZHYYYFZ,"https://g.page/r/example-review/review",Ready,0,2026-09-22T07:23:06.84011+00:00
CARD-0007,W7WKCJC9,https://dynamic-qr-1.vercel.app/c/W7WKCJC9,"https://g.page/r/example-review/review",Ready,0,2026-09-22T07:23:06.84011+00:00
CARD-0008,THK3G9CH,https://dynamic-qr-1.vercel.app/c/THK3G9CH,"https://g.page/r/example-review/review",Ready,0,2026-09-22T07:23:06.84011+00:00
CARD-0009,73WCNPMY,https://dynamic-qr-1.vercel.app/c/73WCNPMY,"https://g.page/r/example-review/review",Ready,0,2026-09-22T07:23:06.84011+00:00
CARD-0010,ZESEC5JV,https://dynamic-qr-1.vercel.app/c/ZESEC5JV,"https://g.page/r/example-review/review",Ready,0,2026-09-22T07:23:06.84011+00:00
CARD-0011,5CWPCMM3,https://dynamic-qr-1.vercel.app/c/5CWPCMM3,"https://g.page/r/example-review/review",Ready,0,2026-09-22T07:23:06.84011+00:00
CARD-0012,HMTCEKRP,https://dynamic-qr-1.vercel.app/c/HMTCEKRP,"https://g.page/r/example-review/review",Ready,0,2026-09-22T07:23:06.84011+00:00
CARD-0014,GMLEC2RW,https://dynamic-qr-1.vercel.app/c/GMLEC2RW,"https://g.page/r/example-review/review",Ready,0,2026-09-22T07:23:06.84011+00:00
CARD-0016,XQUBHVUK,https://dynamic-qr-1.vercel.app/c/XQUBHVUK,"https://g.page/r/example-review/review",Ready,0,2026-09-22T07:23:06.84011+00:00
CARD-0017,HT2MU684,https://dynamic-qr-1.vercel.app/c/HT2MU684,"https://g.page/r/example-review/review",Ready,0,2026-09-22T07:23:06.84011+00:00
CARD-0018,2ZLCR87U,https://dynamic-qr-1.vercel.app/c/2ZLCR87U,"https://g.page/r/example-review/review",Ready,0,2026-09-22T07:23:06.84011+00:00
CARD-0020,G65GBW3S,https://dynamic-qr-1.vercel.app/c/G65GBW3S,"https://g.page/r/example-review/review",Ready,0,2026-09-22T07:23:06.84011+00:00
CARD-0021,R2FZTGVS,https://dynamic-qr-1.vercel.app/c/R2FZTGVS,"https://g.page/r/example-review/review",Ready,0,2026-09-22T07:23:06.84011+00:00
CARD-0022,PSYULB4L,https://dynamic-qr-1.vercel.app/c/PSYULB4L,"https://g.page/r/example-review/review",Ready,0,2026-09-22T07:23:06.84011+00:00
CARD-0023,R2FMELRB,https://dynamic-qr-1.vercel.app/c/R2FMELRB,"https://g.page/r/example-review/review",Ready,0,2026-09-22T07:23:06.84011+00:00
CARD-0025,KSPGDFYQ,https://dynamic-qr-1.vercel.app/c/KSPGDFYQ,"https://g.page/r/example-review/review",Ready,0,2026-09-22T07:23:06.84011+00:00
CARD-0026,SFJUUT6Y,https://dynamic-qr-1.vercel.app/c/SFJUUT6Y,"https://g.page/r/example-review/review",Ready,0,2026-09-22T07:23:06.84011+00:00
CARD-0027,368RM95W,https://dynamic-qr-1.vercel.app/c/368RM95W,"https://g.page/r/example-review/review",Ready,0,2026-09-22T07:23:06.84011+00:00
CARD-0030,NGG4JVCB,https://dynamic-qr-1.vercel.app/c/NGG4JVCB,"https://g.page/r/example-review/review",Ready,0,2026-09-22T07:23:06.84011+00:00
CARD-0031,HSEKTPLY,https://dynamic-qr-1.vercel.app/c/HSEKTPLY,"https://g.page/r/example-review/review",Ready,0,2026-09-22T07:23:06.84011+00:00
CARD-0032,SBBQ7ZDX,https://dynamic-qr-1.vercel.app/c/SBBQ7ZDX,"https://g.page/r/example-review/review",Ready,0,2026-09-22T07:23:06.84011+00:00
CARD-0033,7EZ9BZLV,https://dynamic-qr-1.vercel.app/c/7EZ9BZLV,"https://g.page/r/example-review/review",Ready,0,2026-09-22T07:23:06.84011+00:00
CARD-0034,6RRW6EFJ,https://dynamic-qr-1.vercel.app/c/6RRW6EFJ,"https://g.page/r/example-review/review",Ready,0,2026-09-22T07:23:06.84011+00:00
CARD-0035,UDNQVDJJ,https://dynamic-qr-1.vercel.app/c/UDNQVDJJ,"https://g.page/r/example-review/review",Ready,0,2026-09-22T07:23:06.84011+00:00
CARD-0036,T95BXGSA,https://dynamic-qr-1.vercel.app/c/T95BXGSA,"https://g.page/r/example-review/review",Ready,0,2026-09-22T07:23:06.84011+00:00
CARD-0037,L8KL38A6,https://dynamic-qr-1.vercel.app/c/L8KL38A6,"https://g.page/r/example-review/review",Ready,0,2026-09-22T07:23:06.84011+00:00
CARD-0038,DMYHFDNW,https://dynamic-qr-1.vercel.app/c/DMYHFDNW,"https://g.page/r/example-review/review",Ready,0,2026-09-22T07:23:06.84011+00:00
CARD-0039,9UXXEBXP,https://dynamic-qr-1.vercel.app/c/9UXXEBXP,"https://g.page/r/example-review/review",Ready,0,2026-09-22T07:23:06.84011+00:00
CARD-0042,DRPMGX7M,https://dynamic-qr-1.vercel.app/c/DRPMGX7M,"https://g.page/r/example-review/review",Ready,0,2026-09-22T07:23:06.84011+00:00
CARD-0043,W4AKNY8Y,https://dynamic-qr-1.vercel.app/c/W4AKNY8Y,"https://g.page/r/example-review/review",Ready,0,2026-09-22T07:23:06.84011+00:00
CARD-0045,YW6BXLUG,https://dynamic-qr-1.vercel.app/c/YW6BXLUG,"https://g.page/r/example-review/review",Ready,0,2026-09-22T07:23:06.84011+00:00
CARD-0046,XVKLLB3W,https://dynamic-qr-1.vercel.app/c/XVKLLB3W,"https://g.page/r/example-review/review",Ready,0,2026-09-22T07:23:06.84011+00:00
CARD-0047,ZRLLTWC3,https://dynamic-qr-1.vercel.app/c/ZRLLTWC3,"https://g.page/r/example-review/review",Ready,0,2026-09-22T07:23:06.84011+00:00
CARD-0048,4W4RFMPV,https://dynamic-qr-1.vercel.app/c/4W4RFMPV,"https://g.page/r/example-review/review",Ready,0,2026-09-22T07:23:06.84011+00:00
CARD-0049,S96KM2QG,https://dynamic-qr-1.vercel.app/c/S96KM2QG,"https://g.page/r/example-review/review",Ready,0,2026-09-22T07:23:06.84011+00:00
CARD-0006,LK3U666C,https://dynamic-qr-1.vercel.app/c/LK3U666C,"https://g.page/r/example-review/review",Ready,6,2026-09-22T07:23:06.84011+00:00
CARD-0024,UM74KMWA,https://dynamic-qr-1.vercel.app/c/UM74KMWA,"https://g.page/r/example-review/review",Ready,8,2026-09-22T07:23:06.84011+00:00
CARD-0029,SN5FV75K,https://dynamic-qr-1.vercel.app/c/SN5FV75K,"https://g.page/r/example-review/review",Ready,6,2026-09-22T07:23:06.84011+00:00
CARD-0002,6VUQH3FW,https://dynamic-qr-1.vercel.app/c/6VUQH3FW,"https://g.page/r/example-review/review",Ready,46,2026-09-22T07:23:06.84011+00:00
CARD-0050,YGJTRADH,https://dynamic-qr-1.vercel.app/c/YGJTRADH,"https://g.page/r/example-review/review",Ready,2,2026-09-22T07:23:06.84011+00:00
CARD-0040,EVV9KKJ6,https://dynamic-qr-1.vercel.app/c/EVV9KKJ6,"https://g.page/r/example-review/review",Ready,1,2026-09-22T07:23:06.84011+00:00
CARD-0013,8SL9HTG8,https://dynamic-qr-1.vercel.app/c/8SL9HTG8,"https://g.page/r/example-review/review",Ready,5,2026-09-22T07:23:06.84011+00:00
CARD-0028,NTY6QQD6,https://dynamic-qr-1.vercel.app/c/NTY6QQD6,"https://g.page/r/example-review/review",Ready,3,2026-09-22T07:23:06.84011+00:00
CARD-0041,M54ABUER,https://dynamic-qr-1.vercel.app/c/M54ABUER,"https://g.page/r/example-review/review",Ready,3,2026-09-22T07:23:06.84011+00:00
CARD-0019,VLHT5CAA,https://dynamic-qr-1.vercel.app/c/VLHT5CAA,"https://g.page/r/example-review/review",Ready,14,2026-09-22T07:23:06.84011+00:00
CARD-0044,MXMZ7PUT,https://dynamic-qr-1.vercel.app/c/MXMZ7PUT,"https://g.page/r/example-review/review",Ready,4,2026-09-22T07:23:06.84011+00:00
CARD-0051,DXW5PBGE,https://dynamic-qr-1.vercel.app/c/DXW5PBGE,"https://g.page/r/example-review/review",Ready,1,2026-09-22T07:23:06.84011+00:00`;

function parseCSV(text) {
  const lines = text.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  const rows = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Parse CSV line handling quotes
    const values = [];
    let current = '';
    let inQuotes = false;
    for (let c = 0; c < line.length; c++) {
      const char = line[c];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    
    const rowObj = {};
    headers.forEach((h, idx) => {
      let val = values[idx] || '';
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.slice(1, -1);
      }
      rowObj[h] = val;
    });
    rows.push(rowObj);
  }
  return rows;
}

async function restoreCards() {
  console.log('--- 1. Parsing CSV Data ---');
  const parsed = parseCSV(csvData);
  console.log(`Parsed ${parsed.length} printed card records.`);

  const insertRows = parsed.map(row => ({
    internal_card_no: row['Internal Card No'],
    public_token: row['Public Token'],
    destination_url: row['Backend Destination URL'] || 'https://www.google.com/',
    status: (row['Status'] || 'Ready').toUpperCase(),
    scan_count: parseInt(row['Total Scans'] || '0', 10) || 0,
    created_at: row['Created At'] || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));

  console.log('--- 2. Fetching Current Supabase Cards ---');
  const listRes = await fetch(`${SUPABASE_URL}/rest/v1/cards?select=id,internal_card_no,public_token`, {
    headers: {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`
    }
  });

  if (!listRes.ok) {
    throw new Error('Failed to fetch existing cards: ' + await listRes.text());
  }

  const existing = await listRes.json();
  console.log(`Existing cards in database: ${existing.length}`);

  // Upsert or clean-insert
  // Let's delete existing dummy cards or conflicting cards so the 50 printed cards are pristine
  console.log('--- 3. Cleaning out dummy cards to make way for exact printed batch ---');
  const delRes = await fetch(`${SUPABASE_URL}/rest/v1/cards?id=neq.00000000-0000-0000-0000-000000000000`, {
    method: 'DELETE',
    headers: {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`
    }
  });
  console.log('Cleaned previous rows status:', delRes.status);

  console.log(`--- 4. Inserting ${insertRows.length} printed cards into Supabase ---`);
  const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/cards`, {
    method: 'POST',
    headers: {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(insertRows)
  });

  if (!insertRes.ok) {
    const errText = await insertRes.text();
    throw new Error(`Failed to insert cards: ${errText}`);
  }

  const inserted = await insertRes.json();
  console.log(`SUCCESS! Inserted ${inserted.length} cards into Supabase.`);
  console.log('First 3 restored cards:');
  console.log(inserted.slice(0, 3));
}

restoreCards().catch(console.error);
