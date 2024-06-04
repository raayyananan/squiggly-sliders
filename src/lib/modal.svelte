<script>
    import { createEventDispatcher } from "svelte";
    import { fade, scale } from 'svelte/transition';
    import { cubicInOut, cubicOut, expoOut } from 'svelte/easing';
    import Button from './button.svelte';
    import { toast } from "svelte-sonner";

    export let classes;
    
    // const dispatch = createEventDispatcher();

    let modalVisible = false;
    $: {
    }

    async function copyEmail() {
        try {
            await navigator.clipboard.writeText('rayyantariq@skiff.com');
            toast.success(`Email copied to clipboard`, {
                classes: {
                    toast: "raleway flex items-center rounded-xl h-12 easing-decelerate shadow-md border-none bg-inverse-surface text-inverse-on-surface dark:bg-secondary-fixed dark:text-inverse-on-secondary-fixed"
                }
            })
        } 
        catch (e) {
            toast.error(`Unable to copy email`, {
                classes: {
                    toast: "raleway flex items-center rounded-xl h-12 easing-decelerate shadow-md border-none bg-inverse-surface text-inverse-on-surface dark:bg-secondary-fixed dark:text-inverse-on-secondary-fixed"
                }
            })
        }
    }
</script>

<button role="button" class="h-full flex {classes}" 
        on:click={() => {modalVisible = !modalVisible}} aria-label="button">
    <slot />
</button>

{#if modalVisible}
    <div in:fade={{duration: 300, easing: cubicOut}} out:fade={{duration: 200, easing: cubicOut}} on:click={() => {modalVisible = false}} class="fixed top-0 left-0 w-full h-full backdrop-blur-lg z-10 bg-[rgba(253,249,236,0.85)] dark:bg-[rgba(20,20,12,.85)]"></div>
    <div out:scale={{duration: 150, easing: cubicOut, start: 0.9}} 
    class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-108 z-10">
        <div class="ios-nav-in flex flex-col items-center gap-6 w-full h-full p-2 pt-4 bg-surface-container shadow-lg rounded-2xl">
            <div class="flex items-center justify-center relative">
                <div class="rounded-full bg-primary w-2 h-2 items-center justify-center flex">
                    <div class="rounded-full w-1 h-1 items-end justify-center flex pb-px pr-px">
                        <img class="pin w-5 h-5 flex-shrink-0 max-w-none origin-bottom rotate-[30deg]" src="/image.png" alt="ping">
                    </div>
                </div>
                <!-- <svg class="absolute bottom-1/2 left-1/2 -translate-x-1/2 rotate-[42deg]
                            origin-bottom drop-shadow stroke-[4px] pin-animation stroke-tertiary-container w-10 h-10" 
                xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="var(--md-sys-color-tertiary)"><path d="m640-480 80 80v80H520v240l-40 40-40-40v-240H240v-80l80-80v-280h-40v-80h400v80h-40v280Z"/></svg> -->
            </div>
            <h1 class="text-2xl font-bold flex-shrink-0 mt-2">Squiggly Sliders</h1>
            <!-- <div class="absolute top-0 right-0 h-full w-full overflow-hidden pointer-events-none">
                <button on:click={() => {modalVisible = false}}
                    class="absolute top-0 left-0 -mt-4 -mr-4 rounded-full border border-[rgba(201,195,184,.33)] h-8 w-8 scale-[6.5] border-dashed transition-all duration-100 flex-shrink-0">
                </button>
            </div> -->
            <button on:click={() => {modalVisible = false}} style="scale: 0;" 
                class="scale-up animation-delay-50 easing-elastic absolute top-0 right-4 -mt-4 rounded-full button-shadow-default1 border border-dashed border-outline-variant dark:border-outline-variant h-8 w-8 bg-surface-container-high text-outline lg:text-on-surface flex items-center justify-center md:hover:brightness-95 active:brightness-95 md:active:brightness-[.93] active:scale-95 transition-all duration-100 flex-shrink-0">
                <div class="material-symbols-rounded text-xl font-semibold">close</div>
            </button>
            <div class="px-[10%] flex flex-col gap-1 text-center">
                <p class="text-sm text-balance">This is a web implementation of the M3 'Material You' squiggly sliders often found in Google design commercials, and in the Android 14 music player.</p>
            </div>
            <div class="h-48 flex items-center justify-center pt-4 mt-3">
                <img style="--card-initial-rotation: -6deg"
                class="card-animation animation-delay-0 h-full border origin-top-right scale-90 rotate-[4deg] -translate-y-3 translate-x-4 border-gray-600/10 dark:border-gray-500/10 rounded-2xl shadow-xl shadow-black/5 " src="/pin.png" alt="pin frame sample">
                <img 
                class="card-animation animation-delay-50 h-full -rotate-[12deg] scale-90 origin-top-left border -translate-x-4 border-gray-600/10 dark:border-gray-500/10 rounded-2xl shadow-xl shadow-black/5 " src="/pin.png" alt="pin frame sample">
            </div>
            <div class="flex gap-2 border border-outline-variant border-dashed rounded-2xl p-2 pt-16 overflow-hidden w-full">
                <div class="button-animation animation-delay-100">
                    <Button big href="https://raayyananan.vercel.app" target="_blank">
                        <div class="flex gap-0.5 pl-2">
                            <span>My personal site</span>
                            <div class="">
                                <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="var(--md-sys-color-on-primary)"><path d="m243-240-51-51 405-405H384v-72h336v336h-72v-213L243-240Z"/></svg>
                            </div>
                        </div>
                    </Button>
                </div>
                <div class="flex-auto"></div>
                <div class="button-animation animation-delay-200" style="--button-initial-rotation: 20deg;">
                    <Button big square href="https://twitter.com/raayyananan" target="blank">
                        <svg xmlns="http://www.w3.org/2000/svg" height="14" fill="var(--md-sys-color-on-primary)" viewBox="0 0 512 512"><path d="M459.4 151.7c.3 4.5 .3 9.1 .3 13.6 0 138.7-105.6 298.6-298.6 298.6-59.5 0-114.7-17.2-161.1-47.1 8.4 1 16.6 1.3 25.3 1.3 49.1 0 94.2-16.6 130.3-44.8-46.1-1-84.8-31.2-98.1-72.8 6.5 1 13 1.6 19.8 1.6 9.4 0 18.8-1.3 27.6-3.6-48.1-9.7-84.1-52-84.1-103v-1.3c14 7.8 30.2 12.7 47.4 13.3-28.3-18.8-46.8-51-46.8-87.4 0-19.5 5.2-37.4 14.3-53 51.7 63.7 129.3 105.3 216.4 109.8-1.6-7.8-2.6-15.9-2.6-24 0-57.8 46.8-104.9 104.9-104.9 30.2 0 57.5 12.7 76.7 33.1 23.7-4.5 46.5-13.3 66.6-25.3-7.8 24.4-24.4 44.8-46.1 57.8 21.1-2.3 41.6-8.1 60.4-16.2-14.3 20.8-32.2 39.3-52.6 54.3z"/></svg>
                    </Button>
                </div>
                <div class="button-animation animation-delay-300" style="--button-initial-rotation: 30deg;">
                    <Button big square on:click={copyEmail}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 512 512" fill="var(--md-sys-color-on-primary)"><path d="M64 112c-8.8 0-16 7.2-16 16v22.1L220.5 291.7c20.7 17 50.4 17 71.1 0L464 150.1V128c0-8.8-7.2-16-16-16H64zM48 212.2V384c0 8.8 7.2 16 16 16H448c8.8 0 16-7.2 16-16V212.2L322 328.8c-38.4 31.5-93.7 31.5-132 0L48 212.2zM0 128C0 92.7 28.7 64 64 64H448c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128z"/></svg>
                    </Button>
                </div>
            </div>
        </div>
    </div>        
{/if}

<style lang="scss">
    :root {
        --button-initial-rotation: -15deg;
        --card-initial-rotation: 6deg;
    }
    .pin {
        filter: drop-shadow(-1px 2px 3px rgba(0,0,0,0.25));
        animation: pin-animation 750ms cubic-bezier(0.4, 0.885, 0.32, 1) forwards;
    }
    @keyframes pin-animation {
        0% {scale: 3}
        70% {scale: 1.5}
        100% {scale: 1.85}
    }
    .ios-nav-in {
        animation: ios-nav-in 750ms cubic-bezier(0, 0.885, 0.32, 1);
        animation-delay: inherit;
    }
    @keyframes ios-nav-in {
        0% {opacity: 0; scale: 1.25; filter: blur(8px); translate: 0 25px;}
        72% {scale: 0.98;}
        100% {opacity: 1; scale: 1; filter: blur(0px);}
    }
    .button-animation {
        animation: button-fall-animation 1000ms var(--bounce-easing) forwards;
        translate: 0 -7rem; 
    }
    @keyframes button-fall-animation {
        0% {translate: 0 -7rem; transform-origin: bottom left; rotate: var(--button-initial-rotation);}
        100% {translate: 0 0; rotate: 0deg;}
    }
    .card-animation {
        animation: card-animation 400ms var(--md-sys-motion-easing-emphasized) forwards;
        opacity: 0; 
    }
    @keyframes card-animation {
        0% {rotate: var(--card-initial-rotation);}
        100% {rotate: 0deg; opacity: 1;}
    }
</style>