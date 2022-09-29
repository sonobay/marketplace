<script lang="ts">
  import { onDestroy } from 'svelte';
  import { midi, sendMidiToOutput } from '$lib/stores/midi';
  import { signer, signerAddress } from 'svelte-ethers-store';
  import ImageInput from '$lib/components/ImageInput.svelte';
  import TrashSolid from '$lib/components/icons/TrashSolid.svelte';
  import type { Entry } from '$lib/types/entry';
  import AddEntry from '$lib/components/AddEntry.svelte';
  import { BigNumber } from 'ethers'
  import { isPositiveInteger } from '$lib/utils';
  import { goto } from '$app/navigation';
	import { midiContract } from '$lib/utils/midi.contract';

  let name = '';
  let description = '';
  let image: FileList | undefined;
  let manufacturer = '';
  let device = '';
  let loading = false;
  let amount: string;

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

  $: isValid = signer && manufacturer.length > 0 
    && device.length > 0 && name.length > 0 
    && image && image.length > 0 && entries.length > 0
    && isPositiveInteger(amount)

  // const handleSubmit = async (e: SubmitEvent) => {
  const handleSubmit = async () => {
    if (!$signer) {
      console.error('not connected')
      return;
    }

    if (!image || image && image.length <= 0) {
      console.error('image required')
      return;
    }

    loading = true;
    const formData = new FormData();

    formData.append('name', name)
    formData.append('description', description)
    formData.append('logo', image[0])

    entries.forEach((entry, i) => {
      formData.append(`entries[${i}].name`, entry.name)
      formData.append(`entries[${i}].midi`, entry.midi?.toString() ?? '')
      if (entry.image) {
        formData.append(`entries[${i}].image`, entry.image[0])
      }
    })

    const res = await fetch("api/mint.json", {
        method: "POST",
        headers: {
          "accept": "application/json"
        },
        body: formData,
    });

    const json: {metadata: string} = await res.json();

    /**
     * Mint on Ethereum
     */
    const midi = midiContract($signer)
    const tx = await midi.mint($signerAddress, BigNumber.from(amount), json.metadata, [])
    const receipt = await tx.wait()

    goto(`/midi/${receipt.events[0].args.id}`);
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

        <ImageInput image={image} id="logo" on:imageUpdated={((e) => image = e.detail.image)} />
    
        <div class={`${inputContainerClass} mr-4`}>
          <label class={labelClass} for="name">Collection Name</label>
          <input id="name" name="name" bind:value="{name}" class={inputClass} required />
        </div>

        <div class={inputContainerClass}>
          <label class={labelClass} for="amount"># To Mint</label>
          <input type="number" id="amount" name="amount" bind:value="{amount}" class={inputClass} />
        </div>
      </div>
  
      <div class={inputContainerClass}>
        <label class={labelClass} for="description">Description</label>
        <textarea id="description" name="description" bind:value="{description}" class={inputClass} />
      </div>

    </div>

    <div class="mb-8">

      <h2 class={subHeaderClass}>MIDI</h2>

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
            <td>
              <button on:click|preventDefault={(_) => sendMidiToOutput(entry.midi ?? new Uint8Array(0))}>Test</button>
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
