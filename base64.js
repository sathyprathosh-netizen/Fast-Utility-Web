// ── IMAGE TO BASE64 CONVERTER ──
(function() {
  window.handleImageDrop = function(e) {
    e.preventDefault();
    const zone = document.getElementById('drag-zone');
    zone.classList.remove('dragover');
    const file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    if (file && file.type.startsWith('image/')) processImage(file);
  };

  window.handleDragOver = function(e) {
    e.preventDefault();
    document.getElementById('drag-zone').classList.add('dragover');
  };

  window.handleDragLeave = function() {
    document.getElementById('drag-zone').classList.remove('dragover');
  };

  function processImage(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const base64 = e.target.result;
      
      const defaultView = document.getElementById('drag-zone-default');
      const previewView = document.getElementById('drag-zone-preview');
      const previewImg = document.getElementById('img-preview');
      const info = document.getElementById('img-info');

      if (defaultView) defaultView.style.display = 'none';
      if (previewView) previewView.style.display = 'flex';
      if (previewImg) previewImg.src = base64;
      if (info) info.textContent = `${file.name} · ${(file.size/1024).toFixed(1)} KB`;

      // typing animation for output
      const output = document.getElementById('b64-output');
      output.textContent = '';
      const short = base64.substring(0, 80) + '...';
      let i = 0;
      const interval = setInterval(() => {
        output.textContent += short[i] || '';
        i++;
        if (i >= short.length) {
          clearInterval(interval);
          output.dataset.full = base64;
          output.classList.add('reveal');
        }
      }, 12);
    };
    reader.readAsDataURL(file);
  }

  window.copyBase64 = function(btn) {
    const output = document.getElementById('b64-output');
    const full = output.dataset.full;
    if (!full) return;
    navigator.clipboard.writeText(full).then(() => {
      btn.classList.add('copied');
      btn.textContent = '✓ Copied!';
      setTimeout(() => { btn.classList.remove('copied'); btn.textContent = '⎘ Copy Base64'; }, 2000);
    });
  };

  window.copyImgTag = function(btn) {
    const output = document.getElementById('b64-output');
    const full = output.dataset.full;
    if (!full) return;
    const tag = `<img src="${full}" alt="image">`;
    navigator.clipboard.writeText(tag).then(() => {
      btn.classList.add('copied');
      btn.textContent = '✓ Copied!';
      setTimeout(() => { btn.classList.remove('copied'); btn.textContent = '⎘ Copy <img> Tag'; }, 2000);
    });
  };
})();
