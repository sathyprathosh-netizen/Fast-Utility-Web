// ── POMODORO TIMER ──
(function() {
  const WORK_TIME = 9 * 60 * 60; // 9 Hours
  const BREAK_TIME = 1 * 60 * 60; // 1 Hour

  let timeLeft = WORK_TIME;
  let totalTime = WORK_TIME;
  let running = false;
  let isBreak = false;
  let intervalId = null;
  let startTimestamp = null;
  let pausedRemaining = WORK_TIME;

  const ring = document.getElementById('pomo-ring');
  const timeEl = document.getElementById('pomo-time');
  const modeEl = document.getElementById('pomo-mode');
  const startBtn = document.getElementById('pomo-start');

  const CIRCUMFERENCE = 2 * Math.PI * 70; // r=70
  if (ring) ring.style.strokeDasharray = CIRCUMFERENCE;

  function formatTime(s) {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    if (h > 0) {
      return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
    }
    return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
  }

  function updateRing(left, total) {
    if (!ring) return;
    const progress = left / total;
    const offset = CIRCUMFERENCE * (1 - progress);
    ring.style.strokeDashoffset = offset;
  }

  function tick() {
    if (!running) return;
    const now = Date.now();
    const elapsed = Math.floor((now - startTimestamp) / 1000);
    timeLeft = Math.max(0, pausedRemaining - elapsed);

    if (timeEl) timeEl.textContent = formatTime(timeLeft);
    updateRing(timeLeft, totalTime);

    if (timeLeft <= 0) {
      clearInterval(intervalId);
      running = false;
      playEndSound();
      // auto-switch
      setTimeout(() => {
        isBreak = !isBreak;
        totalTime = isBreak ? BREAK_TIME : WORK_TIME;
        timeLeft = totalTime;
        pausedRemaining = totalTime;
        if (modeEl) modeEl.textContent = isBreak ? 'BREAK' : 'WORK';
        if (ring) ring.classList.toggle('break-mode', isBreak);
        if (timeEl) timeEl.textContent = formatTime(timeLeft);
        updateRing(timeLeft, totalTime);
        if (startBtn) startBtn.textContent = '▶ Start';
        document.querySelectorAll('.pomo-tab').forEach((t,i) => t.classList.toggle('active', isBreak ? i===1 : i===0));
      }, 500);
    }
  }

  function playEndSound() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'sine'; osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
      osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 1.5);
    } catch(e) {}
  }

  window.togglePomodoro = function() {
    if (!running) {
      startTimestamp = Date.now();
      pausedRemaining = timeLeft;
      running = true;
      intervalId = setInterval(tick, 250);
      if (startBtn) startBtn.textContent = '⏸ Pause';
    } else {
      clearInterval(intervalId);
      pausedRemaining = timeLeft;
      running = false;
      if (startBtn) startBtn.textContent = '▶ Resume';
    }
  };

  window.resetPomodoro = function() {
    clearInterval(intervalId);
    running = false;
    isBreak = false;
    totalTime = WORK_TIME;
    timeLeft = WORK_TIME;
    pausedRemaining = WORK_TIME;
    if (timeEl) timeEl.textContent = formatTime(WORK_TIME);
    if (modeEl) modeEl.textContent = 'WORK';
    if (ring) { ring.style.strokeDashoffset = 0; ring.classList.remove('break-mode'); }
    if (startBtn) startBtn.textContent = '▶ Start';
    document.querySelectorAll('.pomo-tab').forEach((t,i) => t.classList.toggle('active', i===0));
  };

  window.setPomoMode = function(isBreakMode) {
    clearInterval(intervalId);
    running = false;
    isBreak = isBreakMode;
    totalTime = isBreak ? BREAK_TIME : WORK_TIME;
    timeLeft = totalTime;
    pausedRemaining = totalTime;
    if (timeEl) timeEl.textContent = formatTime(timeLeft);
    if (modeEl) modeEl.textContent = isBreak ? 'BREAK' : 'WORK';
    if (ring) { ring.style.strokeDashoffset = 0; ring.classList.toggle('break-mode', isBreak); }
    if (startBtn) startBtn.textContent = '▶ Start';
  };

  // Page visibility — use timestamp-based approach so timer stays accurate
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && running) tick();
  });

  // init display
  if (timeEl) timeEl.textContent = formatTime(WORK_TIME);
  updateRing(WORK_TIME, WORK_TIME);
})();
