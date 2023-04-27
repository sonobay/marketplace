<script lang="ts">
	import DeviceMidiSearch from '$lib/components/DeviceMidiSearch.svelte';
	import Pack from '$lib/components/Pack.svelte';
	import type { Device } from '$lib/types/device';
	import type { MIDI } from '$lib/types/midi';

	export let data: { device: Device; midi: MIDI[]; query: string };
	const { device, midi, query } = data;

	// get query from url
</script>

<div>
	<div class="mb-8">
		<h2 class="text-2xl font-bold">{device.manufacturer} {device.name}</h2>
		<h3 class="text-xl font-bold mb-2">Searching: {query}</h3>
		<DeviceMidiSearch deviceId={device.id} />
	</div>

	<div class="grid grid-cols-2 gap-4">
		{#each midi as m}
			<Pack
				name={m.metadata.name}
				image={m.metadata.image}
				entries={m.metadata.properties.entries}
				totalSupply={m.totalSupply}
			/>
		{/each}
	</div>
</div>
