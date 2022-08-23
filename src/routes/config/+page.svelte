<script lang="ts">

  import { midi } from '$lib/stores/midi';
  import { onDestroy } from 'svelte';

  let inputs: WebMidi.MIDIInput[] = [];

  let selectedInput: WebMidi.MIDIInput | undefined;
  $: selectedInput;

  const unsubscribe = midi.subscribe((store) => {

    inputs = [];

    if (!store.inputs || store.inputs.size <= 0) {
      console.log('inputs are none')
      selectedInput = undefined;
      return;
    } else {
      for (const input of store.inputs) {
        console.log('input is: ', input);
        inputs.push(input[1])
        // inputs = inputs;
      }
    }

    console.log('about to set selectedInput as: ', store.selectedInput)

    selectedInput = store.selectedInput;
    // if (selectedInput) {
    //   selectedInput.onmidimessage = (msg) => {
    //     console.log('msg is: ', msg)
    //   }
    // }


  })

  onDestroy(unsubscribe)

</script>

<div>
  <h1 class="text-xl mb-4">Config Page</h1>

  <!-- {#if selectedInput}
    <span>selected: {selectedInput.manufacturer} | {selectedInput.name}</span>
  {:else}
    <span>Select a device</span>
  {/if} -->

  <span>Select a device: </span>

  <ul>
    {#each inputs as input}
    <li class={`flex items-center cursor-pointer ${selectedInput?.id === input.id ? 'text-gray-600' : 'text-gray-400'}`} on:click={(e) => midi.selectInput(input)}>
      <span class={`w-2 h-2 rounded-full mr-1 ${selectedInput?.id === input.id ? 'bg-green-400' : 'bg-transparent'}`}></span>
      <span>{input.manufacturer} - {input.name}</span>
    </li>
    {/each}
  </ul>
  

</div>
