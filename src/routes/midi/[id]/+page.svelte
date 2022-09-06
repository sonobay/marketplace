<script lang="ts">
  import Avatar from '$lib/components/Avatar.svelte';
  import type { Entry, IPFSMetadata } from '$lib/types/ipfs-metadata';
  export let data: {metadata: IPFSMetadata};
  import { sendMidiToOutput } from '$lib/stores/midi';

  let { metadata } = data;

  const loadMIDI = async (entry: Entry) => {
    sendMidiToOutput(entry.midi)
  }

</script>

<div>
  <p>name: {metadata.name}</p>
  <Avatar path={metadata.image} size="md" alt={metadata.name} />
  <p>desc: {metadata.description}</p>

  {#each metadata.properties.entries as entry}
    <div>
      <span>{entry.name}</span>
      <Avatar path={entry.image} size="md" alt={entry.name} />

      <button on:click|preventDefault={(_) => loadMIDI(entry)}>Load</button>

      <pre>{JSON.stringify(entry.midi)}</pre>
    </div>
  {/each}
</div>