// ── QR CODE GENERATOR ──
(function() {
  let qrInstance = null;

  window.generateQR = function() {
    const input = document.getElementById('qr-input').value.trim();
    if (!input) return;

    const output = document.getElementById('qr-output');
    output.innerHTML = '';

    const div = document.createElement('div');
    div.style.cssText = 'animation: qrReveal 0.4s cubic-bezier(0.34,1.56,0.64,1) both; transform-origin: center;';
    output.appendChild(div);

    if (!document.getElementById('qr-style-anim')) {
      const style = document.createElement('style');
      style.id = 'qr-style-anim';
      style.textContent = '@keyframes qrReveal { from { opacity:0; transform:scale(0.7) rotate(-5deg); } to { opacity:1; transform:scale(1) rotate(0); } }';
      document.head.appendChild(style);
    }

    try {
      new QRCode(div, {
        text: input,
        width: 160,
        height: 160,
        colorDark: '#00FFC6',
        colorLight: '#161B22',
        correctLevel: QRCode.CorrectLevel.M
      });
      document.getElementById('qr-download-btn').style.display = 'inline-flex';
      document.getElementById('qr-copy-btn').style.display = 'inline-flex';
    } catch(e) {
      output.innerHTML = '<p style="color:#FF6B6B">Failed to generate QR</p>';
    }
  };

  window.downloadQR = function() {
    const canvas = document.querySelector('#qr-output canvas');
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  window.copyQR = function(btn) {
    const canvas = document.querySelector('#qr-output canvas');
    if (!canvas) return;
    canvas.toBlob(blob => {
      navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]).then(() => {
        btn.classList.add('copied');
        btn.textContent = '✓ Copied!';
        setTimeout(() => { btn.classList.remove('copied'); btn.textContent = '⎘ Copy Image'; }, 2000);
      });
    });
  };

  // enter key
  document.addEventListener('DOMContentLoaded', () => {
    const inp = document.getElementById('qr-input');
    if (inp) inp.addEventListener('keydown', e => { if (e.key === 'Enter') window.generateQR(); });
  });
})();
