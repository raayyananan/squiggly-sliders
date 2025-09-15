<script>
  import { onMount } from 'svelte';
  import Dashboard from '$lib/Dashboard.svelte';
  import { Toaster } from 'svelte-sonner';
  import { generateSnippet } from '$lib/generateSnippet.js';

  // Source-of-truth state (lifted into page)
  let sliders = [];

  let activeAmplitude = 4;
  let passiveAmplitude = 2;
  let speedFactor = 4;
  let activeWavelength = 1;
  let passiveWavelength = 1;
  let activeColor = '--md-sys-color-primary';
  let passiveColor = '--md-sys-color-on-surface';
  let activeRgb = undefined;
  let passiveRgb = undefined;

  let toasterPosition = 'bottom-left';
  const importPath = 'squiggly-sliders';

  // Snippet props
  let snippetValue = 6;
  let minVal = 0;
  let maxVal = 10;
  let stepVal = 1;

  // Code block state
  let codeText = '';

  // Build initial sliders (mirrors previous addSlider calls)
  function seedSliders() {
    const mk = (id, active, passive, aA = 4, pA = 2, aW = 1, pW = 1, s = 4, val = 4 + Math.floor(Math.random() * 4)) => ({
      id,
      active,
      passive,
      activeAmplitude: aA,
      passiveAmplitude: pA,
      activeWavelength: aW,
      passiveWavelength: pW,
      speedFactor: s,
      val
    });
    sliders = [
      mk(1, '--md-sys-color-primary', '--md-sys-color-on-surface'),
      mk(2, '--md-sys-color-secondary', '--md-sys-color-on-surface', 7, 0, 0.6, 2, 4, 4),
      mk(3, '--md-sys-color-tertiary', '--md-sys-color-on-surface'),
      mk(4, '--slider-color-4', '--md-sys-color-on-surface', 4, 0, 1.5, 1, 4)
    ];
  }

  // Parsing utilities (for code editor -> state)
  function escapeSingleQuotes(str) {
    return String(str).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  }
  function formatAttrValue(val) {
    if (typeof val === 'number' || typeof val === 'boolean') return `{${val}}`;
    return `{'${escapeSingleQuotes(val)}'}`;
  }
  function setOrInsertAttribute(name, val) {
    const formatted = formatAttrValue(val);
    const attrRe = new RegExp(`(\\b${name}\\s*=\\s*)({[^}]*}|\"(?:[^\"\\]|\\.)*\"|'(?:[^'\\]|\\.)*')`);
    if (attrRe.test(codeText)) {
      codeText = codeText.replace(attrRe, `$1${formatted}`);
    } else {
      const start = codeText.indexOf('<SquigglySlider');
      if (start === -1) return;
      const end = codeText.indexOf('>', start);
      if (end === -1) return;
      const isSelfClosing = codeText[end - 1] === '/';
      const insertPos = isSelfClosing ? end - 1 : end;
      codeText = codeText.slice(0, insertPos) + `\n  ${name}=${formatted}` + codeText.slice(insertPos);
    }
  }
  function parsePropsFromCode(text) {
    const props = {};
    if (!text) return props;
    const tagMatch = text.match(/<\s*SquigglySlider\b([\s\S]*?)\/*>/);
    if (!tagMatch) return props;
    const attrs = tagMatch[1] || '';
    const re = /(\b[\w$]+)\s*=\s*({[^}]*}|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g;
    let m;
    while ((m = re.exec(attrs)) !== null) {
      const key = m[1];
      let raw = m[2].trim();
      let v;
      if (raw.startsWith('{') && raw.endsWith('}')) {
        raw = raw.slice(1, -1).trim();
        if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) {
          v = raw.slice(1, -1);
        } else if (/^(true|false)$/i.test(raw)) {
          v = raw.toLowerCase() === 'true';
        } else if (!isNaN(Number(raw))) {
          v = Number(raw);
        } else {
          v = raw;
        }
      } else {
        if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) {
          v = raw.slice(1, -1);
        } else {
          v = raw;
        }
      }
      props[key] = v;
    }
    return props;
  }
  function applyParsedProps(props) {
    if ('active' in props) activeColor = props.active;
    if ('passive' in props) passiveColor = props.passive;
    if ('activeAmplitude' in props && typeof props.activeAmplitude === 'number') activeAmplitude = props.activeAmplitude;
    if ('passiveAmplitude' in props && typeof props.passiveAmplitude === 'number') passiveAmplitude = props.passiveAmplitude;
    if ('activeWavelength' in props && typeof props.activeWavelength === 'number') activeWavelength = props.activeWavelength;
    if ('passiveWavelength' in props && typeof props.passiveWavelength === 'number') passiveWavelength = props.passiveWavelength;
    if ('speedFactor' in props && typeof props.speedFactor === 'number') speedFactor = props.speedFactor;
    if ('value' in props && (typeof props.value === 'number')) snippetValue = props.value;
    if ('min' in props && (typeof props.min === 'number')) minVal = props.min;
    if ('max' in props && (typeof props.max === 'number')) maxVal = props.max;
    if ('step' in props && (typeof props.step === 'number')) stepVal = props.step;
  }

  function recomputeSnippet() {
    codeText = generateSnippet({
      activeColor,
      passiveColor,
      activeAmplitude,
      passiveAmplitude,
      activeWavelength,
      passiveWavelength,
      speedFactor,
      value: snippetValue,
      min: minVal,
      max: maxVal,
      step: stepVal,
    }, importPath);
  }

  onMount(() => {
    seedSliders();
    if (typeof window !== 'undefined' && window.innerWidth <= 648) {
      toasterPosition = 'top-left';
    }
    recomputeSnippet();
    const props = parsePropsFromCode(codeText);
    applyParsedProps(props);
  });

  function handleChange(e) {
    const { key, value } = e.detail || {};
    switch (key) {
      case 'sliders':
        sliders = value;
        break;
      case 'activeAmplitude':
        activeAmplitude = Number(value);
        setOrInsertAttribute('activeAmplitude', activeAmplitude);
        break;
      case 'passiveAmplitude':
        passiveAmplitude = Number(value);
        setOrInsertAttribute('passiveAmplitude', passiveAmplitude);
        break;
      case 'activeWavelength':
        activeWavelength = Number(value);
        setOrInsertAttribute('activeWavelength', activeWavelength);
        break;
      case 'passiveWavelength':
        passiveWavelength = Number(value);
        setOrInsertAttribute('passiveWavelength', passiveWavelength);
        break;
      case 'speedFactor':
        speedFactor = Number(value);
        setOrInsertAttribute('speedFactor', speedFactor);
        break;
      case 'activeColor':
        activeColor = String(value);
        setOrInsertAttribute('active', activeColor);
        break;
      case 'passiveColor':
        passiveColor = String(value);
        setOrInsertAttribute('passive', passiveColor);
        break;
      case 'activeRgb':
        activeRgb = value;
        break;
      case 'passiveRgb':
        passiveRgb = value;
        break;
      case 'minVal':
        minVal = Number(value);
        setOrInsertAttribute('min', minVal);
        break;
      case 'maxVal':
        maxVal = Number(value);
        setOrInsertAttribute('max', maxVal);
        break;
      case 'stepVal':
        stepVal = Number(value);
        setOrInsertAttribute('step', stepVal);
        break;
      case 'snippetValue':
        snippetValue = Number(value);
        setOrInsertAttribute('value', snippetValue);
        break;
      case 'importPath':
        break;
      case 'toasterPosition':
        toasterPosition = String(value);
        break;
      case 'codeText':
        codeText = String(value || '');
        const props = parsePropsFromCode(codeText);
        applyParsedProps(props);
        break;
      default:
        break;
    }
  }
</script>

<Toaster bind:position={toasterPosition} />

<Dashboard
  {sliders}
  {activeAmplitude}
  {passiveAmplitude}
  {activeWavelength}
  {passiveWavelength}
  {speedFactor}
  {activeColor}
  {passiveColor}
  {activeRgb}
  {passiveRgb}
  {minVal}
  {maxVal}
  {stepVal}
  {snippetValue}
  {importPath}
  {toasterPosition}
  {codeText}
  on:change={handleChange}
/>

<style lang="scss">
  /* Page-specific styles can remain here if needed */
</style>
