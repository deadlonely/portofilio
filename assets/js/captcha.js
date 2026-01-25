// Client-side Turnstile handler for captcha.html (server-verified)
function onTurnstileSuccess(token) {
  // POST token to server-side verify endpoint
  fetch('/api/verify-turnstile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token })
  }).then(r => r.json()).then(json => {
    if (json && json.success) {
      localStorage.setItem('captcha_passed', '1');
      window.location.href = '/';
    } else {
      const msg = document.getElementById('captcha-msg');
      if (msg) msg.textContent = 'Verification failed. Try again.';
      console.warn('Turnstile verification failed', json);
    }
  }).catch(err => {
    console.error('Verification request failed', err);
    const msg = document.getElementById('captcha-msg');
    if (msg) msg.textContent = 'Verification error. Check console.';
  });
}

// Expose to global for Turnstile callback
window.onTurnstileSuccess = onTurnstileSuccess;

// If page contains a legacy local verify button, remove its handler
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('local-verify-btn');
  if (btn) btn.style.display = 'none';
});
