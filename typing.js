// ── FAST-UTILITY HUB — Typing Tester Script ──

const QUOTES = [
  "The quick brown fox jumps over the lazy dog. Programming is the art of algorithm design and the craft of debugging errant code.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts. In the digital age, typing fast is a superpower.",
  "Web development requires a solid understanding of HTML, CSS, and modern JavaScript frameworks to build highly interactive and scaleable user interfaces.",
  "Design is not just what it looks like and feels like. Design is how it works. A user interface is like a joke; if you have to explain it, it's not that good."
];

let typingTimer = null;
let typingTimeLeft = 60;
let typingIsActive = false;
let typingOriginalText = "";
let typingCharIdx = 0;
let typingMistakes = 0;
let typingFinished = false;

function initTypingTest() {
  const typingBox = document.getElementById('typing-box');
  const typingDisplay = document.getElementById('typing-text-display');
  const typingInput = document.getElementById('typing-hidden-input');
  const wpmDisplay = document.getElementById('type-wpm');
  const accDisplay = document.getElementById('type-acc');
  const timeDisplay = document.getElementById('type-time');

  if (!typingBox || !typingDisplay || !typingInput) return;

  clearInterval(typingTimer);
  typingTimeLeft = 60;
  typingIsActive = false;
  typingFinished = false;
  typingCharIdx = 0;
  typingMistakes = 0;
  
  typingInput.value = "";
  typingInput.disabled = false;
  
  if(wpmDisplay) wpmDisplay.textContent = "0";
  if(accDisplay) accDisplay.textContent = "100";
  if(timeDisplay) timeDisplay.textContent = "60";
  
  typingOriginalText = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  
  typingDisplay.innerHTML = "";
  typingOriginalText.split("").forEach((char, index) => {
    let span = document.createElement("span");
    span.classList.add("typing-char");
    if (index === 0) span.classList.add("active");
    span.textContent = char;
    typingDisplay.appendChild(span);
  });

  // Focus input when clicking the box
  typingBox.onclick = () => {
    if (!typingFinished) {
      typingInput.focus();
    }
  };

  // Bind the input event (clean up old first)
  typingInput.removeEventListener('input', handleInput);
  typingInput.addEventListener('input', handleInput);
  
  // Bind focus/blur styles
  typingInput.addEventListener('blur', () => {
      typingBox.style.borderColor = "var(--glass-border)";
      typingBox.style.boxShadow = "none";
  });
  typingInput.addEventListener('focus', () => {
      if(!typingFinished) {
          typingBox.style.borderColor = "var(--accent-primary)";
          typingBox.style.boxShadow = "var(--neon-glow)";
      }
  });
}

function handleInput(e) {
  if (typingFinished) return;
  
  const typingInput = document.getElementById('typing-hidden-input');
  const typingDisplay = document.getElementById('typing-text-display');
  const wpmDisplay = document.getElementById('type-wpm');
  const accDisplay = document.getElementById('type-acc');
  const timeDisplay = document.getElementById('type-time');
  
  const typedVal = typingInput.value;

  if (!typingIsActive && typedVal.length > 0) {
    typingIsActive = true;
    typingTimer = setInterval(() => {
      if (typingTimeLeft > 0) {
        typingTimeLeft--;
        if(timeDisplay) timeDisplay.textContent = typingTimeLeft;
        calculateStats(wpmDisplay, accDisplay, typingInput);
      } else {
        finishTest(typingInput);
      }
    }, 1000);
  }

  if (typingTimeLeft <= 0) return;
  
  const chars = typingDisplay.querySelectorAll('.typing-char');
  
  typingMistakes = 0;
  typingCharIdx = typedVal.length;

  chars.forEach((charSpan, index) => {
    charSpan.classList.remove('correct', 'incorrect', 'active');
    
    if (index < typedVal.length) {
      if (charSpan.textContent === typedVal[index]) {
        charSpan.classList.add('correct');
      } else {
        charSpan.classList.add('incorrect');
        typingMistakes++;
      }
    } else if (index === typedVal.length) {
      charSpan.classList.add('active');
    }
  });

  if (typedVal.length >= typingOriginalText.length) {
    finishTest(typingInput);
  }
  
  calculateStats(wpmDisplay, accDisplay, typingInput);
}

function finishTest(inputEl) {
  clearInterval(typingTimer);
  typingIsActive = false;
  typingFinished = true;
  if(inputEl) inputEl.disabled = true;
  
  const box = document.getElementById('typing-box');
  if (box) {
      box.style.borderColor = "var(--glass-border)";
      box.style.boxShadow = "none";
  }
  
  // Remove cursor
  const activeChar = document.querySelector('.typing-char.active');
  if (activeChar) activeChar.classList.remove('active');
}

function calculateStats(wpmDisplay, accDisplay, typingInput) {
  const timeElapsed = 60 - typingTimeLeft;
  let wpm = 0;
  
  const typedLength = typingInput ? typingInput.value.length : typingCharIdx;
  const correctEntries = Math.max(0, typedLength - typingMistakes);
  
  if (timeElapsed > 0) {
    wpm = Math.round((correctEntries / 5) / (timeElapsed / 60));
  }
  
  const acc = typedLength > 0 ? Math.round((correctEntries / typedLength) * 100) : 100;
  
  if(wpmDisplay) wpmDisplay.textContent = Math.max(0, wpm);
  if(accDisplay) accDisplay.textContent = Math.max(0, acc);
}

window.resetTypingTest = () => {
    initTypingTest();
    // Auto focus on restart
    setTimeout(() => {
       const input = document.getElementById('typing-hidden-input');
       if(input) input.focus();
    }, 50);
};

document.addEventListener('DOMContentLoaded', initTypingTest);
