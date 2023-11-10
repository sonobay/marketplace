<script lang="ts">
	import type { Listing } from '$lib/types/listing';
	import { environmentNetwork, etherscanBaseUrl, truncateAddress } from '$lib/utils';
	import { BigNumber, utils } from 'ethers';
	import YellowButton from '../buttons/YellowButton.svelte';
	import { createEventDispatcher, onMount } from 'svelte';
	import { fetchBalanceOf } from '$lib/utils/midi.contract';
	import { fetchListed } from '$lib/utils/listing.contract';

	export let listing: Listing;
	let availableAmount: BigNumber;
	let listed = true;
	const dispatch = createEventDispatcher<{ listingSelected: Listing }>();

	const selectListing = (listing: Listing) => {
		dispatch('listingSelected', listing);
	};

	const _fetchAvailableAmount = async () => {
		availableAmount = await fetchBalanceOf(listing.listing, listing.tokenId.toNumber());
		console.log('listing amount is: ', listing.amount.toString());
		console.log('available amount is: ', availableAmount.toString());
	};

	const _fetchListed = async () => {
		listed = await fetchListed(listing.listing);
	};

	onMount(() => {
		_fetchAvailableAmount();
		_fetchListed();
	});
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
	<td class="p-1">{!listing ? '0' : availableAmount ?? '-'} / {listing.amount}</td>
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
			disabled={!listed || availableAmount?.lte(0)}
			action={() => selectListing(listing)}>Buy</YellowButton
		></td
	>
</tr>
