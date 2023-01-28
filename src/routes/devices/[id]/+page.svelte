<script lang="ts">
	import Avatar from "$lib/components/Avatar.svelte";
  import type { Device } from "$lib/types/device";


  export let data: {device: Device};


  const { device } = data; 
</script>

<div>
  <h1>{device.manufacturer} {device.name}</h1>

  {#if device.midi_devices}
  {#each device.midi_devices as midiDevice}
    <a href={`/midi/${midiDevice.midi.id}`}>
      <Avatar path={midiDevice.midi.metadata.image} size="md" alt={midiDevice.midi.metadata.name} />
      <span>{midiDevice.midi.metadata.name}</span>
      <br />
      <span>{midiDevice.midi.metadata.description}</span>
    </a>
  {/each}    
  {/if}

</div>