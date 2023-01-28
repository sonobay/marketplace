<script lang="ts">
  import ImageInput from "$lib/components/inputs/ImageInput.svelte";
  import type { Entry } from "$lib/types/entry";
  import { createEventDispatcher, onDestroy } from "svelte";
  import { midi } from '$lib/stores/midi';
	import Tag from "./Tag.svelte";
	import Input from "./inputs/Input.svelte";

  const inputClass = 'border border-gray-300 px-2 rounded'
  const labelClass = 'text-gray-500 text-sm font-semibold'
  const inputContainerClass = 'flex flex-col mb-4'
  let currentTag = ''

  const initEntry = (): Entry => ({
    name: '',
    midi: undefined,
    image: undefined,
    tags: []
  });

  let entry: Entry = initEntry();

  $: isValid = entry.midi && entry.midi?.length > 0 && entry.name.length > 0

  const dispatch = createEventDispatcher<{addEntry:{entry: Entry}}>();

  const onTagKeydown = (e: KeyboardEvent) => {
    if (e.code === 'Space' || e.code === 'Enter') {
      
      /**
       * disallow multiple of the same tag
       * UI restrict max of 5 tags per patch
       */
      if (entry.tags.includes(currentTag) || entry.tags.length >= 5) {
        return;
      }

      entry.tags.push(currentTag);
      currentTag = ''
      entry = entry;
    }
  }

  const onTagInput = () => {
    // remove spaces from pasted text
    currentTag = currentTag.replaceAll(' ', '')       
  }

  const unsubscribe = midi.subscribe((store) => {
  
    if (!store.selectedInput) {
      return;
    }

    store.selectedInput.onmidimessage = (msg) => {
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

  <div class="mt-5">
    <ImageInput image={entry.image} id="entry-image" on:imageUpdated={((e) => entry.image = e.detail.image)} />
  </div>

  <div class="flex flex-col">

    <div class={inputContainerClass}>
      <label class={labelClass} for="entry-name">
        MIDI Name
      </label>
      <Input name="entry-name" id="entry-name" bind:value={entry.name} required={true} />
    </div>

    <div class={inputContainerClass}>

      <label class={labelClass} for="entry-name">
        Tags
      </label>

      
      <div class="rounded bg-gradient-to-b p-0.5 from-gray-300 to-gray-400 mb-2">
        <input 
          name="entry-tags" 
          bind:value={currentTag} 
          class='rounded-[3px] w-full px-2 py-1 bg-white'
          on:keydown={onTagKeydown} 
          on:input={() => onTagInput()}
        />
      </div>
      

      <div class="h-12">
        {#each entry.tags as tag}
          <Tag label={tag} />
        {/each}
      </div>

    </div>

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