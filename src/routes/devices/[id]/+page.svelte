<script lang="ts">
	import Avatar from "$lib/components/Avatar.svelte";
  import type { Device } from "$lib/types/device";


  export let data: {device: Device};


  const { device } = data; 
</script>

<div>
  <h1>{device.manufacturer} {device.name}</h1>

  {#if device.midi}
  {#each device.midi as midi}
    <a href={`/midi/${midi.id}`}>
      <Avatar path={midi.metadata.image} size="md" alt={midi.metadata.name} />
      <span>{midi.metadata.name}</span>
      <br />
      <span>{midi.metadata.description}</span>
    </a>
  {/each}    
  {/if}

</div>