// ── FAST-UTILITY HUB
// ── PREMIUM ANIMATIONS: MOUSE TRACKING ──
document.addEventListener('mousemove', (e) => {
  const spotlight = document.getElementById('cursor-spotlight');
  if (spotlight) {
    spotlight.style.left = e.clientX + 'px';
    spotlight.style.top = e.clientY + 'px';
  }

  // Update mouse position for all tool cards (for the glass shine effect)
  const cards = document.querySelectorAll('.tool-card');
  cards.forEach(card => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  });
});

// ── INITIALIZATION ──
document.addEventListener('DOMContentLoaded', () => {

  // ── TYPING ANIMATION ──
  const phrases = ['Generate Passwords', 'Create QR Codes', 'Convert Units', 'Focus with Pomodoro', 'Encode Images to Base64', 'Play Ambient Sounds'];
  let phraseIdx = 0, charIdx = 0, deleting = false;
  const typingEl = document.getElementById('typing-text');

  function typeLoop() {
    if (!typingEl) return;
    const current = phrases[phraseIdx];
    if (!deleting) {
      typingEl.textContent = current.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) { deleting = true; setTimeout(typeLoop, 1800); return; }
    } else {
      typingEl.textContent = current.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) { deleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; }
    }
    setTimeout(typeLoop, deleting ? 60 : 90);
  }
  typeLoop();

  // ── SCROLL REVEAL (STAGGERED) ──
  const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Find visible sections in the same viewport to stagger them
        const delay = index * 80; 
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  document.querySelectorAll('.fade-in-section').forEach(el => observer.observe(el));

  // ── CARD 3D TILT EFFECT ──
  const TILT_DEGREE = 8;
  document.querySelectorAll('.tool-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -TILT_DEGREE;
      const rotateY = ((x - centerX) / centerX) * TILT_DEGREE;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
    });
  });



  // ── SEARCH ──
  const searchInput = document.getElementById('tool-search');
  if (searchInput) {
    searchInput.addEventListener('input', debounce(() => {
      const q = searchInput.value.toLowerCase();
      document.querySelectorAll('.tool-card').forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(q) ? '' : 'none';
      });
    }, 200));
  }

  // ── KEYBOARD SHORTCUTS ──
  const shortcutsPanel = document.getElementById('shortcuts-panel');
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
      switch(e.key) {
        case '/':
          e.preventDefault();
          if (shortcutsPanel) shortcutsPanel.classList.toggle('show');
          break;
        case 'k':
          e.preventDefault();
          if (searchInput) { searchInput.focus(); searchInput.select(); }
          break;

      }
    }
    if (e.key === 'Escape' && shortcutsPanel) shortcutsPanel.classList.remove('show');
  });
  document.getElementById('shortcuts-btn')?.addEventListener('click', () => {
    shortcutsPanel?.classList.toggle('show');
  });

  // ── TIPS ROTATION ──
  const tips = [
    { num: '01', text: 'Use <span class="tip-highlight">Ctrl + Shift + T</span> to instantly reopen the last browser tab you accidentally closed.' },
    { num: '02', text: 'In Google, wrap your search in <span class="tip-highlight">"quotes"</span> to find an exact phrase match, cutting through noise.' },
    { num: '03', text: 'Most smartphones have a <span class="tip-highlight">Do Not Disturb</span> schedule. Set it 1 hour before bed for better sleep.' },
    { num: '04', text: 'Add <span class="tip-highlight">+anything</span> to your Gmail (e.g. name+news@gmail.com) to track who sells your data.' },
    { num: '05', text: 'You can open and edit PDFs directly in <span class="tip-highlight">Microsoft Word</span> or <span class="tip-highlight">Google Docs</span> — no extra software needed.' },
  ];

  let tipIdx = 0;
  const tipCard = document.getElementById('tip-card');
  const tipDots = document.querySelectorAll('.tip-dot');

  function showTip(idx) {
    tipIdx = idx;
    if (!tipCard) return;
    const tip = tips[idx];
    tipCard.innerHTML = `<div class="tip-number">TIP #${tip.num}</div><p class="tip-text">${tip.text}</p>`;
    tipCard.style.animation = 'none'; void tipCard.offsetWidth;
    tipCard.style.animation = '';
    tipDots.forEach((d, i) => d.classList.toggle('active', i === idx));
  }

  tipDots.forEach((dot, i) => dot.addEventListener('click', () => showTip(i)));
  showTip(0);
  
  let tipInterval;
  function startTipRotation() {
    tipInterval = setInterval(() => showTip((tipIdx + 1) % tips.length), 5000);
  }
  function stopTipRotation() {
    clearInterval(tipInterval);
  }

  startTipRotation();

  if (tipCard) {
    let touchStartX = 0;
    let touchEndX = 0;
    let wheelCooldown = false;

    tipCard.addEventListener('mouseenter', stopTipRotation);
    tipCard.addEventListener('mouseleave', startTipRotation);
    
    // ── TOUCH SWIPE (mobile) ──
    tipCard.addEventListener('touchstart', (e) => {
      stopTipRotation();
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    tipCard.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleTipSwipe();
      startTipRotation();
    }, { passive: true });

    function handleTipSwipe() {
      const swipeThreshold = 40;
      if (touchEndX < touchStartX - swipeThreshold) {
        showTip((tipIdx + 1) % tips.length);
      } else if (touchEndX > touchStartX + swipeThreshold) {
        showTip((tipIdx - 1 + tips.length) % tips.length);
      }
    }

    // ── TRACKPAD / MOUSE WHEEL SWIPE (desktop) ──
    // Listen on the whole sidebar tip area so no click required
    const sidebarTip = tipCard.closest('.sidebar-tip') || tipCard;
    sidebarTip.addEventListener('wheel', (e) => {
      if (wheelCooldown) { e.preventDefault(); return; }
      const deltaH = e.deltaX;  // horizontal scroll from trackpad two-finger swipe
      const deltaV = e.deltaY;
      // Only act on predominantly horizontal movement
      if (Math.abs(deltaH) < 15 && Math.abs(deltaV) < 15) return;
      if (Math.abs(deltaH) >= Math.abs(deltaV) || !e.shiftKey) {
        if (Math.abs(deltaH) < 10 && !e.shiftKey) return;
        e.preventDefault();
        stopTipRotation();
        if (deltaH > 10 || (e.shiftKey && deltaV > 0)) {
          showTip((tipIdx + 1) % tips.length); // scroll right → next
        } else if (deltaH < -10 || (e.shiftKey && deltaV < 0)) {
          showTip((tipIdx - 1 + tips.length) % tips.length); // scroll left → prev
        }
        wheelCooldown = true;
        setTimeout(() => {
          wheelCooldown = false;
          startTipRotation();
        }, 800);
      }
    }, { passive: false });
  }

  // ── ACCORDION ──
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const isOpen = header.classList.contains('open');
      document.querySelectorAll('.accordion-header').forEach(h => {
        h.classList.remove('open');
        h.nextElementSibling?.classList.remove('open');
      });
      if (!isOpen) {
        header.classList.add('open');
        header.nextElementSibling?.classList.add('open');
      }
    });
  });

  // ── RIPPLE on buttons ──
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn');
    if (!btn) return;
    const ripple = document.createElement('span');
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.cssText = `position:absolute;width:${size}px;height:${size}px;top:${e.clientY-rect.top-size/2}px;left:${e.clientX-rect.left-size/2}px;background:rgba(255,255,255,0.2);border-radius:50%;transform:scale(0);animation:ripple 0.5s linear;pointer-events:none;`;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 500);
  });
  if (!document.getElementById('ripple-style')) {
    const s = document.createElement('style');
    s.id = 'ripple-style';
    s.textContent = '@keyframes ripple { to { transform:scale(4); opacity:0; } }';
    document.head.appendChild(s);
  }

  // ── HERO CTA scroll ──
  document.getElementById('hero-cta')?.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('tools-section')?.scrollIntoView({ behavior: 'smooth' });
  });

});

// ── UTILITY ──
function debounce(fn, delay) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
}

// ── ZONE SWITCHING ──
window.switchZone = function(zoneId, btn) {
  document.querySelectorAll('.zone-wrapper').forEach(zone => {
    zone.classList.remove('active-zone');
  });
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
  });
  
  const target = document.getElementById(zoneId);
  if (target) {
    target.classList.add('active-zone');
    
    // Toggle sidebar icons: only show for Identity zone (zone-1)
    const iconsSidebar = document.getElementById('sidebar-icons-container');
    if (iconsSidebar) {
      iconsSidebar.style.display = (zoneId === 'zone-1') ? 'block' : 'none';
    }

    // Scroll to the top of the tools grid if scrolled past
    const toolsSection = document.getElementById('tools-section');
    if (toolsSection) {
      const yOffset = toolsSection.getBoundingClientRect().top + window.scrollY - 100;
      if (window.scrollY > yOffset) {
        window.scrollTo({ top: yOffset, behavior: 'smooth' });
      }
    }
  }
  
  if (btn) btn.classList.add('active');
};

// ── ICON SHOWCASE LOGIC ──
window.showIconCode = function(iconName, element) {
  const display = document.getElementById('icon-code-display');
  const text = document.getElementById('icon-code-text');
  
  if (!display || !text) return;
  
  // Highlight active chip
  document.querySelectorAll('.icon-chip').forEach(chip => chip.classList.remove('active'));
  element.classList.add('active');
  
  // Update and show code
  const snippet = `<span class="material-symbols-outlined">${iconName}</span>`;
  text.textContent = snippet;
  display.classList.remove('icon-code-hidden');
  display.classList.add('icon-code-visible');
  
  // Also trigger copy immediately
  window.copyIconCode();
};

window.copyIconCode = function() {
  const textElement = document.getElementById('icon-code-text');
  if (!textElement) return;
  // Box text might be "Copied!" or the snippet
  const boxText = textElement.textContent;
  if (boxText === "Copied!") return; // Avoid double triggering
  
  // Extract icon name from snippet e.g. <span...>name</span>
  const match = boxText.match(/>(.*)<\/span>/);
  const iconName = match ? match[1] : boxText;
  const snippet = `<span class="material-symbols-outlined">${iconName}</span>`;
  
  const performCopy = (txt) => {
    // UI Feedback: show Copied! then restore snippet
    const originalSnippet = snippet;
    textElement.textContent = `Copied!`;
    textElement.style.color = 'var(--accent-primary)';
    
    setTimeout(() => {
      if (textElement.textContent === 'Copied!') {
        textElement.textContent = originalSnippet;
      }
    }, 1500);
  };

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(snippet).then(() => performCopy(iconName)).catch(() => fallbackCopy(snippet));
  } else {
    fallbackCopy(snippet);
  }

  function fallbackCopy(txt) {
    const textArea = document.createElement("textarea");
    textArea.value = txt;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    textArea.style.top = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      performCopy(iconName);
    } catch (err) {
      console.error('Fallback copy failed', err);
    }
    document.body.removeChild(textArea);
  }
};
