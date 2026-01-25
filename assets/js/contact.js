document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('cf-status');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    try {
      const passed = localStorage.getItem('captcha_passed') === '1';
      if (!passed) {
        status.textContent = 'Please complete verification first.';
        status.style.color = '#ffcccb';
        return;
      }

      // Simulate sending: display success message and clear form
      const name = form.querySelector('#cf-name').value;
      status.textContent = 'Message sent. Thanks, ' + (name || '') + '!';
      status.style.color = '#9ee7b7';
      form.reset();
    } catch (err) {
      console.error('Contact form error', err);
      status.textContent = 'Error sending message.';
      status.style.color = '#ffcccb';
    }
  });
});
