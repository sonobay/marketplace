<script lang="ts">
	import Pack from '$lib/components/Pack.svelte';
	import FilterDropdown from '$lib/components/buttons/FilterDropdown.svelte';
	import Dropdown from '$lib/components/buttons/Dropdown.svelte';
	import type { Device } from '$lib/types/device';
	import { getManufacturersList } from '$lib/utils';
	import CaretRight from '$lib/components/icons/CaretRight.svelte';
	import CaretLeft from '$lib/components/icons/CaretLeft.svelte';
	import type { ListingRow } from '$lib/types/listing-row';

	export let data: { listings: ListingRow[]; devices: Device[] };

	let { listings } = data;

	let page = 0;
	let listingsPerPage = 2;
	let sliceIndex = listingsPerPage;

	$: sliceIndex = calculateSliceIndex(page);
	$: visible = listings.slice(page, sliceIndex);

	function calculateSliceIndex(page: number) {
		if (page == 0) return listingsPerPage;
		if (page + listingsPerPage > listings.length) return listings.length;
		return page + listingsPerPage;
	}
</script>

<div>
	<div class="mb-16 sticky top-16 md:top-0 z-10 bg-white py-4 md:py-6">
		<div class="flex md:flex-row flex-col justify-between md:items-center mb-4 gap-2">
			<h1 class="hidden lg:inline">Dig thru the Sono bay crates</h1>
			<div class="flex h-min gap-4 ">
				<button class="rounded-2xl px-4 py-1 bg-midiYellow  text-center"> Packs </button>
				<button class="rounded-2xl px-4 py-1 bg-white hover:bg-midiYellow text-center">
					Producers
				</button>
			</div>
		</div>

		<div class="flex md:flex-row flex-col mt-2 gap-2 justify-between">
			<input
				type="text"
				placeholder="search..."
				aria-label="search for nfts"
				class="rounded-2xl px-4 py-1 border border-midiGrayLight bg-white  focus:outline-none"
			/>
			<div class="flex flex-row gap-2 md:gap-4 md:w-1/2 w-full">
				<FilterDropdown placeholder="Filter device" items={getManufacturersList(data.devices)} />
				<Dropdown placeholder="Sort by" />
			</div>
		</div>
	</div>

	{#if listings && listings.length > 0}
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 gap-y-8">
			{#each visible as listing, i}
				<a href={`/listing/${listing.listing_address}`}>
					<Pack
						image={listing.midi ? listing?.midi.metadata.image : undefined}
						name={listing.midi ? listing.midi.metadata.name : ''}
						entries={listing.midi ? listing.midi.metadata.properties.entries : []}
						totalSupply={listing.midi?.totalSupply ?? 0}
					/>
				</a>
			{/each}
		</div>
	{:else}
		<div
			class="rounded-xl bg-amber-100 text-amber-500 border-2 border-amber-500 text-center w-full py-8"
		>
			No listings found
		</div>
	{/if}
</div>

{#if listings && listingsPerPage < listings.length}
	<div class="flex justify-end mt-4">
		<div>
			<button
				class="rounded-xl border border-midiGrayLight bg-transparent p-2 focus:outline-none disabled:opacity-40"
				disabled={page <= 0}
				on:click={() => {
					page -= listingsPerPage;
				}}><CaretLeft /></button
			>
			<button
				disabled={sliceIndex == listings.length}
				class="rounded-xl border border-midiGrayLight bg-transparent p-2 focus:outline-none disabled:opacity-40"
				on:click={() => {
					page += listingsPerPage;
				}}><CaretRight /></button
			>
		</div>
	</div>
{/if}
