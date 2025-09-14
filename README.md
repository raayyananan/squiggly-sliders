# squiggly-sliders

Animated wave-effect sliders for Svelte with CSS-variable theming.

## Install

```bash
# npm
npm i squiggly-sliders
# pnpm
pnpm add squiggly-sliders
# yarn
yarn add squiggly-sliders
```

## Usage (Svelte)

Minimal:

```svelte
<script>
  import SquigglySlider from 'squiggly-sliders';
</script>

<SquigglySlider
  min={0}
  max={10}
  value={6}
  active={'--md-sys-color-primary'}
  passive={'--md-sys-color-on-surface'}
/>
```

Advanced:

```svelte
<script>
  import SquigglySlider from 'squiggly-sliders';
  let value = 6;
</script>

<SquigglySlider
  bind:value
  min={0}
  max={10}
  step={1}
  active={'--md-sys-color-primary'}
  passive={'--md-sys-color-on-surface'}
  activeAmplitude={4}
  passiveAmplitude={2}
  activeWavelength={1}
  passiveWavelength={1}
  speedFactor={4}
/>
```

## Props

- active: string CSS variable name (default `--md-sys-color-primary`)
- passive: string CSS variable name (default `--md-sys-color-on-surface`)
- activeAmplitude: number 0–7 (default 4)
- passiveAmplitude: number 0–7 (default 2)
- activeWavelength: number 0.25–7 (default 1)
- passiveWavelength: number 0.25–7 (default 1)
- speedFactor: number 1–8 (default 4)
- value: number
- min: number (default 0)
- max: number (default 10)
- step: number (default 1)

## Theming via CSS variables

The slider reads its colors from CSS variables so it adapts to your theme.

```css
:root {
  --md-sys-color-primary: rgb(97 97 24);
  --md-sys-color-on-surface: rgb(28 28 20);
}
```

Optional — conditionally set theme variables at runtime only if your app already defines them:

```svelte
<script>
  import SquigglySlider from 'squiggly-sliders';
  // Optional: update your theme variables only if your app already defines them
  const themeVars = {
    '--md-sys-color-primary': 'rgb(97 97 24)',
    '--md-sys-color-on-surface': 'rgb(28 28 20)'
  };
  for (const [name, value] of Object.entries(themeVars)) {
    const existing = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    if (existing) document.documentElement.style.setProperty(name, value);
  }
</script>
```

## License

Apache-2.0
