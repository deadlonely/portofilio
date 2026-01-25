// Optional helper: verify token returned in query (if you set up a landing redirect)
(function(){
  try {
    var params = new URLSearchParams(window.location.search);
    if (params.has('turnstile')){
      var token = params.get('turnstile');
      fetch('/api/verify-turnstile', {
        method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ token })
      }).then(r=>r.json()).then(j=>{
        if (j && j.success){ localStorage.setItem('captcha_passed','1'); window.location.href='/'; }
      }).catch(console.error);
    }
  } catch(e){console.error(e);} 
})();
