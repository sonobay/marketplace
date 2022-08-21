<script lang="ts">
  import ImageInput from "$lib/components/ImageInput.svelte";
  import type { Entry } from "$lib/types/entry";
  import { createEventDispatcher, onDestroy } from "svelte";
  import { midi } from '$lib/stores/midi';

  const inputClass = 'bg-gray-200 border border-gray-300 px-2'
  const labelClass = 'text-gray-500'
  const inputContainerClass = 'flex flex-col mb-4'

  const initEntry = (): Entry => ({
    name: '',
    midi: undefined,
    image: undefined
  });

  let entry: Entry = initEntry();

  $: isValid = entry.midi && entry.midi?.length > 0 && entry.name.length > 0

  const dispatch = createEventDispatcher<{addEntry:{entry: Entry}}>();

  const unsubscribe = midi.subscribe((store) => {
  
    if (!store.selectedInput) {
      return;
    }

    store.selectedInput.onmidimessage = (msg) => {
      console.log('received msg: ', msg.data);
      entry.midi = msg.data;
      entry = entry;
    };
  })

  const submitEntry = () => {
    if (!isValid) {
      return;
    }
    dispatch('addEntry', {entry})
    entry = initEntry()
  }

  onDestroy(unsubscribe)
</script>

<div class="flex">

  <ImageInput image={entry.image} id="entry-image" on:imageUpdated={((e) => entry.image = e.detail.image)} />

  <div class={inputContainerClass}>
    <label class={labelClass} for="entry-name">
      MIDI Name
    </label>
    <input name="entry-name" id="entry-name" bind:value={entry.name} class={inputClass} required />
  </div>
</div>

<span>
  {#if entry.midi}
  [
  {#each entry.midi as byte}
    {byte}
  {/each}
  ]
{:else}
  []
{/if}
</span>

<br />

<button class={`text-white px-4 ${isValid ? 'bg-pink-500' : 'bg-gray-400'}`} on:click|preventDefault={(_) => submitEntry()} disabled={!isValid}>Add MIDI</button>