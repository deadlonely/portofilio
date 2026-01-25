// Local-only verification: set local flag and redirect
function onTurnstileSuccess(token) {
  try {
    localStorage.setItem('captcha_passed', '1');
    window.location.href = '/';
  } catch (e) {
    console.error('Local turnstile callback error', e);
  }
}

window.onTurnstileSuccess = onTurnstileSuccess;

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('local-verify-btn');
  if (btn) {
    btn.style.display = '';
    btn.addEventListener('click', () => {
      try {
        localStorage.setItem('captcha_passed', '1');
        window.location.href = '/';
      } catch (e) {
        console.error('Local verify error', e);
        const msg = document.getElementById('captcha-msg');
        if (msg) msg.textContent = 'Verification error. Check console.';
      }
    });
  }
});
