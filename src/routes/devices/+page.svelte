<script lang="ts">
	import type { Device } from "$lib/types/device";


  export let data: {devices: Device[]};
  const { devices } = data;
</script>

<div>
  <h1>Devices</h1>

  {#each devices as device}
    <a href={`/devices/${device.id}`}>
      <span>{device.manufacturer}</span>
      <span>{device.name}</span>
    </a>
  {/each}
</div>