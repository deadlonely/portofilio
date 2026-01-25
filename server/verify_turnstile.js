// Example Express server to verify Cloudflare Turnstile tokens
// Usage: set TURNSTILE_SECRET env var and run `node verify_turnstile.js`
const express = require('express');
const fetch = require('node-fetch');
const app = express();
app.use(express.json());
app.use(function(req,res,next){
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  next();
});

app.post('/api/verify-turnstile', async (req, res) => {
  try {
    const token = req.body && req.body.token;
    if (!token) return res.status(400).json({ success: false, error: 'missing_token' });
    const secret = process.env.TURNSTILE_SECRET;
    if (!secret) return res.status(500).json({ success: false, error: 'server_missing_secret' });

    const params = new URLSearchParams();
    params.append('secret', secret);
    params.append('response', token);

    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: params
    });
    const json = await r.json();
    return res.json(json);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: 'server_error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Turnstile verify server running on port', PORT));
// Example Express server to verify Cloudflare Turnstile tokens
// Usage: set environment variable TURNSTILE_SECRET to your secret and run `node verify_turnstile.js`

const express = require('express');
const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));
const app = express();
app.use(express.json());

const SECRET = process.env.TURNSTILE_SECRET;
if (!SECRET) {
  console.warn('Warning: TURNSTILE_SECRET not set. Verification will fail until you set it.');
}

app.post('/api/verify-turnstile', async (req, res) => {
  const token = req.body.token;
  if (!token) return res.status(400).json({ success: false, error: 'missing-token' });

  try {
    const params = new URLSearchParams();
    params.append('secret', SECRET || '');
    params.append('response', token);

    const resp = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: params
    });
    const json = await resp.json();
    if (json.success) {
      // Here you would normally process the contact form (send email, store message, etc.)
      return res.json({ success: true });
    }
    return res.status(403).json({ success: false, error: json['error-codes'] || 'verification-failed' });
  } catch (e) {
    console.error('Verification request error', e);
    return res.status(500).json({ success: false, error: 'server-error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Turnstile verify server running on port ${PORT}`));
// Example Express server to verify Cloudflare Turnstile tokens
// Usage: set TURNSTILE_SECRET env var and run `node verify_turnstile.js`
const express = require('express');
const fetch = require('node-fetch');
const app = express();
app.use(express.json());
app.use(function(req,res,next){
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  next();
});

app.post('/api/verify-turnstile', async (req, res) => {
  try {
    const token = req.body && req.body.token;
    if (!token) return res.status(400).json({ success: false, error: 'missing_token' });
    const secret = process.env.TURNSTILE_SECRET;
    if (!secret) return res.status(500).json({ success: false, error: 'server_missing_secret' });

    const params = new URLSearchParams();
    params.append('secret', secret);
    params.append('response', token);

    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: params
    });
    const json = await r.json();
    return res.json(json);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: 'server_error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Turnstile verify server running on port', PORT));
// Example Express server to verify Cloudflare Turnstile tokens
// Usage: set environment variable TURNSTILE_SECRET to your secret and run `node verify_turnstile.js`

const express = require('express');
const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));
const app = express();
app.use(express.json());

const SECRET = process.env.TURNSTILE_SECRET;
if (!SECRET) {
  console.warn('Warning: TURNSTILE_SECRET not set. Verification will fail until you set it.');
}

app.post('/api/verify-turnstile', async (req, res) => {
  const token = req.body.token;
  if (!token) return res.status(400).json({ success: false, error: 'missing-token' });

  try {
    const params = new URLSearchParams();
    params.append('secret', SECRET || '');
    params.append('response', token);

    const resp = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: params
    });
    const json = await resp.json();
    if (json.success) {
      // Here you would normally process the contact form (send email, store message, etc.)
      return res.json({ success: true });
    }
    return res.status(403).json({ success: false, error: json['error-codes'] || 'verification-failed' });
  } catch (e) {
    console.error('Verification request error', e);
    return res.status(500).json({ success: false, error: 'server-error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Turnstile verify server running on port ${PORT}`));
