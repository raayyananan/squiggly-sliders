import React, { useEffect, useRef, useState } from "react";

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const expoOut = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

function usePrefersColorSchemeChange(handler) {
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const fn = () => handler(mq.matches);
    try {
      mq.addEventListener('change', fn);
      return () => mq.removeEventListener('change', fn);
    } catch {
      mq.addListener(fn);
      return () => mq.removeListener(fn);
    }
  }, [handler]);
}

function resolveTokenColor(el, token) {
  if (!token) return undefined;
  if (typeof token !== 'string') return token;
  const isCSSVar = token.startsWith('--') || token.startsWith('var(');
  if (!isCSSVar) return token;
  const name = token.startsWith('var(') ? token.slice(4, -1).trim() : token;
  const fromEl = getComputedStyle(el).getPropertyValue(name).trim();
  if (fromEl) return fromEl;
  const fromRoot = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  if (fromRoot) return fromRoot;
  return token;
}

export default function SquigglySlider({
  title = '',
  min = 0,
  max = 10,
  step = 1,
  value,
  defaultValue,
  onChange,
  activeAmplitude = 4,
  passiveAmplitude = 2,
  speedFactor = 4,
  activeWavelength = 1,
  passiveWavelength = 1,
  active = '--primary',
  passive = '--text',
  disabled = false,
  className,
  style,
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const inputRef = useRef(null);
  const rafRef = useRef(0);
  const renderingRef = useRef(true);
  const startTimeRef = useRef(Date.now());
  const ctxRef = useRef(null);
  const lengthRef = useRef(0);
  const circleRef = useRef(0);
  const animatedLenRef = useRef(0);
  const [internalVal, setInternalVal] = useState(() => {
    if (typeof value === 'number') return value;
    if (typeof defaultValue === 'number') return defaultValue;
    const mx = Math.floor(Math.random() * 21 + 7);
    return 1 + Math.floor(Math.random() * (mx - 2));
  });

  const isControlled = typeof value === 'number';
  const val = isControlled ? clamp(value, min, max) : clamp(internalVal, min, max);
  const progressRef = useRef(0);

  const colorsRef = useRef({ fill: 'transparent', activeStroke: '#000', passiveStroke: '#999' });

  const updateColors = () => {
    const el = containerRef.current || document.documentElement;
    colorsRef.current = {
      fill: resolveTokenColor(el, '--surface') || 'transparent',
      activeStroke: resolveTokenColor(el, active) || '#000',
      passiveStroke: resolveTokenColor(el, passive) || '#999',
    };
  };

  usePrefersColorSchemeChange(() => updateColors());

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctxRef.current = ctx;
    const input = inputRef.current;

    const setSize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth || 300;
      canvas.width = width;
      canvas.height = 50;
      ctx.width = canvas.width;
      ctx.height = canvas.height;
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      lengthRef.current = ctx.width;
      progressRef.current = max ? val / max : 0;
      show();
    };

    const ro = new ResizeObserver(setSize);
    if (containerRef.current) ro.observe(containerRef.current);
    setSize();

    startTimeRef.current = Date.now();
    updateColors();

    const onInput = (e) => {
      const v = Number(e.target.value);
      if (!isControlled) setInternalVal(v);
      if (onChange) onChange(v);
      animateToProgress(max ? v / max : 0, 500);
    };
    input.addEventListener('input', onInput);

    const loop = () => {
      rafRef.current = requestAnimationFrame(loop);
      if (!renderingRef.current) return;
      const ctx = ctxRef.current;
      const now = Date.now() - startTimeRef.current;
      const { activeStroke, passiveStroke } = colorsRef.current;
      ctx.clearRect(0, 0, ctx.width, ctx.height);

      ctx.beginPath();
      for (let i = circleRef.current; i <= animatedLenRef.current * progressRef.current - circleRef.current / 2; i++) {
        ctx.strokeStyle = activeStroke;
        ctx.lineTo(
          i,
          activeAmplitude * Math.sin(i / (6 * activeWavelength) + now / ((10 - speedFactor) * 60)) + ctx.height / 2
        );
      }
      ctx.stroke();

      ctx.beginPath();
      for (let j = animatedLenRef.current * progressRef.current; j < animatedLenRef.current - circleRef.current; j++) {
        ctx.strokeStyle = passiveStroke;
        ctx.lineTo(
          j,
          passiveAmplitude * Math.sin(j / (6 * passiveWavelength) + now / ((10 - speedFactor) * 60)) + ctx.height / 2
        );
      }
      ctx.stroke();

      ctx.beginPath();
      ctx.fillStyle = activeStroke;
      const x = Math.max(
        Math.min(animatedLenRef.current * progressRef.current, lengthRef.current - circleRef.current),
        circleRef.current
      );
      ctx.ellipse(x, ctx.height / 2, circleRef.current, circleRef.current, 0, 0, Math.PI * 2);
      ctx.fill();
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      input.removeEventListener('input', onInput);
      ro.disconnect();
    };
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.min = String(min);
      inputRef.current.max = String(max);
      inputRef.current.step = String(step);
      inputRef.current.value = String(val);
      inputRef.current.disabled = !!disabled;
    }
    if (isControlled) {
      const p = max ? val / max : 0;
      animateToProgress(p, 500);
    }
  }, [min, max, step, val, disabled]);

  useEffect(() => {
    updateColors();
  }, [active, passive]);

  const show = () => {
    const duration = 1000;
    const startTime = Date.now();
    const startLen = animatedLenRef.current;
    const endLen = lengthRef.current;
    const endRadius = 8;

    const stepAnim = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed < duration) {
        const eased = startLen + (endLen - startLen) * expoOut(elapsed / duration);
        animatedLenRef.current = eased;
        circleRef.current = endRadius * expoOut((elapsed * 2) / duration);
        renderingRef.current = true;
        requestAnimationFrame(stepAnim);
      } else {
        animatedLenRef.current = endLen;
        circleRef.current = endRadius;
      }
    };
    stepAnim();
  };

  const animateToProgress = (target, duration = 500) => {
    const startTime = Date.now();
    const start = progressRef.current;
    const end = Math.max(0, Math.min(1, target));
    const stepAnim = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed < duration) {
        const eased = start + (end - start) * expoOut(elapsed / duration);
        progressRef.current = eased;
        requestAnimationFrame(stepAnim);
      } else {
        progressRef.current = end;
      }
    };
    stepAnim();
  };

  const styleBlock = `
    .sq-range-container { position: relative; width: 100%; max-width: 100%; min-width: 0; }
    .sq-range-container input[type="range"] { position: absolute; inset: 0; height: 100%; width: 100%; background: transparent; -webkit-appearance: none; appearance: none; border-radius: 10px; }
    .sq-range-container input[type="range"]::-webkit-slider-thumb { background: transparent; opacity: 0; border: none; }
    .sq-range-container input[type="range"]::-moz-range-thumb { background: transparent; opacity: 0; border: none; }
    .sq-range-container input[type="range"]::-ms-thumb { background: transparent; opacity: 0; border: none; }
    .sq-range-container input:focus-visible { outline: 2px solid currentColor; }
  `;

  return (
    <div className={['sq-range-container', className].filter(Boolean).join(' ')} style={style} ref={containerRef}>
      <style dangerouslySetInnerHTML={{ __html: styleBlock }} />
      <canvas ref={canvasRef} aria-hidden="true" />
      <input
        ref={inputRef}
        type="range"
        title={title}
        min={min}
        max={max}
        step={step}
        defaultValue={isControlled ? undefined : val}
        value={isControlled ? val : undefined}
        onChange={() => {}}
        disabled={disabled}
        aria-label={title || 'Squiggly slider'}
      />
    </div>
  );
}
