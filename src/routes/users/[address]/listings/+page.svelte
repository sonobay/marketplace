<script lang="ts">
	import type { ListingRow } from '$lib/types/listing-row';
	import { page } from '$app/stores';
	import UserInfoHeaderSection from '$lib/components/UserInfoHeaderSection.svelte';
	import Pack from '$lib/components/Pack.svelte';
	import UserSubNav from '$lib/components/UserSubNav.svelte';

	export let data: { listings: ListingRow[] };

	let { listings } = data;
	const address = $page.params.address;
</script>

<div>
	<UserInfoHeaderSection {address} />

	<UserSubNav userAddress={address} active="LISTINGS" />

	{#if listings && listings.length > 0}
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 gap-y-8">
			{#each listings as listing}
				<a class="flex justify-left" href={`/listing/${listing.listing_address}`}>
					<Pack
						name={listing.midi?.metadata.name ?? ''}
						image={listing.midi?.metadata.image}
						entries={listing.midi?.metadata.properties.entries ?? []}
						numberMinted={listing.amount}
					/>
				</a>
			{/each}
		</div>
	{:else}
		<div
			class="rounded-xl bg-amber-100 text-amber-500 border-2 border-amber-500 text-center w-full py-8"
		>
			No Packs Found
		</div>
	{/if}
</div>
