<script>
    import SquigglySlider from '$lib/squigglySlider.svelte';
    import Button from '../lib/button.svelte';
    import { fade, slide } from 'svelte/transition';
    import { translateIn, translateOut, fadeSlide } from '$lib/translatein.js';
    import { backOut, cubicOut, expoOut } from 'svelte/easing';
    import { writable } from 'svelte/store';
    import { Toaster, toast } from 'svelte-sonner';

    let sliders = [
    ];

    // default values
    let activeAmplitude = 4;
    let passiveAmplitude = 2;
    let speedFactor = 4;
    let activeWavelength = 1;
    let passiveWavelength = 1;
    let activeColor = '--md-sys-color-primary';
    let passiveColor = '--md-sys-color-on-surface';
    // these settings themselves will be stores but the prop that's actually passed in will be the value of the stores

    let idCount = 0;
    const addSlider = (
            active = '--md-sys-color-primary',
            passive = '--md-sys-color-on-surface',
            activeAmplitude = 4,
            passiveAmplitude = 2,
            activeWavelength = 1,
            passiveWavelength = 1,
            speedFactor = 4,
        ) => 
    {
        const newSlider = {
            id: idCount + 1,
            active,
            passive,
            activeAmplitude,
            passiveAmplitude,
            activeWavelength,
            passiveWavelength,
            speedFactor
        }
        idCount++;
        sliders = [...sliders, newSlider]
    }

    // [0,1,2,3].map(n => {addSlider(n == 2 ? '--md-sys-color-tertiary' : '--md-sys-color-primary')});
    addSlider();
    addSlider('--md-sys-color-secondary', '--md-sys-color-on-surface', 7, 0, 0.1, 2); // 0.07, 0.1
    addSlider('--md-sys-color-tertiary');
    addSlider('--md-sys-color-primary', '--md-sys-color-on-surface', activeAmplitude, 0, 1, 1);

    const removeSlider = (id) => {
        sliders = sliders.filter(slider => slider.id !== id);
    }

    const copySliderProperties = (id) => {
        const slider = sliders.find(slider => slider.id == id);
        activeColor = slider.active;
        passiveColor = slider.passive;
        activeAmplitude = slider.activeAmplitude;
        passiveAmplitude = slider.passiveAmplitude;
        activeWavelength = slider.activeWavelength;
        passiveWavelength = slider.passiveWavelength;
        speedFactor = slider.speedFactor;
        toast.success(` Properties copied to custom slider`, {
            classes: {
                toast: "raleway flex items-center rounded-xl h-12 easing-decelerate shadow-md border-none bg-inverse-surface text-inverse-on-surface dark:bg-secondary-fixed dark:text-inverse-on-secondary-fixed"
            }
        })
    }
 
    let incrementDirection = 1;
    function updateProperty(prop, operation) {
        switch (prop) {
            case 'activeAmplitude':
                activeAmplitude = Math.max(Math.min(operation === '+' ? activeAmplitude + 1 : activeAmplitude - 1, 7), 0);
                break;
            case 'passiveAmplitude':
                passiveAmplitude = Math.max(Math.min(operation === '+' ? passiveAmplitude + 1 : passiveAmplitude - 1, 7), 0);
                break;
            case 'activeWavelength':
                activeWavelength = Math.max(Math.min(operation === '+' ? activeWavelength + .25 : activeWavelength - .25, 7), 0.25);
                break;
            case 'passiveWavelength':
                passiveWavelength = Math.max(Math.min(operation === '+' ? passiveWavelength + .25 : passiveWavelength - .25, 7), 0.25);
                break;
            case 'speedFactor':
                speedFactor = Math.max(Math.min(operation === '+' ? speedFactor + 1 : speedFactor - 1, 8), 1)
                break;
            default:
                console.error('Invalid property');
                return;
        }
        incrementDirection = operation === '+' ? 1 : -1;
    }
</script>

<Toaster position="bottom-left" />

<div class="w-full h-full flex">
    <div class="sliders-container flex-auto h-full flex flex-col items-center justify-center overflow-y-scroll scrollbar-appearance-none py-12">
        {#each sliders as slider (slider.id)}
        <div in:slide={{duration: 250, easing: backOut}} out:fadeSlide={{duration: 150}} class="w-116 h-14 flex items-center gap-4 group {slider.id > 0 && 'mt-4'}">
                <button on:click={() => {copySliderProperties(slider.id)}} class="opacity-0 group-hover:opacity-100 focus-visible:opacity-100 increment-button rounded-full h-8 w-8 md:hover:bg-surface-container text-on-surface flex items-center justify-center md:hover:brightness-95 active:brightness-95 md:active:brightness-[.93] active:scale-95 transition-all duration-100 flex-shrink-0">
                    <div class="material-symbols-rounded text-lg font-semibold">content_copy</div>
                </button>
                <SquigglySlider min=0 max=10 active={slider.active} passive={slider.passive} activeAmplitude={slider.activeAmplitude} passiveAmplitude={slider.passiveAmplitude} activeWavelength={slider.activeWavelength} passiveWavelength={slider.passiveWavelength} speedFactor={slider.speedFactor}></SquigglySlider>   
                <button on:click={() => {removeSlider(slider.id)}} class="opacity-0 group-hover:opacity-100 focus-visible:opacity-100 increment-button rounded-full h-8 w-8 md:hover:bg-surface-container text-on-surface flex items-center justify-center md:hover:brightness-95 active:brightness-95 md:active:brightness-[.93] active:scale-95 transition-all duration-100 flex-shrink-0">
                    <div class="material-symbols-rounded text-lg font-semibold">close</div>
                </button>
            </div>
        {/each}
        {#if sliders.length == 0}
            <h3 in:fade={{delay: 350, duration: 150}} class="font-bold text-sm">Add a slider!</h3>
        {/if}
    </div>
    <div class="w-116 p-4 flex-shrink-0">
        <div class="h-full rounded-xl gap-4 flex flex-col">

            <div class="bg-surface-container pl-6 shadow shadow-black/15 rounded-2xl flex flex-col gap-4">
                <div class="h-16 flex items-center justify-between">
                    <h2 class="font-extrabold">Squiggly Sliders</h2>
                    <button class="global-theme-button button-shadow-left flex items-center w-36 justify-center h-full primary-gradient-background text-on-primary rounded-r-2xl group md:hover:brightness-95 active:brightness-90 md:active:brightness-90">
                        <div class="flex items-center gap-2 group-active:scale-[0.95] transition-transform duration-75">
                            <div class="text-sm font-bold">About</div>
                            <div class="text-lg material-symbols-rounded bold -translate-y-px origin-bottom-right">keyboard_arrow_down</div>
                        </div>
                    </button>
                    <!-- <button role="button" aria-label="button"
                    class="global-theme-button relative button cursor-pointer flex-shrink-0 text-on-primary h-10 button-shadow-default px-5 rounded-xl flex items-center justify-center gap-2 text-sm overflow-hidden
                    focus-visible:scale-[1.02] active:scale-[0.97] primary-gradient-background">
                        <div class="flex gap-1.5 items-center">
                            <div class="text-lg material-symbols-rounded bold -translate-y-px">colors</div>
                            <div class="text-sm font-bold">#808000</div>
                        </div>
                    </button> -->
                </div>
                <!-- <div class="w-full h-px bg-outline-variant"></div> -->
            </div>


            <!-- <div class="bg-surface-container h-16 pl-4 shadow-lg overflow-hidden shadow-gray-600/10 rounded-2xl flex items-center justify-between">
                <h2 class="font-extrabold">Add Slider</h2>
                <button on:click={() => {addSlider()}} class="add-default-button button-shadow-left flex items-center w-36 justify-center h-full primary-container-gradient-background text-on-surface rounded-r-2xl group md:hover:brightness-[.98] active:brightness-95 md:active:brightness-95">
                    <div class="flex items-center gap-2 group-active:scale-[0.95] transition-transform duration-75">
                        <div class="text-lg material-symbols-rounded bold -translate-y-px">add</div>
                        <div class="text-sm font-bold">Default</div>
                    </div>
                </button>
            </div> -->
            <!-- <button role="button" aria-label="button" on:click={() => {addSlider()}}
            class="add-default-button relative button cursor-pointer flex-shrink-0 text-on-primary-container h-10 button-shadow-default px-5 rounded-xl flex items-center justify-center gap-2 text-sm overflow-hidden
            focus-visible:scale-[1.02] active:scale-[0.97] primary-container-gradient-background">
                <div class="flex gap-1.5 items-center">
                    <div class="text-lg material-symbols-rounded bold -translate-y-px">add</div>
                    <div class="text-sm font-bold">Add Default</div>
                </div>
            </button> -->


            <div class="bg-surface-container p-6 shadow shadow-black/15 rounded-2xl flex flex-col gap-6 flex-auto">
                <div class="flex items-center justify-between">
                    <h2 class="font-extrabold">Create your own</h2>
                    <button class="reset-button text-outline hover:bg-surface-container-highest focus-visible:bg-surface-container-highest hover:text-on-surface focus-visible:text-on-surface rounded-full h-7 w-7 flex items-center justify-center">
                        <div class="material-symbols-rounded text-lg font-semibold">replay</div>
                    </button>
                </div>

                <div class="flex h-12 button-shadow-default rounded-2xl">
                    <a class="flex-1 dark:flex-[4] h-full primary-gradient-background text-on-primary rounded-l-xl flex items-center justify-center font-bold text-sm md:hover:brightness-95 active:brightness-90 md:active:brightness-90 group">
                        <div class="w-full h-full flex items-center justify-center">
                            <button class="eyedrop-button rounded-l-2xl h-full flex-auto flex justify-center items-center gap-1.5 active:scale-[0.975] transition-transform duration-150">
                                <div class="text-base origin-bottom-left material-symbols-rounded bold -translate-y-[0.5px]">colorize</div>
                                <div class="text-sm font-bold">Active</div>
                            </button>
                            <!-- <button class="reset-button flex items-center justify-center h-12 w-0 group-hover:w-10 group-focus-within:w-10 transition-all overflow-hidden bg-gray-500/5 backdrop-brightness-90 hover:backdrop-brightness-75 active:scale-[0.975] duration-150">
                                <div class="text-base material-symbols-rounded bold -translate-y-[0.5px]">replay</div>
                            </button> -->
                        </div>
                    </a>
                    <a class="flex-1 dark:flex-[3] h-full on-surface-gradient-background text-surface rounded-r-xl flex items-center justify-center font-bold text-sm md:hover:brightness-95 active:brightness-90 md:active:brightness-90 group">
                        <div class="w-full h-full flex items-center justify-center">
                            <button class="eyedrop-button rounded-r-2xl h-full flex-auto flex justify-center items-center gap-1.5 active:scale-[0.975] transition-transform duration-150">
                                <div class="text-base origin-bottom-left material-symbols-rounded bold -translate-y-[0.5px]">colorize</div>
                                <div class="text-sm font-bold">Passive</div>
                            </button>
                            <!-- <button class="reset-button flex items-center justify-center h-12 w-0 group-hover:w-10 group-focus-within:w-10 transition-all overflow-hidden bg-gray-500/5 backdrop-brightness-90 hover:backdrop-brightness-75 active:scale-[0.975] duration-150">
                                <div class="text-base material-symbols-rounded bold -translate-y-[0.5px]">replay</div>
                            </button> -->
                        </div>
                    </a>
                </div>

                <div class="flex flex-col gap-4 mt-3">
                    <div class="flex items-center w-full justify-between">
                        <div class="flex gap-3 items-center">
                            <button on:click={() => {updateProperty('activeAmplitude', '-')}} class="increment-button rounded-full h-7 w-7 bg-surface-container-highest text-on-surface flex items-center justify-center md:hover:brightness-[.98] active:brightness-95 md:active:brightness-95 active:scale-90 active:duration-[15ms] duration-100 transition-all">
                                <div class="material-symbols-rounded text-base bold">remove</div>
                            </button>
                            <div class="font-bold text-base w-4 flex justify-center -translate-y-0.5">{activeAmplitude}</div>
                            <button on:click={() => {updateProperty('activeAmplitude', '+')}} class="increment-button rounded-full h-7 w-7 bg-surface-container-highest text-on-surface flex items-center justify-center md:hover:brightness-[.98] active:brightness-95 md:active:brightness-95 active:scale-90 active:duration-[15ms] duration-100 transition-all">
                                <div class="material-symbols-rounded text-base bold">add</div>
                            </button>
                        </div>
                        <div class="font-bold flex items-center gap-2 text-sm">
                            <!-- <div class="material-symbols-rounded text-base font-bold">genetics</div> -->
                            Amplitude
                        </div>
                        <div class="flex gap-3 items-center">
                            <button on:click={() => {updateProperty('passiveAmplitude', '-')}} class="increment-button rounded-full h-7 w-7 bg-surface-container-highest text-on-surface flex items-center justify-center md:hover:brightness-[.98] active:brightness-95 md:active:brightness-95 active:scale-90 active:duration-[15ms] duration-100 transition-all">
                                <div class="material-symbols-rounded text-base bold">remove</div>
                            </button>
                            <div class="font-bold text-base w-4 flex justify-center -translate-y-0.5">{passiveAmplitude}</div>
                            <button on:click={() => {updateProperty('passiveAmplitude', '+')}} class="increment-button rounded-full h-7 w-7 bg-surface-container-highest text-on-surface flex items-center justify-center md:hover:brightness-[.98] active:brightness-95 md:active:brightness-95 active:scale-90 active:duration-[15ms] duration-100 transition-all">
                                <div class="material-symbols-rounded text-base bold">add</div>
                            </button>
                        </div>
                    </div>

                    <div class="flex items-center w-full justify-between">
                        <div class="flex gap-3 items-center">
                            <button on:click={() => {updateProperty('activeWavelength', '-')}} class="increment-button rounded-full h-7 w-7 bg-surface-container-highest text-on-surface flex items-center justify-center md:hover:brightness-[.98] active:brightness-95 md:active:brightness-95 active:scale-90 active:duration-[15ms] duration-100 transition-all">
                                <div class="material-symbols-rounded text-base bold">remove</div>
                            </button>
                            <div class="font-bold text-base w-4 flex justify-center -translate-y-0.5">{activeWavelength}</div>
                            <button on:click={() => {updateProperty('activeWavelength', '+')}} class="increment-button rounded-full h-7 w-7 bg-surface-container-highest text-on-surface flex items-center justify-center md:hover:brightness-[.98] active:brightness-95 md:active:brightness-95 active:scale-90 active:duration-[15ms] duration-100 transition-all">
                                <div class="material-symbols-rounded text-base bold">add</div>
                            </button>
                        </div>
                        <div class="font-bold flex items-center gap-2 text-sm">
                            <!-- <div class="material-symbols-rounded text-base font-bold">straighten</div> -->
                            Wavelength
                        </div>
                        <div class="flex gap-3 items-center">
                            <button on:click={() => {updateProperty('passiveWavelength', '-')}} class="increment-button rounded-full h-7 w-7 bg-surface-container-highest text-on-surface flex items-center justify-center md:hover:brightness-[.98] active:brightness-95 md:active:brightness-95 active:scale-90 active:duration-[15ms] duration-100 transition-all">
                                <div class="material-symbols-rounded text-base bold">remove</div>
                            </button>
                            <div class="font-bold text-base w-4 flex justify-center -translate-y-0.5">{passiveWavelength}</div>
                            <button on:click={() => {updateProperty('passiveWavelength', '+')}} class="increment-button rounded-full h-7 w-7 bg-surface-container-highest text-on-surface flex items-center justify-center md:hover:brightness-[.98] active:brightness-95 md:active:brightness-95 active:scale-90 active:duration-[15ms] duration-100 transition-all">
                                <div class="material-symbols-rounded text-base bold">add</div>
                            </button>
                        </div>
                    </div>

                    <div class="flex items-center w-full justify-between">
                        <div class="flex gap-3 items-center">
                            <button on:click={() => {updateProperty('speedFactor', '-')}} class="increment-button rounded-full h-7 w-7 bg-surface-container-highest text-on-surface flex items-center justify-center md:hover:brightness-[.98] active:brightness-95 md:active:brightness-95 active:scale-90 active:duration-[15ms] duration-100 transition-all">
                                <div class="material-symbols-rounded text-base bold">remove</div>
                            </button>
                            <div class="font-bold text-base w-4 flex justify-center -translate-y-0.5">{speedFactor}</div>
                        </div>
                        <div class="font-bold flex items-center gap-2 text-sm">
                            <!-- <div class="material-symbols-rounded text-base font-bold">speed</div> -->
                            Speed Factor
                        </div>
                        <div class="flex gap-3 items-center">
                            <div class="font-bold text-base w-4 flex justify-center -translate-y-0.5">{speedFactor}</div>
                            <button on:click={() => {updateProperty('speedFactor', '+')}} class="increment-button rounded-full h-7 w-7 bg-surface-container-highest text-on-surface flex items-center justify-center md:hover:brightness-[.98] active:brightness-95 md:active:brightness-95 active:scale-90 active:duration-[15ms] duration-100 transition-all">
                                <div class="material-symbols-rounded text-base bold">add</div>
                            </button>
                        </div>
                    </div>
                </div>

                <div class="flex items-center justify-between pt-2">
                    <h2 class="font-extrabold">Preview</h2>
                </div>

                <div class="flex-auto flex items-center justify-center">
                    <div class="w-80">
                        <SquigglySlider value={6} active={activeColor} passive={passiveColor} activeAmplitude={activeAmplitude} passiveAmplitude={passiveAmplitude} activeWavelength={activeWavelength} passiveWavelength={passiveWavelength} speedFactor={speedFactor} />
                    </div>
                </div>

                <!-- <div class="flex items-center gap-3 justify-evenly py-2">
                    <button class="h-8 w-8 rounded-full bg-blue-800 button-shadow-default"></button>
                    <button class="h-8 w-8 rounded-full bg-[#ac0042] button-shadow-default"></button>
                    <button class="h-8 w-8 rounded-full bg-[#851641] button-shadow-default"></button>
                    <button class="h-8 w-8 rounded-full bg-amber-600 button-shadow-default"></button>
                    <button class="h-8 w-8 rounded-full bg-emerald-700 button-shadow-default"></button>
                    <button class="h-8 w-8 rounded-full bg-purple-900 button-shadow-default"></button>
                    <button class="h-8 w-8 rounded-full bg-[hsl(339_52%_60%)] button-shadow-default"></button>
                    <button class="h-8 w-8 rounded-full bg-teal-700 button-shadow-default"></button>
                </div> -->

                <div class="flex w-full justify-end">
                    <button role="button" aria-label="button" on:click={() => {
                        addSlider(
                                '--md-sys-color-primary', 
                                '--md-sys-color-on-surface',
                                activeAmplitude,
                                passiveAmplitude,
                                activeWavelength,
                                passiveWavelength,
                                speedFactor
                            )
                        }}
                    class="add-default-button relative button cursor-pointer flex-shrink-0 text-on-primary h-12 button-shadow-default w-full rounded-xl flex items-center justify-center gap-2 text-sm overflow-hidden
                    focus-visible:scale-[1.02] active:scale-[0.97] primary-gradient-background transition-transform active:duration-[35ms] duration-[350ms] easing-bounce-out">
                        <div class="flex gap-1.5 items-center">
                            <div class="text-lg material-symbols-rounded bold -translate-y-px">add</div>
                            <div class="text-sm font-bold">Add Custom</div>
                        </div>
                    </button>
                </div>
            </div>
            
        </div>
    </div>
</div>


<style lang="scss">
    .add-default-button {
        .material-symbols-rounded {
            animation: rotater 500ms cubic-bezier(0.2, -0.55, 0.265, 2);
        }
        .text-sm {
            animation: pushed 500ms cubic-bezier(0.2, -0.55, 0.265, 1);
        }

        &:active, &:focus-visible {
            .material-symbols-rounded, .text-sm {animation: none;}
        }
    }

    .global-theme-button {
        .material-symbols-rounded {
            animation: drop 500ms cubic-bezier(0.2, -0.55, 0.265, 2);
        }
        .text-sm {
            animation: pushed 500ms cubic-bezier(0.2, -0.55, 0.265, 1);
        }

        &:active, &:focus-visible {
            .material-symbols-rounded, .text-sm {animation: none;}
        }
    }

    .eyedrop-button {
        .material-symbols-rounded {
            animation: drop-back 500ms cubic-bezier(0.2, -0.55, 0.265, 2);
        }
        .text-sm {
            animation: pushed-back 500ms cubic-bezier(0.2, -0.55, 0.265, 1);
        }

        &:active, &:focus-visible {
            .material-symbols-rounded, .text-sm {animation: none;}
        }
    }

    .reset-button {
        .material-symbols-rounded {
            animation: full-rotate 550ms cubic-bezier(0.25, -0.55, 0.265, 1.55);
        }

        &:active, &:focus-visible {
            .material-symbols-rounded {animation: none;}
        }
    }

    @keyframes rotater {
        0% {rotate: 0deg; scale: 1}
        50% {scale: 1.2}
        100% {rotate: 90deg; scale: 1}
    }
    @keyframes drop {
        0% {scale: 1}
        50% {scale: 0.9; rotate: 6deg}
        100% {scale: 1}
    }
    @keyframes drop-back {
        0% {scale: 1}
        50% {scale: 0.9; rotate: -6deg}
        100% {scale: 1}
    }

    @keyframes pushed {
        0% {translate: 0px 0}
        50% {translate: 3px 0;}
        100% {translate: 0 0}
    }
    @keyframes pushed-back {
        0% {translate: 0px 0}
        50% {translate: -3px 0;}
        100% {translate: 0 0}
    }

    @keyframes full-rotate {
        0% {rotate: 0deg}
        100% {rotate: 360deg}
    }
    /* .inner-shadow {
        box-shadow: inset 0 3px 4px 0 rgba(0,0,0,0.05);
    } */
</style>

<!-- <input type="text" class="w-full h-12 border border-surface-container-high placeholder:text-outline-variant
text-sm rounded-lg px-2 bg-surface-container-low font-semibold placeholder:transition-transform overflow-visible placeholder:origin-top-left focus-visible:pt-2 transition-all
focus-visible:outline-primary focus-visible:placeholder:-translate-y-4 focus-visible:placeholder:scale-75 focus-visible:placeholder:text-primary
" value="" placeholder="Active Amplitude (6)" /> -->