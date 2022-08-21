<script>
  import Header from "$lib/components/Header.svelte";
  import "../app.css";
  // import { midi } from '$lib/stores/midi';
  // midi.connect();
</script>

<Header />

<main class="container mx-auto py-12">
  <slot />
</main>