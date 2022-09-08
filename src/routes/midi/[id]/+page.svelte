<script lang="ts">
  import Avatar from '$lib/components/Avatar.svelte';
  import type { Entry, IPFSMetadata } from '$lib/types/ipfs-metadata';
  export let data: {metadata: IPFSMetadata};
  import { sendMidiToOutput } from '$lib/stores/midi';
  import { signerAddress } from 'svelte-ethers-store'
  import { onDestroy } from 'svelte';
  import { page } from '$app/stores';
  import { midiContract } from '$lib/utils/contracts';
  import { BigNumber } from 'ethers';

  let { metadata } = data;
  let userBalance = BigNumber.from(0)

  const loadMIDI = async (entry: Entry) => {
    sendMidiToOutput(entry.midi)
  }

  const checkOwner = async (userAddress: string) => {
    if (!userAddress) {
      return;
    }

    const { id } = $page.params

    const fetchBalance = await midiContract().balanceOf(userAddress, id)
    userBalance = BigNumber.from(fetchBalance)
  }

  const sub = signerAddress.subscribe((address) => {
    checkOwner(address)
  })

  onDestroy(sub)

</script>

<div>
  <p>name: {metadata.name}</p>
  <Avatar path={metadata.image} size="md" alt={metadata.name} />
  <p>desc: {metadata.description}</p>
  {#if userBalance.gt(0)}
    <a href="#">List MIDI</a>
  {/if}

  {#each metadata.properties.entries as entry}
    <div>
      <span>{entry.name}</span>
      <Avatar path={entry.image} size="md" alt={entry.name} />

      <button on:click|preventDefault={(_) => loadMIDI(entry)}>Load</button>

      <pre>{JSON.stringify(entry.midi)}</pre>
    </div>
  {/each}
</div>