<script>
    import SquigglySlider from '$lib/squigglySlider.svelte';
    import Button from '../lib/button.svelte';
    import { fade, scale } from 'svelte/transition';
    import { translateIn, translateOut, fadeSlide } from '$lib/translateIn.js';
    import { backOut, cubicOut, expoOut } from 'svelte/easing';
    import { writable } from 'svelte/store';
    import { Toaster, toast } from 'svelte-sonner';
    import ColorPicker from 'svelte-awesome-color-picker';
    import { onMount } from 'svelte';
    import Modal from '../lib/modal.svelte';
    import { generateSnippet } from '$lib/generateSnippet.js';
    
    // Import highlight.js
    import hljs from 'highlight.js/lib/core';
    import javascript from 'highlight.js/lib/languages/javascript';
    import xml from 'highlight.js/lib/languages/xml';
    import jsx from 'highlight.js/lib/languages/jsx';
    
    // Register languages
    hljs.registerLanguage('javascript', javascript);
    hljs.registerLanguage('xml', xml);
    hljs.registerLanguage('jsx', jsx.default || jsx);

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
    let activeRgb = undefined;
    let passiveRgb = undefined;
    // these settings themselves will be stores but the prop that's actually passed in will be the value of the stores

    let controlCentreDown = false;
    let toasterPosition = 'bottom-left';

    const importPath = 'squiggly-sliders';
    const snippetValue = 6;
    const minVal = 0;
    const maxVal = 10;
    const stepVal = 1;
    
    // Framework selector
    let framework = 'svelte'; // 'svelte' | 'react' | 'javascript'
    let instructionsModalVisible = false;
    
    // Load framework preference from localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
        const savedFramework = localStorage.getItem('squiggly-sliders-framework');
        if (savedFramework && ['svelte', 'react', 'javascript'].includes(savedFramework)) {
            framework = savedFramework;
        }
    }
    
    // Save framework preference to localStorage when it changes
    $: if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('squiggly-sliders-framework', framework);
    }

    $: currentSnippet = generateSnippet({
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
    }, importPath, framework);

    onMount(() => {
        controlCentreDown = false;
        if (window.innerWidth <= 648) {
            toasterPosition = 'top-left';
        }
    })


    async function copySnippet() {
        try {
            await navigator.clipboard.writeText(currentSnippet);
            toast.success('Snippet copied to clipboard!', {
                classes: {
                    toast: "raleway flex items-center rounded-xl h-12 md:easing-decelerate shadow-md border-none bg-inverse-surface text-inverse-on-surface dark:bg-secondary-fixed dark:text-inverse-on-secondary-fixed"
                }
            });
        } catch (err) {
            toast.error('Failed to copy snippet');
        }
    }

    function escapeHtml(s) {
        return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
    function highlightSnippet(code) {
        if (!code) return '';
        // Use highlight.js to highlight the code based on framework
        let language = 'xml';
        if (framework === 'react') {
            language = 'jsx';
        } else if (framework === 'javascript') {
            language = 'xml';
        }
        const highlighted = hljs.highlight(code, { language }).value;
        return highlighted;
    }

    let idCount = 0;
    const addSlider = (
            active = '--md-sys-color-primary',
            passive = '--md-sys-color-on-surface',
            activeAmplitude = 4,
            passiveAmplitude = 2,
            activeWavelength = 1,
            passiveWavelength = 1,
            speedFactor = 4,
            val = 4 + Math.floor(Math.random() * (4))
        ) => 
    {   
        if (typeof window !== 'undefined') {
            // if ((sliders.length - 1) * (50 + 16 * 4) > window.innerHeight) {
            //     toast.error(`Please remove a slider to add another`, {
            //         classes: {
            //             toast: "raleway flex items-center rounded-xl h-12 easing-decelerate shadow-md border-none bg-inverse-surface text-inverse-on-surface dark:bg-secondary-fixed dark:text-inverse-on-secondary-fixed"
            //         }
            //     })
            //     return;
            // }
            setTimeout(() => {
                if (sliders.length <= 4) return;
                // controlCentreDown = true;
                const slidersContainer = document.querySelector('.sliders-container');
                slidersContainer.scrollTo({
                    top: slidersContainer.scrollHeight,
                    behaviour: 'smooth'
                })
            }, 150)
        }
        const newSlider = {
            id: idCount + 1,
            active,
            passive,
            activeAmplitude,
            passiveAmplitude,
            activeWavelength,
            passiveWavelength,
            speedFactor,
            val
        }
        idCount++;
        sliders = [...sliders, newSlider]
    }

    // [0,1,2,3].map(n => {addSlider(n == 2 ? '--md-sys-color-tertiary' : '--md-sys-color-primary')});
    addSlider();
    addSlider('--md-sys-color-secondary', '--md-sys-color-on-surface', 7, 0, 0.6, 2, 4, 4); // 0.07, 0.1
    addSlider('--md-sys-color-tertiary');
    addSlider('--slider-color-4', '--md-sys-color-on-surface', 4, 0, 1.5, 1);

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
        controlCentreDown = false;
        toast.success(` Properties copied to custom slider`, {
            classes: {
                toast: "raleway flex items-center rounded-xl h-12 md:easing-decelerate shadow-md border-none bg-inverse-surface text-inverse-on-surface dark:bg-secondary-fixed dark:text-inverse-on-secondary-fixed"
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

    function setProperties(a = activeColor, p = passiveColor, aA = activeAmplitude, pA = passiveAmplitude, aW = activeWavelength, pW = passiveWavelength, s = speedFactor) {
        activeColor = a;
        passiveColor = p;
        activeAmplitude = aA;
        passiveAmplitude = pA;
        activeWavelength = aW;
        passiveWavelength = pW;
        speedFactor = s;
    }

    function resetProperties() {
        setProperties('--md-sys-color-primary', '--md-sys-color-on-surface', 4, 2, 1, 1, 4)
    }

    // function inputColor(e, type) {
    //     switch (type) {
    //         case 'active':
    //             activeColor = e.detail.hex; 
    //             // rgb = {
    //             //     r: e.detail.rgb.r,
    //             //     g: e.detail.rgb.g,
    //             //     b: e.detail.rgb.b
    //             // }
    //             // document.documentElement.style.setProperty('--md-sys-color-primary', activeColor);
    //             break;
    //         case 'passive':
    //             passiveColor = e.detail.hex; 
    //             break;
    //     }
    // }

    function toggleControlCentre() {
        controlCentreDown = !controlCentreDown;
    }

    const sampleColors = [
        '--slider-color-1',
        '--slider-color-2',
        '--slider-color-3',
        '--slider-color-4',
        '--slider-color-5',
        '--slider-color-6',
        '--slider-color-7',
        '--slider-color-8',
    ]
    const samplePassiveColors = [
        '--slider-passive-color-1',
        '--slider-passive-color-2',
        '--slider-passive-color-3',
        '--slider-passive-color-4',
    ]
    let activePickerOpen = false;
    let passivePickerOpen = false;


    let initialTranslation = 0;
    let controlCentreCard, controlCentreButton;
    let start, velocity;
    let point1 = {}, point2 = {};
    let swiping = false;
    function swipeStart(e) {
        start = e.touches ? e.touches[0].clientY : e.clientY;
        swiping = true;
        controlCentreCard.classList.add('no-transition-important');
    }
    function swipeMove(e) {
        if (!swiping) return;

        // Shift the points
        point1 = point2;

        // Record the position of the current touchmove event
        point2 = {
            time: new Date().getTime(),
            y: e.touches ? e.touches[0].clientY : e.clientY
        };

        velocity = (point2.y - point1.y) / (point2.time - point1.time);
        const dT = point2.y - start;
        controlCentreCard.style.translate = `0 ${initialTranslation + dT}px`;
        // if (dT > 75) {
        //     swipeEnd();
        // }

    }
    function swipeEnd() {
        if (velocity == 0) return;
        controlCentreCard.classList.remove('no-transition-important');
        swiping = false;
        if (velocity >= 0) {
            controlCentreDown = true;
        } 
        else {
            controlCentreDown = false;
        }
        controlCentreCard.style.translate = `0 ${initialTranslation}px`;
        velocity = 0;
    }

</script>

<Toaster bind:position={toasterPosition} />
<div class="page-container w-full h-full flex flex-col md:flex-row overflow-hidden">
    
    <div class="sliders-container flex-auto h-screen flex flex-col items-center md:justify-center overflow-y-scroll pb-16 md:pb-0 md:py-0">
        <div class="flex md:hidden fixed top-0 left-0 w-full pt-6 pb-0 px-7 z-20 items-center justify-between">
            <h1 class="text-sm font-bold z-10">Squiggly Sliders</h1>
            <Modal classes="z-10">
                <button class="increment-button rounded-full h-6 w-6 active:scale-90 bg-surface-container-high duration-75 text-on-surface flex items-center justify-center">
                    <div class="material-symbols-rounded text-xs font-bold text-outline">info_i</div>
                </button>
            </Modal>
            <div class="absolute -top-px left-0 w-full h-[150%] pointer-events-none lng"></div>
            <div class="absolute -top-px left-0 w-full h-[175%] pointer-events-none lng"></div>
            <div class="absolute -top-px left-0 w-full h-[200%] pointer-events-none lng"></div>
            <div class="absolute -top-px left-0 w-full h-[200%] pointer-events-none lng"></div>
        </div>
        <div class="block md:hidden w-full h-12 flex-shrink-0"></div>
        {#each sliders as slider (slider.id)}
        <div in:slide={{duration: 250, easing: backOut}} out:fadeSlide={{duration: 150}} class="w-full md:w-116 h-14 flex items-center justify-between md:justify-center lg:justify-between px-6 md:px-2 gap-4 group flex-shrink-0 {slider.id > 0 && 'mt-3 md:mt-4'}">
                <button on:click={() => {copySliderProperties(slider.id)}} class="opacity-1 lg:opacity-0 group-hover:opacity-100 focus-visible:opacity-100 increment-button rounded-full h-8 w-8 md:hover:bg-surface-container text-outline lg:text-on-surface flex items-center justify-center md:hover:brightness-95 active:brightness-95 md:active:brightness-[.93] active:scale-95 transition-all duration-100 flex-shrink-0">
                    <div class="material-symbols-rounded text-lg font-semibold">content_copy</div>
                </button>
                <div class="w-8/12 md:w-7/12 lg:w-full">
                    <SquigglySlider min=0 max=10 active={slider.active} passive={slider.passive} activeAmplitude={slider.activeAmplitude} passiveAmplitude={slider.passiveAmplitude} activeWavelength={slider.activeWavelength} passiveWavelength={slider.passiveWavelength} speedFactor={slider.speedFactor} value={slider.val}></SquigglySlider>   
                </div>
                <button on:click={() => {removeSlider(slider.id)}} class="opacity-1 lg:opacity-0 group-hover:opacity-100 focus-visible:opacity-100 increment-button rounded-full h-8 w-8 md:hover:bg-surface-container text-outline lg:text-on-surface flex items-center justify-center md:hover:brightness-95 active:brightness-95 md:active:brightness-[.93] active:scale-95 transition-all duration-100 flex-shrink-0">
                    <div class="material-symbols-rounded text-lg font-semibold">close</div>
                </button>
            </div>
        {/each}
        {#if sliders.length == 0}
            <h3 in:fade={{delay: 350, duration: 150}} class="font-bold text-sm">Add a slider!</h3>
        {/if}
    </div>
    <!-- <div class="{controlCentreDown ? 'flex-0' : 'flex-1'} transition-all duration-300 easing-emphasized"></div> -->
    <div class="w-full md:w-116 p-4 bottom-0 left-0">
        <!-- translate-y-[calc(100%-3rem)] md:translate-y-0 -->
        <div class="w-full md:h-full rounded-xl gap-4 flex-col grid items-end justify-stretch md:flex transition-all duration-300 easing-emphasized
        {controlCentreDown ? 'grid-rows-[0px]' : 'grid-rows-1'} md:grid-rows-1">

            <div class="hidden md:flex w-full card-background pl-4 md:pl-6 pr-2 shadow shadow-black/15 rounded-2xl flex-col gap-4">
                <div class="h-16 flex items-center justify-between">
                    <h2 class="font-extrabold">Squiggly Sliders</h2>
                    <!-- <Modal classes="justify-end">
                        <div class="global-theme-button button-shadow-left flex items-center w-36 justify-center h-full primary-gradient-background text-on-primary rounded-r-2xl group md:active:brightness-95">
                            <div class="flex items-center gap-2 group-active:scale-[0.95] transition-transform duration-75">
                                <div class="text-sm font-bold">About</div>
                                <div class="text-lg material-symbols-rounded bold -translate-y-px origin-bottom-right">keyboard_arrow_down</div>
                            </div>
                        </div>
                    </Modal> -->
                    <Modal classes="items-center">
                        <button role="button" aria-label="button"
                        class="global-theme-button relative button cursor-pointer flex-shrink-0 text-on-primary h-12 min-w-12 px-[15px] button-shadow-default rounded-xl flex items-center justify-center gap-2 text-sm overflow-hidden
                        focus-visible:scale-[1.02] active:scale-[0.97] primary-gradient-background group">
                            <div class="flex items-center">
                                <div class="text-sm font-bold transition-all duration-200 delay-0 md:group-hover:delay-100 easing-emphasized 
                                            w-0 overflow-hidden group-hover:mr-1.5 group-hover:w-12 group-focus-visible:mr-1.5 group-focus-visible:w-12">
                                    <div class="">About</div>
                                </div>
                                <div class="text-lg material-symbols-rounded bold -translate-y-[0.5px] transition-all duration-200 delay-0 md:group-hover:delay-75 easing-emphasized
                                            group-hover:scale-95 group-focus-visiblex:scale-95">
                                    info
                                </div>
                            </div>
                        </button>
                    </Modal>
                </div>
            </div>

            <div bind:this={controlCentreCard} class="card-background md:flex-auto row-span-auto w-full p-4 md:p-6 pt-0 md:pt-6 shadow-[0_-3px_5px_1px_rgba(0,0,0,0.075)] md:shadow md:shadow-black/15 
            rounded-2xl flex flex-col gap-4 md:gap-6 flex-auto transition-all duration-500 easing-quint-out
            {controlCentreDown ? 'translate-y-[calc(100%_-_1.5rem)] md:translate-y-0' : ''}">

                <button on:click={toggleControlCentre} bind:this={controlCentreButton} on:touchstart={swipeStart} on:touchmove={swipeMove} on:touchend={swipeEnd}
                        class="flex md:hidden w-full h-2 pt-4 pb-1 box-content items-center justify-center">
                    <div class="material-symbols-rounded scale-x-125 {controlCentreDown ? '-scale-y-90' : 'scale-y-90'} transition-transform text-outline">keyboard_arrow_down</div>
                </button>
                <div class="hidden md:flex items-center justify-between">
                    <h2 class="font-extrabold">Create your own</h2>
                    <button on:click={resetProperties} class="reset-button text-on-surface-variant  hover:bg-surface-container-highest focus-visible:bg-surface-container-highest hover:text-on-surface focus-visible:text-on-surface rounded-full h-7 w-7 flex items-center justify-center">
                        <div class="material-symbols-rounded text-lg font-semibold">replay</div>
                    </button>
                </div>

                <div class="flex h-12 button-shadow-default rounded-2xl">
                    <button on:click={() => {activePickerOpen = !activePickerOpen;}} 
                        class="{activePickerOpen ? 'cursor-auto' : 'cursor-pointer'} eyedrop-button flex-1 dark:flex-[4] h-full text-on-primary rounded-l-xl flex items-center justify-center font-bold text-sm group">
                        
                        {#if activePickerOpen} 
                            <div transition:fade={{duration: 100}} class="fixed top-0 left-0 w-full h-full z-10 backdrop-blur-sm bg-black/0 dark:bg-white/[2.5%]"></div>
                        {/if}
                        
                        <div class="relative duration-300 text-on-primary {activeColor === '--md-sys-color-primary' || activeColor === '--slider-color-1' || activeColor === '--md-sys-color-tertiary' ? '' : 'dark:text-on-surface'} 
                                    flex-shrink-0 flex flex-col items-center justify-center
                           {activePickerOpen ? 
                                'w-[calc(100%_+_80px)] translate-x-5 md:translate-x-3 translate-y-4 bg-inverse-surface text-inverse-on-surface dark:text-inverse-on-surface h-40 rounded-2xl z-10 shadow-xl rounded-l-2xl easing-bounce-out-light' : 
                                'w-full h-full rounded-l-2xl easing-emphasized z-0'}"
                            style="{activePickerOpen ? '' : `background-color: var(${activeColor})`}">

                        <div class="absolute top-0 left-0 w-full h-full bg-light-gradient rounded-l-xl {activePickerOpen && 'opacity-0'}"></div>
                            
                            <div class="rounded-l-2xl h-12 flex-shrink flex justify-between w-full items-center px-3 transition duration-300 easing-emphasized">
                                <div aria-hidden="true" class="opacity-0 increment-button rounded-full h-8 w-8 text-on-surface flex items-center justify-center flex-shrink-0"></div>
                                <div class="flex items-center justify-center gap-1 5">
                                    <div class="text-base origin-bottom-left material-symbols-rounded bold -translate-y-[0.5px]">colorize</div>
                                    <div class="text-sm font-bold">Active</div>
                                </div>
                                <button tabindex={activePickerOpen ? 0 : -1} on:click={() => {}} class="{activePickerOpen ? 'opacity-1 delay-100 duration-200' : 'opacity-0 duration-100'} increment-button rounded-full flex items-center justify-center md:hover:brightness-95 active:brightness-95 md:active:brightness-[.93] active:scale-95 transition-all duration-100 flex-shrink-0">
                                    <div class="material-symbols-rounded text-lg font-semibold text-inverse-on-surface">close</div>
                                </button>
                            </div>

                            <div class="w-full flex-shrink-0 {activePickerOpen ? 'flex-1 h-28' : 'flex-0 h-0'} overflow-hidden transition-all duration-300 easing-emphasized">
                                <div class="{activePickerOpen ? 'opacity-1 delay-100 duration-200' : 'opacity-0 scale-90 duration-75'} w-full h-full grid grid-cols-4 gap-2 p-3 pt-0 place-items-center">
                                    {#each sampleColors as color}
                                    <button on:click={() => {setProperties(color)}} tabindex={activePickerOpen ? 0 : -1} class="h-full w-full rounded-xl border border-b-2 border-white/15 relative group/button" style="background-color: {color[0] === '-' ? `var(${color})` : `${color}`}">
                                        <div class="absolute top-0 left-0 w-full h-full rounded-xl bg-gradient-to-br from-transparent to-transparent via-white/15 dark:via-black/25 opacity-50 group-hover/button:opacity-100 transition duration-150"></div>
                                    </button>
                                    {/each}
                                </div>
                            </div>

                        </div>

                    </button>
                    
                    <button on:click={() => {passivePickerOpen = !passivePickerOpen;}} 
                        class="{passivePickerOpen ? 'cursor-auto' : 'cursor-pointer'} eyedrop-button flex-1 dark:flex-[4] h-full text-on-primary rounded-r-xl flex items-center justify-center font-bold text-sm group">
                        
                        {#if passivePickerOpen} 
                            <div transition:fade={{duration: 100}} class="fixed top-0 left-0 w-full h-full z-10 backdrop-blur-sm bg-black/0 dark:bg-white/[2.5%]"></div>
                        {/if}
                        
                        <div class="relative duration-300 text-on-primary {activeColor === '--md-sys-color-primary' || activeColor === '--slider-color-1' ? '' : 'dark:text-on-surface'} flex-shrink-0 flex flex-col items-center justify-center
                           {passivePickerOpen ? 
                                'w-[calc(100%_+_80px)] -translate-x-5 md:-translate-x-3 translate-y-4 bg-inverse-surface text-inverse-on-surface dark:text-inverse-on-surface h-40 rounded-2xl z-10 shadow-xl rounded-r-2xl easing-bounce-out-light' : 
                                'w-full h-full rounded-r-2xl easing-emphasized'}"
                            style="{passivePickerOpen ? '' : `background-color: var(${passiveColor}); color: var(${passiveColor}-text);`}">

                        <div class="absolute top-0 left-0 w-full h-full bg-light-gradient rounded-l-xl {passivePickerOpen && 'opacity-0'}"></div>
                            
                            <div class="rounded-l-2xl h-12 flex-shrink flex justify-between w-full items-center px-3 transition duration-300 easing-emphasized">
                                <div aria-hidden="true" class="opacity-0 increment-button rounded-full h-8 w-8 text-on-surface flex items-center justify-center flex-shrink-0"></div>
                                <div class="flex items-center justify-center gap-1 5">
                                    <div class="text-base origin-bottom-left material-symbols-rounded bold -translate-y-[0.5px]">colorize</div>
                                    <div class="text-sm font-bold">Passive</div>
                                </div>
                                <button tabindex={passivePickerOpen ? 0 : -1} on:click={() => {}} class="{passivePickerOpen ? 'opacity-1 delay-100 duration-200' : 'opacity-0 duration-100'} increment-button rounded-full flex items-center justify-center md:hover:brightness-95 active:brightness-95 md:active:brightness-[.93] active:scale-95 transition-all duration-100 flex-shrink-0">
                                    <div class="material-symbols-rounded text-lg font-semibold text-inverse-on-surface">close</div>
                                </button>
                            </div>

                            <div class="w-full flex-shrink-0 {passivePickerOpen ? 'flex-1 h-28' : 'flex-0 h-0'} overflow-hidden transition-all duration-300 easing-emphasized">
                                <div class="{passivePickerOpen ? 'opacity-1 delay-100 duration-200' : 'opacity-0 scale-90 duration-75'} w-full h-full grid grid-cols-4 gap-2 p-3 pt-0 place-items-center">
                                    {#each samplePassiveColors as color, index}
                                    <button on:click={() => {setProperties(activeColor, color)}} tabindex={passivePickerOpen ? 0 : -1} class="{index % 2 === 0 ? '' : 'col-span-3'} h-full w-full rounded-xl border border-b-2 border-white/15 relative group/button" style="background-color: {color[0] === '-' ? `var(${color})` : `${color}`}">
                                        <div class="absolute top-0 left-0 w-full h-full rounded-xl bg-gradient-to-br from-transparent to-transparent via-white/15 dark:via-black/15 opacity-50 group-hover/button:opacity-100 transition duration-150"></div>
                                    </button>
                                    {/each}
                                </div>
                            </div>

                        </div>

                    </button>
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
                        </div>
                        <div class="font-bold flex items-center gap-2 text-sm">
                            <!-- <div class="material-symbols-rounded text-base font-bold">speed</div> -->
                            Spee
                            <div class="font-bold text-base flex justify-center -translate-y-px gap-1">
                                ( 
                                <div class="-translate-y-px">
                                    {speedFactor}
                                </div>
                                )
                            </div>
                            eeed
                        </div>
                        <div class="flex gap-3 items-center">
                            <button on:click={() => {updateProperty('speedFactor', '+')}} class="increment-button rounded-full h-7 w-7 bg-surface-container-highest text-on-surface flex items-center justify-center md:hover:brightness-[.98] active:brightness-95 md:active:brightness-95 active:scale-90 active:duration-[15ms] duration-100 transition-all">
                                <div class="material-symbols-rounded text-base bold">add</div>
                            </button>
                        </div>
                    </div>

                    <div class="w-full h-10 flex rounded-xl border border-outline-variant my-2">
                        <button on:click={() => {setProperties('--slider-color-1', '--slider-passive-color-2', 7, 0, 0.6, 1, 4)}} 
                            class="flex-1 flex items-center justify-center border-r border-outline-variant rounded-l-xl font-semibold hover:bg-surface-container-highest active:brightness-[.98]">
                            <img class="saturate-0 dark:invert h-5" src="/wave3.svg" />
                        </button>
                        <button on:click={() => {setProperties('--slider-color-4', '--slider-passive-color-2', 4, 0, 1.5, passiveWavelength, 1)}} 
                            class="flex-1 flex items-center justify-center border-r border-outline-variant hover:bg-surface-container-highest active:brightness-[.98]">
                            <img class="saturate-0 dark:invert h-[.31rem]" src="/wave4.svg" />
                        </button>
                        <button on:click={() => {setProperties('--md-sys-color-tertiary', '--slider-passive-color-2', 4, 2, 1, 1, 4)}} 
                            class="flex-1 flex items-center justify-center border-r border-outline-variant hover:bg-surface-container-highest active:brightness-[.98]">
                            <img class="saturate-0 dark:invert h-4" src="/wave1.svg" />
                        </button>
                        <button on:click={() => {setProperties('--slider-color-5', '--slider-passive-color-2', 4, 0, 0.1, 2, 1)}} 
                            class="flex-1 flex items-center justify-center rounded-r-xl hover:bg-surface-container-highest active:brightness-[.98]">
                            <svg class="saturate-0 dark:invert h-3 w-3 rotate-90" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 0c53 0 96 43 96 96v3.6c0 15.7-12.7 28.4-28.4 28.4H188.4c-15.7 0-28.4-12.7-28.4-28.4V96c0-53 43-96 96-96zM41.4 105.4c12.5-12.5 32.8-12.5 45.3 0l64 64c.7 .7 1.3 1.4 1.9 2.1c14.2-7.3 30.4-11.4 47.5-11.4H312c17.1 0 33.2 4.1 47.5 11.4c.6-.7 1.2-1.4 1.9-2.1l64-64c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3l-64 64c-.7 .7-1.4 1.3-2.1 1.9c6.2 12 10.1 25.3 11.1 39.5H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H416c0 24.6-5.5 47.8-15.4 68.6c2.2 1.3 4.2 2.9 6 4.8l64 64c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0l-63.1-63.1c-24.5 21.8-55.8 36.2-90.3 39.6V240c0-8.8-7.2-16-16-16s-16 7.2-16 16V479.2c-34.5-3.4-65.8-17.8-90.3-39.6L86.6 502.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l64-64c1.9-1.9 3.9-3.4 6-4.8C101.5 367.8 96 344.6 96 320H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H96.3c1.1-14.1 5-27.5 11.1-39.5c-.7-.6-1.4-1.2-2.1-1.9l-64-64c-12.5-12.5-12.5-32.8 0-45.3z"/></svg>
                        </button>
                    </div>
                    <!-- <div class="w-full h-px bg-outline-variant"></div> -->
                </div>


                <div class="hidden md:flex items-center justify-between">
                    <h2 class="font-extrabold">Preview</h2>
                    <div class="flex items-center gap-4">
                        <button 
                            on:click={() => {instructionsModalVisible = true}} 
                            class="text-on-surface text-sm font-medium transition-colors duration-200 hover:text-on-surface-variant focus-visible:text-on-surface-variant"
                            aria-label="Instructions"
                        >
                            Instructions
                        </button>
                        <select 
                            bind:value={framework}
                            class="bg-surface-container-highest text-on-surface text-sm rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
                            aria-label="Select framework for code snippet"
                        >
                            <option value="svelte">Svelte</option>
                            <option value="react">React</option>
                            <option value="javascript">JavaScript</option>
                        </select>
                    </div>
                </div>

                <div class="flex-auto flex flex-col items-center justify-center relative py-4">
                    {#if passiveColor === '--slider-passive-color-1' || passiveColor == '--slider-passive-color-3'}
                    <div class="absolute -top-4 left-0 text-xs text-outline flex dark:hidden gap-2  text-balance">
                        <div class="material-symbols-rounded text-base">info</div>
                        <p>Lighter passive colors cannot be seen properly in the slider preview. Please make sure your sliders have a sufficient contrast ratio. Add slider to view proper result.</p>
                    </div>
                    {/if}
                    <div class="w-80">
                        <SquigglySlider value={6} active={activeColor} passive={passiveColor} activeAmplitude={activeAmplitude} passiveAmplitude={passiveAmplitude} activeWavelength={activeWavelength} passiveWavelength={passiveWavelength} speedFactor={speedFactor} />
                    </div>
                </div>

                <div class="relative text-surface">
                    <button on:click={copySnippet} class="absolute top-2 right-2 increment-button rounded-full h-7 w-7 flex items-center justify-center hover:brightness-110 active:scale-95 transition-all" aria-label="Copy code">
                        <div class="material-symbols-rounded text-base">content_copy</div>
                    </button>
                    <pre class="overflow-auto p-0 text-[13px] leading-5 font-mono"><code class="hljs rounded-xl">{@html highlightSnippet(currentSnippet)}</code></pre>
                </div>

                <div class="flex w-full justify-end">
                    <button role="button" aria-label="button" on:click={() => {
                        addSlider(
                                activeColor, 
                                passiveColor,
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
                            <div class="text-sm font-bold">Add Slider</div>
                        </div>
                    </button>
                </div>
            </div>
            
        </div>
    </div>
</div>


<style lang="scss">
    .lng {
        background: var(--md-sys-color-surface);
        background: linear-gradient(180deg, var(--md-sys-color-surface) 0%, rgba(253,249,236,0) 99%);
    }

    .transition-all.duration-300.easing-emphasized {
        transition: all 300ms var(--md-sys-motion-easing-emphasized), z-index 300ms step-end;
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
        50% {translate: -1px 0;}
        100% {translate: 0 0}
    }

    @keyframes full-rotate {
        0% {rotate: 0deg}
        100% {rotate: 360deg}
    }
    /* .inner-shadow {
        box-shadow: inset 0 3px 4px 0 rgba(0,0,0,0.05);
    } */

    .tok-key{color:#bb9af7}
    .tok-tag{color:#7aa2f7}
    .tok-attr{color:#e0af68}
    .tok-string{color:#9ece6a}
    .tok-number{color:#ff9e64}
</style>


{#if instructionsModalVisible}
    <div in:fade={{duration: 300, easing: cubicOut}} out:fade={{duration: 200, easing: cubicOut}} on:click={() => {instructionsModalVisible = false}} class="fixed top-0 left-0 w-full h-full backdrop-blur-lg z-30 bg-[rgba(253,249,236,0.85)] dark:bg-[rgba(20,20,12,.85)]"></div>
    <div in:scale={{duration: 300, easing: cubicOut}} out:scale={{duration: 200, easing: cubicOut}} class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] md:w-108 z-30">
        <div class="ios-nav-in flex flex-col items-center gap-6 w-full h-full p-2 pt-4 bg-surface-container shadow-lg rounded-2xl">
            <button on:click={() => {instructionsModalVisible = false}} style="scale: 0;" 
                class="scale-up animation-delay-50 easing-elastic absolute top-0 right-4 -mt-4 rounded-full button-shadow-default1 border border-dashed border-outline-variant dark:border-outline-variant h-8 w-8 bg-surface-container-high text-outline lg:text-on-surface flex items-center justify-center md:hover:brightness-95 active:brightness-95 md:active:brightness-[.93] active:scale-95 transition-all duration-100 flex-shrink-0">
                <div class="material-symbols-rounded text-xl font-semibold">close</div>
            </button>
            <h1 class="text-2xl font-bold flex-shrink-0 mt-2">Framework Instructions</h1>
            <div class="px-[10%] flex flex-col gap-4 text-center w-full">
                {#if framework === 'svelte'}
                    <div class="text-left">
                        <h2 class="font-bold text-lg mb-2">Svelte Usage</h2>
                        <p class="text-sm mb-3">Install the package:</p>
                        <pre class="bg-surface-container-highest p-3 rounded-lg text-sm mb-3"><code>npm i squiggly-sliders</code></pre>
                        <p class="text-sm mb-3">Import the component:</p>
                        <pre class="bg-surface-container-highest p-3 rounded-lg text-sm mb-3"><code>import SquigglySlider from 'squiggly-sliders'</code></pre>
                        <p class="text-sm">Use the component:</p>
                    </div>
                {:else if framework === 'react'}
                    <div class="text-left">
                        <h2 class="font-bold text-lg mb-2">React Usage</h2>
                        <p class="text-sm mb-3">The React component can be found at:</p>
                        <pre class="bg-surface-container-highest p-3 rounded-lg text-sm mb-3"><code>src/lib/react/SquigglySlider.jsx</code></pre>
                        <p class="text-xs mb-1"><a href="https://github.com/raayyananan/squiggly-sliders/blob/main/src/lib/react/SquigglySlider.jsx" target="_blank" class="text-primary hover:underline">View on GitHub →</a></p>
                        <p class="text-sm mb-3">Copy this file into your project and import it locally:</p>
                        <pre class="bg-surface-container-highest p-3 rounded-lg text-sm mb-3"><code>import SquigglySlider from './SquigglySlider.jsx'</code></pre>
                        <p class="text-sm">Use the component (note the camelCase props):</p>
                    </div>
                {:else if framework === 'javascript'}
                    <div class="text-left">
                        <h2 class="font-bold text-lg mb-2">JavaScript/Web Component Usage</h2>
                        <p class="text-sm mb-3">The Web Component can be found at:</p>
                        <pre class="bg-surface-container-highest p-3 rounded-lg text-sm mb-3"><code>src/lib/SquigglySlider.js</code></pre>
                        <p class="text-xs mb-1"><a href="https://github.com/raayyananan/squiggly-sliders/blob/main/src/lib/SquigglySlider.js" target="_blank" class="text-primary hover:underline">View on GitHub →</a></p>
                        <p class="text-sm mb-3">Or the element implementation:</p>
                        <pre class="bg-surface-container-highest p-3 rounded-lg text-sm mb-3"><code>src/lib/web/SquigglySliderElement.js</code></pre>
                        <p class="text-xs mb-1"><a href="https://github.com/raayyananan/squiggly-sliders/blob/main/src/lib/web/SquigglySliderElement.js" target="_blank" class="text-primary hover:underline">View on GitHub →</a></p>
                        <p class="text-sm mb-3">Copy one of these files into your project and import it, or import it from a built file if published.</p>
                        <p class="text-sm">Use the component with dash-case attributes:</p>
                    </div>
                {/if}
                <div class="text-left">
                    <pre class="bg-surface-container-highest p-3 rounded-lg text-sm"><code>{@html highlightSnippet(currentSnippet)}</code></pre>
                </div>
            </div>
        </div>
    </div>        
{/if}
