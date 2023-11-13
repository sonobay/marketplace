<script lang="ts">
	import type { AvailableListing, Listing } from '$lib/types/listing';
	import { environmentNetwork, etherscanBaseUrl, truncateAddress } from '$lib/utils';
	import { utils } from 'ethers';
	import YellowButton from '../buttons/YellowButton.svelte';
	import { createEventDispatcher } from 'svelte';

	export let listing: AvailableListing;
	const dispatch = createEventDispatcher<{ listingSelected: Listing }>();

	const selectListing = (listing: Listing) => {
		dispatch('listingSelected', listing);
	};
</script>

<tr>
	<td class="p-1">
		<a
			href={`${etherscanBaseUrl(environmentNetwork()?.chainId ?? 137)}/address/${listing.listing}`}
			target="_blank"
			class="text-link"
			rel="noreferrer">{truncateAddress(listing.listing)}</a
		>
	</td>
	<td class="p-1">{!listing ? '0' : listing.available ?? '-'} / {listing.amount}</td>
	<td class="p-1">{utils.formatEther(listing.price)}</td>
	<td class="p-1">
		<a
			href={`${etherscanBaseUrl}/address/${listing.user}`}
			target="_blank"
			rel="noreferrer"
			class="text-link">{truncateAddress(listing.user)}</a
		></td
	>
	<td class="p-1"
		><YellowButton
			disabled={!listing.listed || listing.available?.lte(0)}
			action={() => selectListing(listing)}>Buy</YellowButton
		></td
	>
</tr>
