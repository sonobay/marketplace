<script lang="ts">
	import Pack from '$lib/components/Pack.svelte';
	import type { Device } from '$lib/types/device';
	import { page } from '$app/stores';
	import { onDestroy } from 'svelte';
	import type { MIDI } from '@sonobay/sdk';
	import Dropdown from '$lib/components/buttons/Dropdown.svelte';
	import CaretLeft from '$lib/components/icons/CaretLeft.svelte';
	import CaretRight from '$lib/components/icons/CaretRight.svelte';

	export let data: { device: Device; midi: MIDI[] };

	let { device, midi } = data;
	let deviceId = device.id;

	/**
	 * used when device id url param changes
	 * fetches new id
	 **/
	const unsubscribe = page.subscribe((_page) => {
		const { id } = _page.params;

		if (id !== deviceId) {
			fetchDevice(id);
		}
	});

	const fetchDevice = async (id: string) => {
		const res = await fetch(`/api/fetchDevice/${id}.json`, {
			headers: {
				accept: 'application/json'
			}
		});
		const json = (await res.json()) as { device: Device };
		device = json.device;
		deviceId = device.id;
	};

	let pageIndex = 0;
	let listingsPerPage = 9;
	let sliceIndex = listingsPerPage;

	$: sliceIndex = calculateSliceIndex(pageIndex);
	$: visible = midi.slice(pageIndex, sliceIndex);

	function calculateSliceIndex(page: number) {
		if (pageIndex == 0) return listingsPerPage;
		if (pageIndex + listingsPerPage > midi.length) return midi.length;
		return pageIndex + listingsPerPage;
	}

	onDestroy(unsubscribe);
</script>

<div class="mb-12 sticky top-16 md:top-0 z-10 py-6 bg-white">
	<div class="flex md:flex-row flex-col justify-between md:items-center mb-4 gap-2">
		<h1 class="hidden md:inline">{device.manufacturer} {device.name}</h1>
		<div class="flex h-min gap-4 ">
			<button class="rounded-2xl px-4 py-1 bg-white hover:bg-midiYellow text-center">
				For sale
			</button>
			<button class="rounded-2xl px-4 py-1 bg-midiYellow hover:bg-midiYellow text-center">
				All
			</button>
		</div>
	</div>

	<div class="flex md:flex-row flex-col mt-2 gap-4 md:gap-8 justify-between">
		<input
			type="text"
			placeholder="search..."
			aria-label="search for nfts"
			class="rounded-2xl w-full px-4 py-1 border border-charcoal bg-white focus:outline-none"
		/>
		<div class="flex flex-row gap-2 md:gap-4 md:w-1/2 w-full">
			<Dropdown placeholder="Sort by" items={['price', 'date']} />
		</div>
	</div>
</div>

{#if device.midi_devices}
	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 gap-y-8 place-items-center ">
		{#each visible as _midi}
			<a href={`/midi/${_midi.id}`}>
				<Pack
					image={_midi.metadata.image}
					name={_midi.metadata.name}
					entries={_midi.metadata.properties.entries}
					totalSupply={_midi.totalSupply}
				/>
			</a>
		{/each}
	</div>
{/if}

{#if midi && listingsPerPage < midi.length}
	<div class="flex justify-end mt-4">
		<div>
			<button
				class="bg-transparent p-2 focus:outline-none disabled:opacity-40"
				disabled={pageIndex <= 0}
				on:click={() => {
					pageIndex -= listingsPerPage;
				}}><CaretLeft /></button
			>
			<button
				disabled={sliceIndex == midi.length}
				class="bg-transparent p-2 focus:outline-none disabled:opacity-40"
				on:click={() => {
					pageIndex += listingsPerPage;
				}}><CaretRight /></button
			>
		</div>
	</div>
{/if}

<div class="mt-16" />
