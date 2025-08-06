<script>
    import { createEventDispatcher } from "svelte";
    
    const dispatch = createEventDispatcher();

    export let active = true;
    export let href = undefined;
    export let target = '_self';
    export let big = false;
    export let square = false;
    export let classes = ''
</script>

{#if !href}
<button role="button" target={target} on:click={() => dispatch('click')} aria-label="button"
    class="relative button cursor-pointer flex-shrink-0 text-on-primary {big ? square ? 'h-9 w-9' : 'h-9 pl-4 pr-5' : square ? 'h-7 w-7' : 'h-7 px-3'} rounded-xl flex items-center justify-center gap-2 text-sm overflow-hidden
    focus-visible:scale-[1.02] active:scale-[0.97]
    {active ? 'font-semibold' : 'font-bold inactive'} {classes}">
    <div class="relative z-10">
        <slot />
    </div>
</button>
{:else}
<a href="{href}" target={target} on:click={() => dispatch('click')} 
    class="relative button cursor-pointer flex-shrink-0 text-on-primary {big ? square ? 'h-9 w-9' : 'h-9 pl-4 pr-5' : square ? 'h-7 w-7' : 'h-7 px-3'} rounded-xl flex items-center justify-center gap-2 text-sm overflow-hidden
    focus-visible:scale-[1.02] active:scale-[0.97]
    {active ? 'font-semibold' : 'font-bold inactive'} {classes}">
    <div class="relative z-10">
        <slot />
    </div>
</a>
{/if}

<style lang="postcss">
    @property --p1 {
        syntax: '<percentage>';
        initial-value: 20%;
        inherits: false;
    }
    @property --p2 {
        syntax: '<percentage>';
        initial-value: 65%;
        inherits: false;
    }
    @property --p3 {
        syntax: '<percentage>';
        initial-value: 95%;
        inherits: false;
    }
    @property --c1 {
        syntax: '<color>';
        initial-value: var(--md-sys-color-primary);
        inherits: false;
    }
    @property --c2 {
        syntax: '<color>';
            initial-value: #797943;
        inherits: false;
    }
    @property --c3 {
        syntax: '<color>';
        initial-value: var(--md-sys-color-primary);
        inherits: false;
    }
    @media (prefers-color-scheme: dark) {
        @property --c2 {
            syntax: '<color>';
            initial-value: rgb(196, 196, 113);
            inherits: false;
        }
    }

    
    .button {
        background: rgb(16,16,16);
        background: linear-gradient(180deg, var(--md-sys-color-primary) var(--p1), var(--c2) var(--p2), var(--md-sys-color-primary) var(--p3));
        @supports (-moz-animation: none) {
            background: rgb(16,16,16);
            background: linear-gradient(180deg, rgba(16,16,16,1) 20%, rgba(90,90,90,1) 70%, rgba(48,48,48,1) 100%);
        }
        box-shadow: 0 2px 3px 0 rgba(0,0,0,0.15);

        transition: all 100ms, color 0ms, --p1 100ms, --p2 100ms, --c1 100ms, --c2 100ms, --c3 100ms;
    
        &:hover, &:focus-visible {
            --p1: 25%;
            --p2: 55%;
            --p3: 85%;
            /* --c2: rgba(100,100,100,1); */
            box-shadow: 0 2px 4px 1px hsla(37,25%,30%,0.25);
        }
        &:active {
            transition-duration: 10ms;
        }
    }
    .button.inactive {
        background: rgb(230,230,230);
        background: linear-gradient(180deg, var(--c1) var(--p1), var(--c2) var(--p2), var(--c3) var(--p3));
        @supports (-moz-animation: none) {
            background: rgb(230,230,230);
            background: linear-gradient(180deg, rgba(221, 221, 221, 1) 20%, rgba(245, 245, 245, 1) 70%, rgba(230, 230, 240, 1) 100%);
        }
        color: rgb(45, 45, 45);
        box-shadow: 0 2px 3px 0 rgba(0,0,0,0.1);
        --c1: var(--md-sys-color-primary-container);
        --c2: var(--md-sys-color-primary-container);
        --c3: var(--md-sys-color-primary-container);

        &:hover, &:focus-visible {
            box-shadow: 0 2px 4px 0 rgba(0,0,0,0.15);
        }
    }
</style>
