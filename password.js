// ── PASSWORD GENERATOR ──
(function() {
  const lengthSlider = document.getElementById('pw-length');
  const lengthVal = document.getElementById('pw-length-val');
  const outputEl = document.getElementById('pw-output');
  const strengthFill = document.getElementById('pw-strength-fill');
  const strengthLabel = document.getElementById('pw-strength-label');

  if (!lengthSlider) return;

  lengthSlider.addEventListener('input', () => {
    lengthVal.textContent = lengthSlider.value;
  });

  window.generatePassword = function() {
    const len = +lengthSlider.value;
    const useSymbols = document.getElementById('pw-symbols').checked;
    const useNumbers = document.getElementById('pw-numbers').checked;
    const useUpper = document.getElementById('pw-upper').checked;

    let chars = 'abcdefghijklmnopqrstuvwxyz';
    if (useUpper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (useNumbers) chars += '0123456789';
    if (useSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let pw = '';
    const arr = new Uint32Array(len);
    crypto.getRandomValues(arr);
    for (let i = 0; i < len; i++) pw += chars[arr[i] % chars.length];

    outputEl.textContent = '';
    outputEl.classList.remove('reveal');
    // typewriter effect
    let i = 0;
    const interval = setInterval(() => {
      outputEl.textContent += pw[i];
      i++;
      if (i >= pw.length) { clearInterval(interval); outputEl.classList.add('reveal'); }
    }, 20);

    // strength
    let score = 0;
    if (len >= 12) score++;
    if (len >= 20) score++;
    if (useUpper) score++;
    if (useNumbers) score++;
    if (useSymbols) score++;

    const levels = [
      { pct: '20%', color: '#FF6B6B', label: 'Very Weak' },
      { pct: '40%', color: '#FFB347', label: 'Weak' },
      { pct: '60%', color: '#FFD700', label: 'Fair' },
      { pct: '80%', color: '#90EE90', label: 'Strong' },
      { pct: '100%', color: '#00FFC6', label: 'Very Strong' },
    ];
    const lvl = levels[Math.min(score, 4)];
    strengthFill.style.width = lvl.pct;
    strengthFill.style.background = lvl.color;
    strengthLabel.textContent = lvl.label;
    strengthLabel.style.color = lvl.color;
  };

  window.copyPassword = function(btn) {
    const text = outputEl.textContent;
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      btn.classList.add('copied');
      btn.textContent = '✓ Copied!';
      setTimeout(() => { btn.classList.remove('copied'); btn.textContent = '⎘ Copy'; }, 2000);
    });
  };
})();
