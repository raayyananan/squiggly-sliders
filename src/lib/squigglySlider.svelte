<!-- 
    -------------------------------------------------------
    REMOVE getColors() FROM raf() IN PRODUCTION
    -------------------------------------------------------
    IT IS FOR SHOWCASE ONLY
    DO *NOT* PROCEED TO PRODUCTION IN ANY OTHER PROJECTS
    WITHOUT REMOVING THAT LINE
    -------------------------------------------------------
 -->

<script>
    import { onMount, onDestroy } from 'svelte';
    import { get, writable } from 'svelte/store';
  
    export let title = '';
    export let min = 0;
    export let max = 10;
    export let step = 1;
    export let value = Math.floor(Math.random() * (max - 2));

    export let activeAmplitude = 4;
    export let passiveAmplitude = 2;
    export let speedFactor = 4;
    export let activeWavelength = 1;
    export let passiveWavelength = 1;
    
    export let active = '--primary';
    export let passive = '--text';
  
    let canvas;
    let rangeSlider;
    let ctx;
    let animationDuration = 1000;
    let actualCircleRadius = 8;
    let rendering = true;
    let animationRequest;
    let startingTime;
    let fill;
    let activeStroke;
    let passiveStroke;
    let length;
    let circleRadius = 0;
    let animatedLength = 0;
    let progress;

    const getColors = () => {
      activeStroke = active[0] === '-' ? getComputedStyle(rangeSlider.parentElement).getPropertyValue(active) : active;
      passiveStroke = passive[0] === '-' ? getComputedStyle(rangeSlider.parentElement).getPropertyValue(passive) : passive;
    }
  
    const expoOut = t => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));
  
    const animateProgress = (startTime, duration, startValue, endValue, callback) => {
      const animate = () => {
        const currentTime = new Date().getTime();
        const elapsed = currentTime - startTime;
  
        if (elapsed < duration) {
          const easedProgress = startValue + (endValue - startValue) * expoOut(elapsed / duration);
          callback(easedProgress);
          requestAnimationFrame(animate);
        } else {
          callback(endValue);
        }
      };
      animate();
    };
  
    const handleRangeInput = () => {
      const value = rangeSlider.value;
      const startTime = new Date().getTime();
      const duration = 500;
      const startValue = progress;
      const endValue = value / rangeSlider.max;
  
      animateProgress(startTime, duration, startValue, endValue, easedProgress => {
        progress = easedProgress;
      });
    };
  
    const raf = (time) => {
      animationRequest = requestAnimationFrame(raf);
  
      if (!rendering) return;
  
      let currentTime = new Date().getTime() - startingTime;

      getColors();
  
      ctx.fillStyle = fill;
      // ctx.rect(0, 0, ctx.width, ctx.height);
      // ctx.fill();
      ctx.clearRect(0, 0, ctx.width, ctx.height);
  
      ctx.beginPath();
      for (let i = circleRadius; i <= animatedLength * progress - circleRadius / 2; i++) {
        ctx.strokeStyle = activeStroke;
        ctx.lineTo(i, activeAmplitude * Math.sin(i / (6 * activeWavelength) + currentTime / ((10 - speedFactor) * 60)) + ctx.height / 2);
      }
      ctx.stroke();
  
      ctx.beginPath();
      for (let j = animatedLength * progress; j < animatedLength - circleRadius; j++) {
        ctx.strokeStyle = passiveStroke;
        ctx.lineTo(j, passiveAmplitude * Math.sin(j / (6 * passiveWavelength) + currentTime / ((10 - speedFactor) * 60)) + ctx.height / 2);
      }
      ctx.stroke();
  
      ctx.beginPath();
      ctx.fillStyle = activeStroke;
      ctx.ellipse(
        Math.max(Math.min(animatedLength * progress, length - circleRadius), circleRadius),
        ctx.height / 2,
        circleRadius,
        circleRadius,
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();
    };
  
    const show = () => {
      const startTime = new Date().getTime();
      const duration = animationDuration;
      const startValue = animatedLength;
      const endValue = length;
      const endRadius = actualCircleRadius;
  
      animateProgress(startTime, duration, startValue, endValue, easedProgress => {
        animatedLength = easedProgress;
        circleRadius = endRadius * expoOut(easedProgress * 2 / duration);
        rendering = true;
      });
    };
  
    const hide = () => {
      const startTime = new Date().getTime();
      const duration = animationDuration;
      const startValue = animatedLength;
      const endValue = 0;
      const endRadius = 0;
  
      animateProgress(startTime, duration, startValue, endValue, easedProgress => {
        animatedLength = easedProgress;
        circleRadius = actualCircleRadius - actualCircleRadius * (easedProgress < 0.5 ? 4 * easedProgress * easedProgress * easedProgress : 1 - Math.pow(-2 * easedProgress + 2, 3) / 2);
        if (easedProgress === endValue) {
          rendering = false;
        }
      });
    };

    export const resetWidthAndHeight = () => {
        // console.log(rangeSlider); // if this line gets removed, rangeSlider is 'null' ???? a fix is welcome
        canvas.width = rangeSlider.parentElement.offsetWidth;
        ctx.width = canvas.width;
        ctx.height = canvas.height = 50;
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        length = ctx.width;
        progress = rangeSlider.value / rangeSlider.max;
        show();
    }

    onMount(() => {
      ctx = canvas.getContext('2d');
      resetWidthAndHeight();
      startingTime = new Date().getTime();

      getColors();
  
      show();
    
      requestAnimationFrame(raf);
  
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', ({ matches }) => {
        getColors();
      });

      const resizeListener = window.addEventListener('resize', () => {
        resetWidthAndHeight();
      });

      return () => {
        window.cancelAnimationFrame(animationRequest);
        window.removeEventListener('resize', resizeListener);
      }
    });
</script>

<div class="range-container">
    <canvas bind:this={canvas} aria-hidden="true"></canvas>
    <input type="range" bind:this={rangeSlider} on:input={handleRangeInput}
           min={min || 0}
           max={max || Math.floor(Math.random() * 21 + 7)}
           step={step || 1}
           value={value || 1 + Math.floor(Math.random() * (max - 2))}
           {title} />
</div>
  

<style>
    .range-container {
        position: relative;
        width: 100%;
    }
    input[type="range"] {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        background: transparent;
        -webkit-appearance: none;
        appearance: none;
        border-radius: 10px;
    }
    input[type="range"]::-webkit-slider-thumb {
        background: transparent;
        opacity: 0;
        border: none;
    }
    input[type="range"]::-moz-range-thumb {
        background: transparent;
        opacity: 0;
        border: none;
    }
    input[type="range"]::-ms-thumb {
        background: transparent;
        opacity: 0;
        border: none;
    }
    input:focus-visible {
        outline: 2px solid black;
    }
    
</style>

