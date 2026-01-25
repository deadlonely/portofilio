Cloudflare Turnstile integration

1) Get keys
- Go to https://dash.cloudflare.com/ -> Security -> Bots -> Turnstile (or https://www.cloudflare.com/turnstile/) and register your site.
- Copy the *Site Key* and *Secret Key*.

2) Frontend
- Open `index.html` and replace `YOUR_SITE_KEY` in the `<div class="cf-turnstile" data-sitekey="YOUR_SITE_KEY"></div>` with your Site Key.
- The page already includes the Turnstile client script.

3) Server verification
- Turnstile requires server-side verification. A simple example server is provided at `server/verify_turnstile.js`.
- Set environment variable `TURNSTILE_SECRET` to your Secret Key and run the server:

```bash
export TURNSTILE_SECRET=your_secret_here
node server/verify_turnstile.js
```

(Windows PowerShell: `$env:TURNSTILE_SECRET = 'your_secret_here'` then `node ...`)

- The client posts to `/api/verify-turnstile` with payload {name,email,message,token}. The example verifies token and responds with `{success:true}` on success.

4) Deploy
- If you host your static site on a separate host (GitHub Pages, Netlify), you must host the verification endpoint somewhere (VPS, serverless function, etc.) and update the client fetch URL in `assets/js/captcha.js` to point to that endpoint.

5) Notes
- Do not put the Secret Key into frontend code. Keep it on the server.
- The example server does not send emails; add your email or storage logic after successful verification.
