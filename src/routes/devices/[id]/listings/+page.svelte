<script lang="ts">
	import Pack from '$lib/components/Pack.svelte';
	import type { Device } from '$lib/types/device';
	import { page } from '$app/stores';
	import { onDestroy } from 'svelte';
	import type { ListingRow } from '$lib/types/listing-row';
	import DeviceMidiSearch from '$lib/components/DeviceMidiSearch.svelte';

	export let data: { device: Device; listings: ListingRow[] };

	let { device, listings } = data;
	let deviceId = device.id;

	/**
	 * used when device id url param changes
	 * fetches new id
	 **/
	const unsubscribe = page.subscribe((_page) => {
		const { id } = _page.params;

		if (id !== deviceId) {
			fetchDevice(id);
			fetchListings(id);
		}
	});

	const fetchListings = async (id: string) => {
		const _url = new URL(`/api/fetchListings.json`);
		_url.searchParams.append('deviceId', id);

		const res = await fetch(_url, {
			headers: {
				accept: 'application/json'
			}
		});

		const json = (await res.json()) as { listings: ListingRow[] };
		listings = json.listings;
	};

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

	onDestroy(unsubscribe);
</script>

<section class="pt-16 md:pt-32 px-4 flex justify-center">
	<div class="container">
		<div class="mb-12 sticky z-10 bg-white">
			<div class="flex md:flex-row flex-col justify-between md:items-center mb-4 gap-2">
				<h1 class="hidden md:inline">{device.manufacturer} {device.name}</h1>
		
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
				<DeviceMidiSearch {deviceId} />
		
				<!-- added temporarily until dropdown can be added back in -->
				<div class="flex flex-row gap-2 md:gap-4 md:w-1/2 w-full" />
		
				<!-- hiding dropdown until we have API support -->
				<!-- <div class="flex flex-row gap-2 md:gap-4 md:w-1/2 w-full">
					<Dropdown placeholder="Sort by" items={['price', 'date']} />
				</div> -->
			</div>
		</div>
		
		<div>
			{#if listings && listings.length > 0}
				<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 gap-y-8">
					{#each listings as listing}
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

</div>
</section>