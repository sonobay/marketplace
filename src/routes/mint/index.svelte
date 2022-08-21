<script lang="ts">
  import { onDestroy } from 'svelte';
  import { midi } from '$lib/stores/midi';
  import { signer } from 'svelte-ethers-store';
  import ImageInput from '$lib/components/ImageInput.svelte';
  import TrashSolid from '$lib/components/icons/TrashSolid.svelte';
  import type { Entry } from '$lib/types/entry';
  import AddEntry from '$lib/components/AddEntry.svelte';

  let name = '';
  let description = '';
  let image: FileList | undefined;
  let manufacturer = '';
  let device = '';
  let loading = false;

  const inputClass = 'bg-gray-200 border border-gray-300 px-2'
  const labelClass = 'text-gray-500'
  const inputContainerClass = 'flex flex-col mb-4'
  const tdClass = 'border border-gray-200'
  const subHeaderClass = 'text-lg mb-2'

  let entries: Entry[] = []

  const addEntry = (entry: Entry) => {
    entries = [...entries, entry]
  }

  const removeEntry = (index: number) => {
    entries.splice(index, 1);
    entries = entries;
  }

  $: isValid = signer && manufacturer.length > 0 && device.length > 0 && name.length > 0 && image && image.length > 0 && entries.length > 0

  // const handleSubmit = async (e: SubmitEvent) => {
  const handleSubmit = async () => {
    console.log('submitting!')

    console.log('image is: ', image)

    if (!$signer) {
      return;
    }

    if (!image || image && image.length <= 0) {
      console.log('image required')
      return;
    }

    loading = true;
    const formData = new FormData();

    formData.append('name', name)
    formData.append('description', description)
    formData.append('logo', image[0])

    entries.forEach((entry, i) => {
      formData.append(`entries[${i}].name`, entry.name)
      formData.append(`entries[${i}].midi`, entry.midi?.toString() ?? '[]')
      if (entry.image) {
        formData.append(`entries[${i}].image`, entry.image[0])
      }
    })
    // formData.append('entries', JSON.stringify(entries))

    const res = await fetch("mint.json", {
        method: "POST",
        body: formData,
    });

    console.log('res is: ', res);

  }

  const unsubscribe = midi.subscribe((store) => {
    if (!store.selectedInput) {
      manufacturer = '';
      device = '';
      return;
    }

    manufacturer = store.selectedInput.manufacturer ?? ''
    device = store.selectedInput.name ?? ''
  })

  onDestroy(unsubscribe)

</script>

<div>
  <h1 class="text-xl mb-4">Mint MIDI Collection</h1>

  <!-- <form on:submit|once|preventDefault={handleSubmit}> -->

  <div>

      <div class="mb-8">
        <h2 class={subHeaderClass}>Device</h2>
        <div class="flex">
          <div class={`${inputContainerClass} mr-4`}>
            <label class={labelClass} for="manufacturer">Manufacturer</label>
            <input id="manufacturer" name="manufacturer" bind:value="{manufacturer}" class={inputClass} required disabled />
          </div>
    
          <div class={inputContainerClass}>
            <label class={labelClass} for="device">Device</label>
            <input id="device" name="device" bind:value="{device}" class={inputClass} required disabled />
          </div>
        </div>
      </div>

      <div class="mb-8">
        <h2 class={subHeaderClass}>Collection Info</h2>
        <div class="flex">

          <!-- <div class="mr-4 h-14 w-14 rounded-full bg-gray-200 flex overflow-hidden">
            <label class="flex align-items w-full" for="logo">
              {#if image && image[0]}
              <img class="w-full" src={URL.createObjectURL(image[0])} alt="Device Logo" />
              {:else}
              <div class="float-left cursor-pointer rounded-full px-4 py-2 flex items-center">
                <ImageRegular size={24} color="rgb(156 163 175)" />
              </div>
              {/if}
              <input name="logo" id="logo" type="file" class="hidden" bind:files={image} required />
            </label>
          </div> -->

          <ImageInput image={image} id="logo" on:imageUpdated={((e) => image = e.detail.image)} />
      
          <div class={inputContainerClass}>
            <label class={labelClass} for="name">Collection Name</label>
            <input id="name" name="name" bind:value="{name}" class={inputClass} required />
          </div>
        </div>
    
        <div class={inputContainerClass}>
          <label class={labelClass} for="description">Description</label>
          <textarea id="description" name="description" bind:value="{description}" class={inputClass} />
        </div>
      </div>


    

    <!-- {#each entries as entry, i }
      <div>

        <div>
          <label for={`patch-image-${i}`}>
            {#if image && image[0]}
            <img class="w-12" src={URL.createObjectURL(image[0])} alt="Device Logo" />
            {:else}
            <div class="float-left cursor-pointer rounded bg-blue-500 px-4 py-2 text-white shadow">
              Select File
            </div>
            {/if}
            <input name={`patch-image-${i}`} id={`patch-image-${i}`} type="file" class="hidden" bind:files={entry.image} />
          </label>
        </div>

        <div>
          <label for={`midi-name-${i}`}>
            MIDI Name
          </label>
          <input name={`midi-name-${i}`} id={`midi-name-${i}`} bind:value={entry.name} required />
        </div>

        <span>MIDI data here</span>

        <button on:click|preventDefault={(_) => removeEntry(i)}>-</button>

      </div>
    {/each} -->

    <div class="mb-8">

      <h2 class={subHeaderClass}>MIDI</h2>

      <!-- <div class="flex">

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
        [.]
      {/if}
      </span>

      <button on:click|preventDefault={(_) => addEntry()}>Add MIDI</button> -->

      <AddEntry on:addEntry={((e) => addEntry(e.detail.entry))} />

    </div>

    <table class="w-full border border-collapse">
      <tbody>
        {#each entries as entry, i}
          <tr>
            <td class={tdClass}>
              {#if entry.image}
                <img class="w-12" src={URL.createObjectURL(entry.image[0])} alt="Device Logo" />
              {:else}
                <span>none</span>
              {/if}
            </td>
            <td class={tdClass}>{entry.name}</td>
            <td class={tdClass}>
              {#if entry.midi}
                [
                {#each entry.midi as byte}
                  {byte}
                {/each}
                ]
              {:else}
                [.]
              {/if}
            </td>
            <td class="w-12">
              <button class="w-full" on:click|preventDefault={(_) => removeEntry(i) }>
                <TrashSolid color="#000" />
              </button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>

    <!-- <button on:click|preventDefault={(_) => addEntry()}>Add MIDI patch</button> -->

    <!-- <button type="submit">Mint</button> -->
    <button class={`text-white px-4 ${isValid ? 'bg-pink-500' : 'bg-gray-400'}`} on:click={(_) => handleSubmit()} disabled={!isValid}>Mint</button>

  </div>

  <!-- </form> -->
</div>
