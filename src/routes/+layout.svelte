<script>
    import "../app.scss";
    // import { Toaster } from "svelte-sonner";
</script>

<!-- <Toaster /> -->

<slot></slot>

<!-- <div class="grain-overlay opacity-50 dark:opacity-25 h-full w-full top-0 left-0 fixed pointer-events-none"></div> -->

<style>
    .grain-overlay {
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2' numOctaves='4' stitchTiles='stitch'/%3E%3CfeComponentTransfer%3E%3CfeFuncA type='table' tableValues='0 0.5'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E%0A");
    }
</style>