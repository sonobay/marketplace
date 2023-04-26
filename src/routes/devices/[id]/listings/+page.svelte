<script lang="ts">
	import Pack from '$lib/components/Pack.svelte';
	import type { Device } from '$lib/types/device';
	import { page } from '$app/stores';
	import { onDestroy } from 'svelte';
	import DeviceSubNav from '$lib/components/DeviceSubNav.svelte';
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

<div>
	<h2 class="font-bold text-2xl mb-2">{device.manufacturer} {device.name}</h2>

	<DeviceMidiSearch {deviceId} />

	<DeviceSubNav active="LISTINGS" deviceID={deviceId} />

	{#if listings && listings.length > 0}
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 gap-y-8">
			{#each listings as listing}
				<a href={`/listing/${listing.token_id}`}>
					<Pack
						image={listing.midi ? listing?.midi.metadata.image : undefined}
						name={listing.midi ? listing.midi.metadata.name : ''}
						entries={listing.midi ? listing.midi.metadata.properties.entries : []}
						numberMinted={0}
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
