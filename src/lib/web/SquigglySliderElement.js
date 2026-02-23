const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host { display: block; }
    .container { position: relative; width: 100%; max-width: 100%; min-width: 0; }
    input[type="range"] { position: absolute; inset: 0; height: 100%; width: 100%; background: transparent; -webkit-appearance: none; appearance: none; border-radius: 10px; }
    input[type="range"]::-webkit-slider-thumb { background: transparent; opacity: 0; border: none; }
    input[type="range"]::-moz-range-thumb { background: transparent; opacity: 0; border: none; }
    input[type="range"]::-ms-thumb { background: transparent; opacity: 0; border: none; }
    input:focus-visible { outline: 1px solid currentColor; }
  </style>
  <div class="container">
    <canvas aria-hidden="true"></canvas>
    <input type="range" />
  </div>
`;
     // dis code da bomb lowkirkflowenually
    /* sooo
many
lines on this
comment wowow
hello wrld */

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const expoOut = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

function isCSSVarToken(token) {
  return typeof token === 'string' && (token.startsWith('--') || token.startsWith('var('));
}

function resolveTokenColor(el, token) {
  if (!token) return undefined;
  if (!isCSSVarToken(token)) return token;
  const name = token.startsWith('var(') ? token.slice(4, -1).trim() : token;
  const fromEl = getComputedStyle(el).getPropertyValue(name).trim();
  if (fromEl) return fromEl;
  const fromRoot = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  if (fromRoot) return fromRoot;
  return token;
}

class SquigglySliderElement extends HTMLElement {
  static get observedAttributes() {
    return [
      'title', 'min', 'max', 'step', 'value',
      'active', 'passive',
      'active-amplitude', 'passive-amplitude', 'speed-factor',
      'active-wavelength', 'passive-wavelength', 'disabled'
    ];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.container = this.shadowRoot.querySelector('.container');
    this.canvas = this.shadowRoot.querySelector('canvas');
    this.input = this.shadowRoot.querySelector('input');
    this.ctx = this.canvas.getContext('2d');

    this.animationDuration = 1000;
    this.actualCircleRadius = 8;
    this.rendering = true;
    this.animationRequest = 0;
    this.startingTime = Date.now();

    this.length = 0;
    this.circleRadius = 0;
    this.animatedLength = 0;
    this.progress = 0;

    this._active = '--primary';
    this._passive = '--text';
    this._activeAmplitude = 4;
    this._passiveAmplitude = 2;
    this._speedFactor = 4;
    this._activeWavelength = 1;
    this._passiveWavelength = 1;

    this.colors = { fill: 'transparent', activeStroke: '#000', passiveStroke: '#999' };

    this._onInput = () => {
      const v = Number(this.input.value);
      this.value = v;
    };

    this._resizeObserver = new ResizeObserver(() => this.resetSize());
  }

  connectedCallback() {
    if (this.hasAttribute('title')) this.input.title = this.getAttribute('title');

    const randMax = Math.floor(Math.random() * 21 + 7);
    const attrMin = Number(this.getAttribute('min') ?? 0);
    const attrMax = Number(this.getAttribute('max') ?? randMax);
    const attrStep = Number(this.getAttribute('step') ?? 1);
    const attrVal = Number(this.getAttribute('value') ?? 1 + Math.floor(Math.random() * (attrMax - 2)));

    this._setRange(attrMin, attrMax, attrStep);
    this.value = attrVal;

    this.updateColors();

    this.input.addEventListener('input', this._onInput);

    try {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      this._mqHandler = () => this.updateColors();
      mq.addEventListener('change', this._mqHandler);
    } catch {}

    if (this.container) this._resizeObserver.observe(this.container);
    this.resetSize();

    const raf = () => {
      this.animationRequest = requestAnimationFrame(raf);
      if (!this.rendering) return;
      const now = Date.now() - this.startingTime;
      const ctx = this.ctx;

      ctx.clearRect(0, 0, ctx.width, ctx.height);

      ctx.beginPath();
      for (let i = this.circleRadius; i <= this.animatedLength * this.progress - this.circleRadius / 2; i++) {
        ctx.strokeStyle = this.colors.activeStroke;
        ctx.lineTo(
          i,
          this._activeAmplitude * Math.sin(i / (6 * this._activeWavelength) + now / ((10 - this._speedFactor) * 60)) + ctx.height / 2
        );
      }
      ctx.stroke();

      ctx.beginPath();
      for (let j = this.animatedLength * this.progress; j < this.animatedLength - this.circleRadius; j++) {
        ctx.strokeStyle = this.colors.passiveStroke;
        ctx.lineTo(
          j,
          this._passiveAmplitude * Math.sin(j / (6 * this._passiveWavelength) + now / ((10 - this._speedFactor) * 60)) + ctx.height / 2
        );
      }
      ctx.stroke();

      ctx.beginPath();
      ctx.fillStyle = this.colors.activeStroke;
      const x = Math.max(Math.min(this.animatedLength * this.progress, this.length - this.circleRadius), this.circleRadius);
      ctx.ellipse(x, ctx.height / 2, this.circleRadius, this.circleRadius, 0, 0, Math.PI * 2);
      ctx.fill();
    };

    this.animationRequest = requestAnimationFrame(raf);
  }

  disconnectedCallback() {
    cancelAnimationFrame(this.animationRequest);
    this.input.removeEventListener('input', this._onInput);
    try {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      mq.removeEventListener('change', this._mqHandler);
    } catch {}
    this._resizeObserver.disconnect();
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal === newVal) return;
    switch (name) {
      case 'title':
        this.input.title = newVal || '';
        break;
      case 'min':
      case 'max':
      case 'step': {
        const mn = Number(this.getAttribute('min') ?? this.input.min ?? 0);
        const mx = Number(this.getAttribute('max') ?? this.input.max ?? 10);
        const st = Number(this.getAttribute('step') ?? this.input.step ?? 1);
        this._setRange(mn, mx, st);
        const v = clamp(Number(this.value), mn, mx);
        this.value = v;
        break;
      }
      case 'value': {
        const v = Number(newVal);
        this.value = v;
        break;
      }
      case 'active':
      case 'passive':
        this.updateColors();
        break;
      case 'active-amplitude': this._activeAmplitude = Number(newVal || 4); break;
      case 'passive-amplitude': this._passiveAmplitude = Number(newVal || 2); break;
      case 'speed-factor': this._speedFactor = Number(newVal || 4); break;
      case 'active-wavelength': this._activeWavelength = Number(newVal || 1); break;
      case 'passive-wavelength': this._passiveWavelength = Number(newVal || 1); break;
      case 'disabled': this.input.disabled = this.hasAttribute('disabled'); break;
    }
  }

  get min() { return Number(this.getAttribute('min') ?? this.input.min ?? 0); }
  set min(v) { this.setAttribute('min', String(v)); }
  get max() { return Number(this.getAttribute('max') ?? this.input.max ?? 10); }
  set max(v) { this.setAttribute('max', String(v)); }
  get step() { return Number(this.getAttribute('step') ?? this.input.step ?? 1); }
  set step(v) { this.setAttribute('step', String(v)); }
  get value() { return Number(this.getAttribute('value') ?? this.input.value ?? 0); }
  set value(v) {
    const mn = this.min, mx = this.max;
    const clamped = clamp(Number(v), mn, mx);
    this.setAttribute('value', String(clamped));
    this.input.value = String(clamped);
    const p = mx ? clamped / mx : 0;
    this._animateToProgress(p, 500);
  }

  get active() { return this.getAttribute('active') ?? this._active; }
  set active(v) { this.setAttribute('active', v); }
  get passive() { return this.getAttribute('passive') ?? this._passive; }
  set passive(v) { this.setAttribute('passive', v); }
  get activeAmplitude() { return this._activeAmplitude; }
  set activeAmplitude(v) { this.setAttribute('active-amplitude', String(v)); }
  get passiveAmplitude() { return this._passiveAmplitude; }
  set passiveAmplitude(v) { this.setAttribute('passive-amplitude', String(v)); }
  get speedFactor() { return this._speedFactor; }
  set speedFactor(v) { this.setAttribute('speed-factor', String(v)); }
  get activeWavelength() { return this._activeWavelength; }
  set activeWavelength(v) { this.setAttribute('active-wavelength', String(v)); }
  get passiveWavelength() { return this._passiveWavelength; }
  set passiveWavelength(v) { this.setAttribute('passive-wavelength', String(v)); }
  get disabled() { return this.hasAttribute('disabled'); }
  set disabled(v) { if (v) this.setAttribute('disabled', ''); else this.removeAttribute('disabled'); }

  pause() { this.rendering = false; }
  resume() { this.rendering = true; }

  show() {
    const startTime = Date.now();
    const duration = this.animationDuration;
    const startValue = this.animatedLength;
    const endValue = this.length;
    const endRadius = this.actualCircleRadius;

    const step = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed < duration) {
        const eased = startValue + (endValue - startValue) * expoOut(elapsed / duration);
        this.animatedLength = eased;
        this.circleRadius = endRadius * expoOut((elapsed * 2) / duration);
        this.resume();
        requestAnimationFrame(step);
      } else {
        this.animatedLength = endValue;
        this.circleRadius = endRadius;
      }
    };
    step();
  }

  hide() {
    const startTime = Date.now();
    const duration = this.animationDuration;
    const startValue = this.animatedLength;
    const endValue = 0;
    const endRadius = 0;

    const step = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed < duration) {
        const x = elapsed / duration;
        const eased = startValue + (endValue - startValue) * expoOut(elapsed / duration);
        this.animatedLength = eased;
        this.circleRadius = this.actualCircleRadius - this.actualCircleRadius * (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
        requestAnimationFrame(step);
      } else {
        this.animatedLength = endValue;
        this.circleRadius = endRadius;
        this.pause();
      }
    };
    step();
  }

  resetSize() {
    if (!this.container) return;
    const width = this.container.clientWidth || 300;
    this.canvas.width = width;
    this.ctx.width = this.canvas.width;
    this.ctx.height = this.canvas.height = 50;
    this.ctx.lineWidth = 4;
    this.ctx.lineCap = 'round';
    this.length = this.ctx.width;
    const mx = this.max;
    const v = Number(this.value);
    this.progress = mx ? v / mx : 0;
    this.show();
  }

  updateColors() {
    const el = this;
    this.colors = {
      fill: resolveTokenColor(el, '--surface') || 'transparent',
      activeStroke: resolveTokenColor(el, this.getAttribute('active') ?? this._active) || '#000',
      passiveStroke: resolveTokenColor(el, this.getAttribute('passive') ?? this._passive) || '#999',
    };
  }

  _setRange(min, max, step) {
    this.input.min = String(min);
    this.input.max = String(max);
    this.input.step = String(step);
    this.setAttribute('min', String(min));
    this.setAttribute('max', String(max));
    this.setAttribute('step', String(step));
  }

  _animateToProgress(target, duration = 500) {
    const startTime = Date.now();
    const start = this.progress;
    const end = Math.max(0, Math.min(1, target));
    const step = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed < duration) {
        const eased = start + (end - start) * expoOut(elapsed / duration);
        this.progress = eased;
        requestAnimationFrame(step);
      } else {
        this.progress = end;
      }
    };
    step();
  }
}

const tag = 'squiggly-slider';
if (!customElements.get(tag)) {
  customElements.define(tag, SquigglySliderElement);
}

export default SquigglySliderElement;
