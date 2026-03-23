// ── AMBIENT NOISE GENERATOR ──
(function() {
  let audioCtx = null;
  let activeNodes = [];
  let currentType = null;

  function getCtx() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return audioCtx;
  }

  function stopAll() {
    activeNodes.forEach(n => { try { n.stop(); } catch(e) {} });
    activeNodes = [];
    currentType = null;
    document.querySelectorAll('.noise-btn').forEach(b => b.classList.remove('active'));
  }

  function makeWhiteNoise(ctx) {
    const bufferSize = ctx.sampleRate * 3;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const gain = ctx.createGain();
    gain.gain.value = 0.15;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 3000;

    source.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
    source.start();
    return source;
  }

  function makeRain(ctx) {
    // Rain = filtered noise + occasional drops
    const bufferSize = ctx.sampleRate * 3;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const source = ctx.createBufferSource();
    source.buffer = buffer; source.loop = true;

    const gain = ctx.createGain(); gain.gain.value = 0.12;
    const hpf = ctx.createBiquadFilter(); hpf.type = 'highpass'; hpf.frequency.value = 400;
    const lpf = ctx.createBiquadFilter(); lpf.type = 'lowpass'; lpf.frequency.value = 8000;

    source.connect(hpf); hpf.connect(lpf); lpf.connect(gain); gain.connect(ctx.destination);
    source.start();
    return source;
  }

  function makeCoffeeShop(ctx) {
    // Layered brown noise simulation
    const bufferSize = ctx.sampleRate * 4;
    const buffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate);

    for (let c = 0; c < 2; c++) {
      const data = buffer.getChannelData(c);
      let b0=0, b1=0, b2=0, b3=0, b4=0, b5=0, b6=0;
      for (let i = 0; i < bufferSize; i++) {
        const wn = Math.random() * 2 - 1;
        b0 = 0.99886*b0 + wn*0.0555179; b1 = 0.99332*b1 + wn*0.0750759;
        b2 = 0.96900*b2 + wn*0.1538520; b3 = 0.86650*b3 + wn*0.3104856;
        b4 = 0.55000*b4 + wn*0.5329522; b5 = -0.7616*b5 - wn*0.0168980;
        data[i] = (b0+b1+b2+b3+b4+b5+b6 + wn*0.5362) * 0.11;
        b6 = wn * 0.115926;
      }
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer; source.loop = true;
    const gain = ctx.createGain(); gain.gain.value = 0.3;
    source.connect(gain); gain.connect(ctx.destination);
    source.start();
    return source;
  }

  window.playNoise = function(type, btn) {
    if (currentType === type) { stopAll(); return; }
    stopAll();

    const ctx = getCtx();
    if (ctx.state === 'suspended') ctx.resume();

    let source;
    if (type === 'white') source = makeWhiteNoise(ctx);
    else if (type === 'rain') source = makeRain(ctx);
    else if (type === 'coffee') source = makeCoffeeShop(ctx);

    if (source) {
      activeNodes.push(source);
      currentType = type;
      if (btn) btn.classList.add('active');
    }
  };
})();
