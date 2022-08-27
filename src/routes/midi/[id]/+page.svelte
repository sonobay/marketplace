<script lang="ts">
  import Avatar from '$lib/components/Avatar.svelte';
  import type { Metadata } from './+page.server'
  export let data: {metadata: Metadata};

  let { metadata } = data;

</script>

<div>
  <p>name: {metadata.name}</p>
  <Avatar path={metadata.image} size="md" alt={metadata.name} />
  <p>desc: {metadata.description}</p>

  {#each metadata.properties.entries as entry}
    <div>
      <span>{entry.name}</span>
      {#if entry.image}
        <img src={entry.image} alt={entry.name} />
      {:else}
        <span>...</span>
      {/if}

      <Avatar path={entry.image} size="md" alt={entry.name} />

      <pre>{JSON.stringify(entry.midi)}</pre>
    </div>
  {/each}
</div>