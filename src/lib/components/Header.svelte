<script lang="ts">
  import ConnectButton from "$lib/components/ConnectButton.svelte";
  import { midi } from '$lib/stores/midi';
  import { onDestroy } from "svelte";
	import Logo from "./Logo.svelte";

  let selectedInput: WebMidi.MIDIInput | undefined;
  let selectedOutput: WebMidi.MIDIOutput | undefined;

  const unsubscribe = midi.subscribe((store) => {
    selectedInput = store.selectedInput
    selectedOutput = store.selectedOutput
  })

  onDestroy(unsubscribe)

</script>

<header class="container mx-auto py-2 px-4">
  <div>
    <div class="flex justify-between">
      <div>
        <h1>
          <a href="/" class="flex align-items">
            <Logo />
            <div class="ml-2 h-9 w-[62px] flex -mt-1">
              <img src="/images/midi-link.png" alt="MIDI.link" />
            </div>
          </a>
        </h1>
      </div>
  
      <div>
        <ConnectButton />
        <!-- <a href="/mint">Mint</a> -->
      </div>
    </div>
    <div class="float-left">
      <a href="/config" class="flex flex-col text-sm shrink">
        <div class="mb-0.5 h-4 flex items-center">
          <span class={`flex justify-center items-center w-4 h-4 border-2  ${selectedInput ? 'border-emerald-300 bg-emerald-200 text-emerald-500' : 'border-gray-300 bg-gray-200 text-gray-400'}`}>I</span>
          {#if selectedInput}
            <span class="ml-2">{selectedInput.name}</span>
          {/if}
        </div>
  
        <div class="flex items-center h-4">
          <span class={`flex justify-center items-center w-4 h-4 border-2  ${selectedOutput ? 'border-emerald-300 bg-emerald-200 text-emerald-500' : 'border-gray-300 bg-gray-200 text-gray-400'}`}>O</span>
          {#if selectedOutput}
            <span class="ml-2">{selectedOutput.name}</span>
          {/if}
        </div>
      </a>
    </div>
  </div>
</header>