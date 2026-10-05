// Vercel Serverless Function: Dynamic Card Redirect Handler
// Replaces the Supabase Edge Function (which was never deployed)
// Path: /api/c/[token] → looks up card by public_token → 302 redirect to destination_url

// Vercel serverless functions do NOT have access to VITE_ prefixed env vars at runtime.
// Use non-prefixed env vars set in Vercel Dashboard, or fallback to hardcoded values.
const SUPABASE_URL =
  process.env.SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  'https://ybrhzwsquyzpnzwyvang.supabase.co';

const SUPABASE_API_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlicmh6d3NxdXl6cG56d3l2YW5nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTExMzA5NjAsImV4cCI6MjEwNjcwNjk2MH0.W3F0fEx0umofiXI-zZV8wugWaHXnR3aVZSOYNvvHssE';

function renderHtmlErrorPage(title, message, detail, statusCode = 404) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} | Dynamic Card Resolver</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: #020617;
      color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
    }
    .card {
      background: #0f172a;
      border: 1px solid #1e293b;
      border-radius: 1rem;
      max-width: 480px;
      width: 100%;
      padding: 2rem;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      text-align: center;
    }
    .badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      background: rgba(239, 68, 68, 0.15);
      color: #f87171;
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 1rem;
    }
    h1 {
      font-size: 1.5rem;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 0.75rem;
    }
    p {
      color: #94a3b8;
      font-size: 0.95rem;
      line-height: 1.5;
      margin-bottom: 1.5rem;
    }
    .detail {
      background: #020617;
      border: 1px solid #334155;
      border-radius: 0.5rem;
      padding: 0.75rem 1rem;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 0.85rem;
      color: #38bdf8;
      word-break: break-all;
      margin-bottom: 1.5rem;
    }
    .footer {
      font-size: 0.75rem;
      color: #64748b;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">Notice</div>
    <h1>${title}</h1>
    <p>${message}</p>
    ${detail ? `<div class="detail">${detail}</div>` : ''}
    <div class="footer">Dynamic QR + NFC Infrastructure</div>
  </div>
</body>
</html>`;

  return {
    statusCode,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
    body: html,
  };
}

module.exports = async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    return res.status(204).end();
  }

  // Extract token from dynamic route parameter
  const { token } = req.query;
  const cleanToken = (token || '').trim().toUpperCase();

  if (!cleanToken) {
    const err = renderHtmlErrorPage(
      'Missing Card Token',
      'No public card token was provided in the URL.',
      undefined,
      400
    );
    return res.status(err.statusCode).setHeader('Content-Type', err.headers['Content-Type']).send(err.body);
  }

  // Verify we have valid config
  if (!SUPABASE_URL || !SUPABASE_API_KEY) {
    console.error('Missing SUPABASE_URL or API key environment variables.');
    const err = renderHtmlErrorPage(
      'Server Configuration Error',
      'The server is temporarily misconfigured. Please contact administrator.',
      undefined,
      500
    );
    return res.status(err.statusCode).setHeader('Content-Type', err.headers['Content-Type']).send(err.body);
  }

  try {
    // Call the resolve_and_increment_scan RPC via Supabase REST API
    const rpcResponse = await fetch(`${SUPABASE_URL}/rest/v1/rpc/resolve_and_increment_scan`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_API_KEY,
        'Authorization': `Bearer ${SUPABASE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token_input: cleanToken }),
    });

    if (!rpcResponse.ok) {
      const errText = await rpcResponse.text();
      console.error('Database RPC error:', rpcResponse.status, errText);
      const err = renderHtmlErrorPage(
        'Database Error',
        'An unexpected error occurred while resolving this card.',
        undefined,
        500
      );
      return res.status(err.statusCode).setHeader('Content-Type', err.headers['Content-Type']).send(err.body);
    }

    const cards = await rpcResponse.json();
    const card = cards && cards.length > 0 ? cards[0] : null;

    // 1. Unknown token / Card not found
    if (!card) {
      const err = renderHtmlErrorPage(
        'Card Not Found',
        'The scanned card token does not match any registered card in the system.',
        `Token: ${cleanToken}`,
        404
      );
      return res.status(err.statusCode).setHeader('Content-Type', err.headers['Content-Type']).send(err.body);
    }

    // 2. Disabled Card
    if (card.status === 'DISABLED') {
      const err = renderHtmlErrorPage(
        'Card Deactivated',
        'This dynamic NFC/QR card has been deactivated by the administrator.',
        `Card: ${card.internal_card_no}`,
        403
      );
      return res.status(err.statusCode).setHeader('Content-Type', err.headers['Content-Type']).send(err.body);
    }

    // 3. Missing / Unconfigured destination URL
    if (!card.destination_url || card.destination_url.trim() === '') {
      const err = renderHtmlErrorPage(
        'Destination Not Configured',
        'This card is active, but its destination URL has not been assigned yet.',
        `Card: ${card.internal_card_no}`,
        200
      );
      return res.status(err.statusCode).setHeader('Content-Type', err.headers['Content-Type']).send(err.body);
    }

    // 4. Validate URL protocol
    const destination = card.destination_url.trim();
    try {
      const parsedUrl = new URL(destination);
      if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
        throw new Error('Invalid protocol');
      }
    } catch {
      const err = renderHtmlErrorPage(
        'Invalid Destination URL',
        'The configured target URL is malformed.',
        destination,
        500
      );
      return res.status(err.statusCode).setHeader('Content-Type', err.headers['Content-Type']).send(err.body);
    }

    // 5. Successful HTTP 302 Dynamic Redirection
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Location', destination);
    return res.status(302).end();

  } catch (err) {
    console.error('Unhandled resolver exception:', err);
    const errPage = renderHtmlErrorPage(
      'Resolution Failed',
      'Unable to complete the dynamic redirection request.',
      undefined,
      500
    );
    return res.status(errPage.statusCode).setHeader('Content-Type', errPage.headers['Content-Type']).send(errPage.body);
  }
}
