<script lang="ts">
	import DeviceMidiSearch from '$lib/components/DeviceMidiSearch.svelte';
	import Pack from '$lib/components/Pack.svelte';
	import type { Device } from '$lib/types/device';
	import type { MIDI } from '$lib/types/midi';

	export let data: { device: Device; midi: MIDI[]; query: string };
	const { device, midi, query } = data;

	// get query from url
</script>

<div class="mb-12 sticky top-16 md:top-0 z-10 py-6 bg-white">
	<div class="flex flex-col">
		<h2 class="text-2xl font-bold">{device.manufacturer} {device.name}</h2>
		<h3 class="text-xl font-bold">Searching: {query}</h3>

		<!-- hiding -->
		<!-- for now we will only show "listings" -->
		<!-- <div class="flex h-min gap-4 ">
			<button class="rounded-2xl px-4 py-1 bg-white hover:bg-midiYellow text-center">
				For sale
			</button>
			<button class="rounded-2xl px-4 py-1 bg-midiYellow hover:bg-midiYellow text-center">
				All
			</button>
		</div> -->
	</div>

	<div class="flex md:flex-row flex-col mt-2 gap-4 md:gap-8 justify-between">
		<DeviceMidiSearch deviceId={device.id} />

		<!-- added temporarily until dropdown can be added back in -->
		<div class="flex flex-row gap-2 md:gap-4 md:w-1/2 w-full" />

		<!-- hiding dropdown until we have API support -->
		<!-- <div class="flex flex-row gap-2 md:gap-4 md:w-1/2 w-full">
			<Dropdown placeholder="Sort by" items={['price', 'date']} />
		</div> -->
	</div>
</div>

<div>
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
