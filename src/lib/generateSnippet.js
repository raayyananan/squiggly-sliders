// Generates a framework-specific snippet string for the SquigglySlider based on current UI state
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

function cssEscape(str) {
  return String(str).replace(/'/g, "\\'");
}

function generateSvelteSnippet(cfg) {
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

function generateReactSnippet(cfg) {
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

function generateWebComponentSnippet(cfg) {
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
    step = 1,
    disabled = false,
  } = cfg;

  const activeHex = resolveToHex(activeColor, '#616118');
  const passiveHex = resolveToHex(passiveColor, '#1c1c14');

  const attrs = [];
  attrs.push(`min="${min}"`);
  attrs.push(`max="${max}"`);
  attrs.push(`value="${value}"`);
  attrs.push(`active="${cssEscape(activeHex)}"`);
  attrs.push(`passive="${cssEscape(passiveHex)}"`);
  attrs.push(`active-amplitude="${activeAmplitude}"`);
  attrs.push(`passive-amplitude="${passiveAmplitude}"`);
  attrs.push(`active-wavelength="${activeWavelength}"`);
  attrs.push(`passive-wavelength="${passiveWavelength}"`);
  attrs.push(`speed-factor="${speedFactor}"`);
  if (step !== 1) attrs.push(`step="${step}"`);
  if (disabled) attrs.push('disabled');

  return `<squiggly-slider ${attrs.join(' ')}></squiggly-slider>`;
}

export function generateSnippet(cfg, importPath = 'squiggly-sliders', framework = 'svelte') {
  switch (framework) {
    case 'svelte':
      return generateSvelteSnippet(cfg);
    case 'react':
      return generateReactSnippet(cfg);
    case 'javascript':
      return generateWebComponentSnippet(cfg);
    default:
      return generateSvelteSnippet(cfg);
  }
}