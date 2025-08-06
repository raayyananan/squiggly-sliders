import { cubicOut, expoOut, quintOut } from "svelte/easing";
import { slide, fade } from "svelte/transition";

export const translateIn = (node, {direction = 1, ...options}) => {
    return {
        duration: 350,
        easing: cubicOut,
        ...options,
        css: (t, u) => `translate: 0 ${u * -20 * direction}px;`
    }
}

export const translateOut = (node, {direction = 1, ...options}) => {
    return {
        duration: 350,
        easing: cubicOut,
        ...options,
        css: (t, u) => `translate: 0 ${t * -100 * direction}%;`
    }
}

export const fadeSlide = (node, {delay = 0, duration = 150, easing = cubicOut, ...options}) => {
    const slideTransition = slide(node, {delay, duration});
    const fadeTransition = fade(node, {delay, duration});
    return {
        delay,
        duration, 
        easing,
        css: (t) => {
            const slideCSS = slideTransition.css(t);
            const fadeCSS = fadeTransition.css(t);
            return `${slideCSS} ${fadeCSS}`
        }
    }
}
