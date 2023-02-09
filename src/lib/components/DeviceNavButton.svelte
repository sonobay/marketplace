<script lang="ts">
  import { midi } from '$lib/stores/midi';
  import { onDestroy } from "svelte";
	import CircleCheck from './icons/CircleCheck.svelte';
	import TriangleExclamation from './icons/TriangleExclamation.svelte';

  let selectedInput: WebMidi.MIDIInput | undefined;
  let selectedOutput: WebMidi.MIDIOutput | undefined;

  const unsubscribe = midi.subscribe((store) => {
    selectedInput = store.selectedInput
    selectedOutput = store.selectedOutput
  })

  onDestroy(unsubscribe)
</script>

<a href="/config" class="flex items-center text-sm border border-black border-2 relative rounded-xl mx-4 px-4">

  <span>Device</span>

  <div class="absolute -top-2 -right-2">
    {#if selectedInput && selectedOutput}
      <span><CircleCheck /></span>
    {:else}

      <span><TriangleExclamation /></span>
    {/if}
  </div>

</a>