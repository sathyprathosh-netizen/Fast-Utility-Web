// ── UNIT CONVERTER ──
(function() {
  const conversions = {
    'temp-cf': { label: '°C → °F', fn: v => (v * 9/5) + 32, from: '°C', to: '°F' },
    'temp-fc': { label: '°F → °C', fn: v => (v - 32) * 5/9, from: '°F', to: '°C' },
    'kg-lb':   { label: 'KG → LBS', fn: v => v * 2.20462, from: 'kg', to: 'lbs' },
    'lb-kg':   { label: 'LBS → KG', fn: v => v / 2.20462, from: 'lbs', to: 'kg' },
    'km-mi':   { label: 'KM → Miles', fn: v => v * 0.621371, from: 'km', to: 'mi' },
    'mi-km':   { label: 'Miles → KM', fn: v => v / 0.621371, from: 'mi', to: 'km' },
    'cm-in':   { label: 'CM → Inches', fn: v => v / 2.54, from: 'cm', to: 'in' },
    'in-cm':   { label: 'Inches → CM', fn: v => v * 2.54, from: 'in', to: 'cm' },
    'l-gal':   { label: 'Liters → Gallons', fn: v => v * 0.264172, from: 'L', to: 'gal' },
    'gal-l':   { label: 'Gallons → Liters', fn: v => v / 0.264172, from: 'gal', to: 'L' },
  };

  window.convertUnit = function() {
    const type = document.getElementById('conv-type').value;
    const val = parseFloat(document.getElementById('conv-input').value);
    const outputEl = document.getElementById('conv-output');
    const unitFrom = document.getElementById('unit-from');
    const unitTo = document.getElementById('unit-to');

    const conv = conversions[type];
    if (!conv) return;
    unitFrom.textContent = conv.from;
    unitTo.textContent = conv.to;

    if (isNaN(val)) { outputEl.textContent = '—'; return; }

    const result = conv.fn(val);
    // animated number flip
    outputEl.style.opacity = '0';
    outputEl.style.transform = 'translateY(-8px)';
    setTimeout(() => {
      outputEl.textContent = Number.isInteger(result) ? result : result.toFixed(4);
      outputEl.style.opacity = '1';
      outputEl.style.transform = 'translateY(0)';
    }, 150);
  };

  // live conversion
  document.addEventListener('DOMContentLoaded', () => {
    const inp = document.getElementById('conv-input');
    const sel = document.getElementById('conv-type');
    if (inp) inp.addEventListener('input', window.convertUnit);
    if (sel) {
      sel.addEventListener('change', () => {
        window.convertUnit();
      });
      // init labels
      const conv = conversions[sel.value];
      if (conv) {
        document.getElementById('unit-from').textContent = conv.from;
        document.getElementById('unit-to').textContent = conv.to;
      }
    }
    // output transition
    const out = document.getElementById('conv-output');
    if (out) out.style.transition = 'opacity 0.15s, transform 0.15s';
  });
})();
