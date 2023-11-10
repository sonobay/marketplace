<script lang="ts">
	import type { Listing } from '$lib/types/listing';
	import { createEventDispatcher } from 'svelte';
	import ListingsTableItem from './ListingsTableItem.svelte';

	export let listings: Listing[];

	// when clicking buy, dispatch an event that passes the listing
	// to the parent component
	const dispatch = createEventDispatcher<{ listingSelected: Listing }>();
	const selectListing = (listing: Listing) => {
		dispatch('listingSelected', listing);
	};
</script>

<table class="w-full">
	<thead>
		<th class="px-1 text-left">Listing Address</th>
		<th class="px-1 text-left">Available</th>
		<th class="px-1 text-left">Price</th>
		<th class="px-1 text-left">Listed By</th>
		<th class="px-1" />
	</thead>
	<tbody>
		{#each listings as listing}
			<ListingsTableItem {listing} on:listingSelected={(e) => selectListing(e.detail)} />
		{/each}
	</tbody>
</table>
