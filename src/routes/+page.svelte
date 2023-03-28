<script lang="ts">
	import Pack from '$lib/components/Pack.svelte';
	import type { ListingRow } from '$lib/types/listing-row';

	export let data: { listings: ListingRow[] };

	let { listings } = data;
</script>

<div>
	<h3 class="text-3xl font-semibold text-charcoal mb-4">Latest Listings</h3>

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
