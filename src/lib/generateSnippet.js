// Generates a Svelte snippet string for the SquigglySlider based on current UI state
// Pure utility; reads computed styles in browser to resolve CSS variables to hex

function rgbToHex(rgbString) {
  if (!rgbString) return '';
  const nums = rgbString.match(/\d+\.?\d*/g);
  if (!nums || nums.length < 3) return '';
  const [r, g, b] = nums.map((n) => Math.max(0, Math.min(255, Math.round(parseFloat(n)))));
  const hex = (n) => n.toString(16).padStart(2, '0');
  return `#${hex(r)}${hex(g)}${hex(b)}`;
}

function resolveToHex(input, fallback = '#616118') {
  if (typeof window === 'undefined' || typeof document === 'undefined') return fallback;
  if (!input) return fallback;
  if (typeof input === 'string' && input.startsWith('#')) return input;
  if (typeof input === 'string' && input.startsWith('--')) {
    const v = getComputedStyle(document.documentElement).getPropertyValue(input).trim();
    const hex = v.startsWith('rgb') ? rgbToHex(v) : v;
    return hex && hex.startsWith('#') ? hex : fallback;
  }
  return fallback;
}

export function generateSnippet(cfg, importPath = 'squiggly-sliders') {
  const {
    activeColor,
    passiveColor,
    activeAmplitude,
    passiveAmplitude,
    activeWavelength,
    passiveWavelength,
    speedFactor,
    value,
    min = 0,
    max = 10,
    step = 1
  } = cfg;

  const activeHex = resolveToHex(activeColor, '#616118');
  const passiveHex = resolveToHex(passiveColor, '#1c1c14');

  const lines = [];
  lines.push('<script>');
  lines.push(`  import SquigglySlider from '${importPath}';`);
  lines.push('</script>');
  lines.push('');
  lines.push('<SquigglySlider');
  lines.push(`  min={${min}}`);
  lines.push(`  max={${max}}`);
  lines.push(`  value={${value}}`);
  lines.push(`  active={'${cssEscape(activeHex)}'}`);
  lines.push(`  passive={'${cssEscape(passiveHex)}'}`);
  lines.push(`  activeAmplitude={${activeAmplitude}}`);
  lines.push(`  passiveAmplitude={${passiveAmplitude}}`);
  lines.push(`  activeWavelength={${activeWavelength}}`);
  lines.push(`  passiveWavelength={${passiveWavelength}}`);
  lines.push(`  speedFactor={${speedFactor}}`);
  if (step !== 1) lines.push(`  step={${step}}`);
  lines.push('/>');

  return lines.join('\n');
}

function cssEscape(str) {
  return String(str).replace(/'/g, "\\'");
}
