<script>
    import { fade } from "svelte/transition";
    import "../app.scss";
    // import { Toaster } from "svelte-sonner";
    let activeColor = '--slider-color-1',
    passiveColor = '--slider-passive-color-2'
    let activePickerOpen = false, passivePickerOpen = false;
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
</script>

<!-- <Toaster /> -->

<slot></slot>

<!-- <div class="block md:hidden fixed w-full top-0 left-0 h-full bg-black/15 backdrop-blur-xl"></div> -->
<!-- <div class="block md:hidden fixed w-full bottom-0 left-0 p-4">
    <div class="h-14 w-full flex items-center justify-between bg-surface-container shadow rounded-2xl px-1 gap-2">
        
        <div class="flex h-12 button-shadow-default rounded-xl">
            <button on:click={() => {activePickerOpen = !activePickerOpen;}} 
                class="{activePickerOpen ? 'cursor-auto' : 'cursor-pointer'} eyedrop-button flex-1 dark:flex-[4] h-full text-on-primary rounded-l-xl flex items-center justify-center font-bold text-sm group">
                
                {#if activePickerOpen} 
                    <div transition:fade={{duration: 100}} class="fixed top-0 left-0 w-full h-full z-10 backdrop-blur-sm bg-black/0 dark:bg-white/[2.5%]"></div>
                {/if}
                
                <div class="relative duration-300 text-on-primary dark:text-on-surface flex-shrink-0 flex flex-col items-center justify-center
                   {activePickerOpen ? 
                        'w-[calc(100%_+_80px)] translate-x-3 translate-y-4 bg-inverse-surface text-inverse-on-surface h-40 rounded-2xl z-10 shadow-xl rounded-l-2xl easing-bounce-out-light' : 
                        'w-full h-full rounded-l-xl easing-emphasized z-0'}"
                    style="{activePickerOpen ? '' : `background-color: var(${activeColor})`}">

                <div class="absolute top-0 left-0 w-full h-full bg-light-gradient rounded-l-xl {activePickerOpen && 'opacity-0'}"></div>
                    
                    <div class="rounded-l-2xl h-12 flex-shrink flex justify-center w-full items-center px-3 transition duration-300 easing-emphasized">
                   
                        <div class="flex items-center justify-center gap-1 5">
                            <div class="text-base origin-bottom-left material-symbols-rounded bold -translate-y-[0.5px]">colorize</div>
                        </div>
                    </div>

                    <div class="w-full flex-shrink-0 {activePickerOpen ? 'flex-1 h-28' : 'flex-0 h-0'} overflow-hidden transition-all duration-300 easing-emphasized">
                        <div class="{activePickerOpen ? 'opacity-1 delay-100 duration-200' : 'opacity-0 scale-90 duration-75'} w-full h-full grid grid-cols-4 gap-2 p-3 pt-0 place-items-center">
                            {#each sampleColors as color}
                            <button on:click={() => {setProperties(color)}} tabindex={activePickerOpen ? 0 : -1} class="h-full w-full rounded-xl border border-b-2 border-white/15 relative group/button" style="background-color: {color[0] === '-' ? `var(${color})` : `${color}`}">
                                <div class="absolute top-0 left-0 w-full h-full rounded-xl bg-gradient-to-br from-transparent to-transparent via-white/15 opacity-50 group-hover/button:opacity-100 transition duration-150"></div>
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
                
                <div class="relative duration-300 text-on-primary dark:text-on-surface flex-shrink-0 flex flex-col items-center justify-center
                   {passivePickerOpen ? 
                        'w-[calc(100%_+_80px)] -translate-x-3 translate-y-4 bg-inverse-surface text-inverse-on-surface h-40 rounded-2xl z-10 shadow-xl rounded-r-2xl easing-bounce-out-light' : 
                        'w-full h-full rounded-r-2xl easing-emphasized'}"
                    style="{passivePickerOpen ? '' : `background-color: var(${passiveColor}); color: var(${passiveColor}-text);`}">

                <div class="absolute top-0 left-0 w-full h-full bg-light-gradient rounded-l-xl {passivePickerOpen && 'opacity-0'}"></div>
                    
                    <div class="rounded-l-xl h-12 flex-shrink flex justify-center w-full items-center px-3 transition duration-300 easing-emphasized">
               
                        <div class="flex items-center justify-center gap-1 5">
                            <div class="text-base origin-bottom-left material-symbols-rounded bold -translate-y-[0.5px]">colorize</div>
                        </div>
                    </div>

                    <div class="w-full flex-shrink-0 {passivePickerOpen ? 'flex-1 h-28' : 'flex-0 h-0'} overflow-hidden transition-all duration-300 easing-emphasized">
                        <div class="{passivePickerOpen ? 'opacity-1 delay-100 duration-200' : 'opacity-0 scale-90 duration-75'} w-full h-full grid grid-cols-4 gap-2 p-3 pt-0 place-items-center">
                            {#each samplePassiveColors as color, index}
                            <button on:click={() => {setProperties(activeColor, color)}} tabindex={passivePickerOpen ? 0 : -1} class="{index % 2 === 0 ? '' : 'col-span-3'} h-full w-full rounded-xl border border-b-2 border-white/15 relative group/button" style="background-color: {color[0] === '-' ? `var(${color})` : `${color}`}">
                                <div class="absolute top-0 left-0 w-full h-full rounded-xl bg-gradient-to-br from-transparent to-transparent via-white/15 opacity-50 group-hover/button:opacity-100 transition duration-150"></div>
                            </button>
                            {/each}
                        </div>
                    </div>

                </div>

            </button>
        </div>

        
        <div class="w-full h-12 flex rounded-xl border border-outline-variant my-2">
            <button on:click={() => {setProperties('--slider-color-1', '--slider-passive-color-2', 7, 0, 0.6, 1, 4)}} 
                class="flex-1 flex items-center justify-center border-r border-outline-variant rounded-l-xl font-semibold hover:bg-surface-container-highest active:brightness-[.98]">
                <img class="saturate-0 dark:invert h-4" src="/wave3.svg" />
            </button>
            <button on:click={() => {setProperties('--slider-color-4', '--slider-passive-color-2', 4, 0, 1.5, passiveWavelength, 1)}} 
                class="flex-1 flex items-center justify-center border-r border-outline-variant hover:bg-surface-container-highest active:brightness-[.98]">
                <img class="saturate-0 dark:invert h-[.22rem]" src="/wave4.svg" />
            </button>
            <button on:click={() => {setProperties('--md-sys-color-tertiary', '--slider-passive-color-2', 4, 2, 1, 1, 4)}} 
                class="flex-1 flex items-center justify-center border-r border-outline-variant hover:bg-surface-container-highest active:brightness-[.98]">
                <img class="saturate-0 dark:invert h-3" src="/wave1.svg" />
            </button>
            <button on:click={() => {setProperties('--slider-color-5', '--slider-passive-color-2', 4, 0, 0.1, 2, 1)}} 
                class="flex-1 flex items-center justify-center rounded-r-xl hover:bg-surface-container-highest active:brightness-[.98]">
                <svg class="saturate-0 dark:invert h-[.6rem] w-[.6rem] rotate-90" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 0c53 0 96 43 96 96v3.6c0 15.7-12.7 28.4-28.4 28.4H188.4c-15.7 0-28.4-12.7-28.4-28.4V96c0-53 43-96 96-96zM41.4 105.4c12.5-12.5 32.8-12.5 45.3 0l64 64c.7 .7 1.3 1.4 1.9 2.1c14.2-7.3 30.4-11.4 47.5-11.4H312c17.1 0 33.2 4.1 47.5 11.4c.6-.7 1.2-1.4 1.9-2.1l64-64c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3l-64 64c-.7 .7-1.4 1.3-2.1 1.9c6.2 12 10.1 25.3 11.1 39.5H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H416c0 24.6-5.5 47.8-15.4 68.6c2.2 1.3 4.2 2.9 6 4.8l64 64c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0l-63.1-63.1c-24.5 21.8-55.8 36.2-90.3 39.6V240c0-8.8-7.2-16-16-16s-16 7.2-16 16V479.2c-34.5-3.4-65.8-17.8-90.3-39.6L86.6 502.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l64-64c1.9-1.9 3.9-3.4 6-4.8C101.5 367.8 96 344.6 96 320H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H96.3c1.1-14.1 5-27.5 11.1-39.5c-.7-.6-1.4-1.2-2.1-1.9l-64-64c-12.5-12.5-12.5-32.8 0-45.3z"/></svg>
            </button>
        </div>

        <button class="add-default-button primary-gradient-background button-shadow-default text-on-primary flex-shrink-0
        h-12 w-12 flex items-center justify-center rounded-xl transition-transform active:duration-100 duration-200 active:scale-105">
            <div class="material-symbols-rounded text-2xl font-semibold">add</div>
        </button>
    </div>
</div> -->

<div class="grain-overlay opacity-50 dark:opacity-25 h-full w-full top-0 left-0 fixed pointer-events-none z-[100]"></div>

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
    @keyframes rotater {
        0% {rotate: 0deg; scale: 1}
        50% {scale: 1.2}
        100% {rotate: 90deg; scale: 1}
    }
    .grain-overlay {
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2' numOctaves='4' stitchTiles='stitch'/%3E%3CfeComponentTransfer%3E%3CfeFuncA type='table' tableValues='0 0.5'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E%0A");
    }
</style>
