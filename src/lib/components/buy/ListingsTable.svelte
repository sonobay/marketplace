<script lang="ts">
	import type { Listing } from '$lib/types/listing';
	import { environmentNetwork, etherscanBaseUrl, truncateAddress } from '$lib/utils';
	import { utils } from 'ethers';
	import YellowButton from '../buttons/YellowButton.svelte';
	import { createEventDispatcher } from 'svelte';

	export let listings: Listing[];

	// when clicking buy, dispatch an event that passes the listing
	// to the parent component
	const dispatch = createEventDispatcher<{ listingSelected: Listing }>();
	const selectListing = (listing: Listing) => {
		dispatch('listingSelected', listing);
	};
</script>

<table>
	<thead>
		<th>Listing Address</th>
		<th>Amount Available</th>
		<th>Price</th>
		<th>Listed By</th>
		<th />
	</thead>
	<tbody>
		{#each listings as listing}
			<tr>
				<td>
					<a
						href={`${etherscanBaseUrl(environmentNetwork()?.chainId ?? 137)}/address/${
							listing.listing
						}`}
						target="_blank"
						rel="noreferrer">{truncateAddress(listing.listing)}</a
					>
				</td>
				<td>{listing.amount}</td>
				<td>{utils.formatEther(listing.price)}</td>
				<td>
					<a
						href={`${etherscanBaseUrl}/address/${listing.user}`}
						target="_blank"
						rel="noreferrer"
						class="text-link">{truncateAddress(listing.user)}</a
					></td
				>
				<td><YellowButton action={() => selectListing(listing)}>Buy</YellowButton></td>
			</tr>
		{/each}
	</tbody>
</table>
