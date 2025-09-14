// Generates a Svelte snippet string for the SquigglySlider based on current UI state
// Keep pure (no side-effects), only reads from document for computed values

function getComputedVarValue(name) {
  if (typeof document === 'undefined') return '';
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

export function generateSnippet(cfg, importPath = 'squiggly-sliders', includeThemeVars = false) {
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
  } = cfg;

  const cssVarNames = [];
  if (typeof activeColor === 'string' && activeColor.startsWith('--')) cssVarNames.push(activeColor);
  if (typeof passiveColor === 'string' && passiveColor.startsWith('--') && passiveColor !== activeColor) cssVarNames.push(passiveColor);

  const themeVars = {};
  if (includeThemeVars && cssVarNames.length) {
    for (const varName of cssVarNames) {
      const v = getComputedVarValue(varName);
      if (v) themeVars[varName] = v;
    }
  }

  const lines = [];
  lines.push('<script>');
  lines.push(`  import SquigglySlider from '${importPath}';`);

  if (includeThemeVars && Object.keys(themeVars).length) {
    lines.push('  // Optional: update your theme variables only if your app already defines them');
    lines.push('  const themeVars = {');
    const entries = Object.entries(themeVars);
    entries.forEach(([k, v], i) => {
      // If value already starts with rgb(...) or a color string, include as-is
      const val = v.startsWith('rgb') || v.startsWith('#') || v.startsWith('hsl') ? v : `rgb(${v})`;
      lines.push(`    '${k}': '${val}'${i < entries.length - 1 ? ',' : ''}`);
    });
    lines.push('  };');
    lines.push('  for (const [name, value] of Object.entries(themeVars)) {');
    lines.push('    const existing = getComputedStyle(document.documentElement).getPropertyValue(name).trim();');
    lines.push('    if (existing) document.documentElement.style.setProperty(name, value);');
    lines.push('  }');
  }

  lines.push('</script>');
  lines.push('');

  // Svelte component
  lines.push('<SquigglySlider');
  lines.push(`  min={${min}}`);
  lines.push(`  max={${max}}`);
  lines.push(`  value={${value}}`);
  lines.push(`  active={'${cssEscape(activeColor)}'}`);
  lines.push(`  passive={'${cssEscape(passiveColor)}'}`);
  lines.push(`  activeAmplitude={${activeAmplitude}}`);
  lines.push(`  passiveAmplitude={${passiveAmplitude}}`);
  lines.push(`  activeWavelength={${activeWavelength}}`);
  lines.push(`  passiveWavelength={${passiveWavelength}}`);
  lines.push(`  speedFactor={${speedFactor}}`);
  if (step !== 1) {
    lines.push(`  step={${step}}`);
  }
  lines.push('/>');

  return lines.join('\n');
}

function cssEscape(str) {
  return String(str).replace(/'/g, "\\'");
}
