<script lang="ts">
	import type { Listing } from '$lib/types/listing';
	import { environmentNetwork, etherscanBaseUrl, truncateAddress } from '$lib/utils';
	import { buyItems, fetchListed } from '$lib/utils/listing.contract';
	import { fetchBalanceOf } from '$lib/utils/midi.contract';
	import { BigNumber, utils } from 'ethers';
	import { createEventDispatcher, onMount } from 'svelte';
	import SelectedListingForm from './SelectedListingForm.svelte';
	import { signer } from 'svelte-ethers-store';

	export let listing: Listing;

	const labelClass = 'text-xs text-gray-500 font-bold';
	let availableAmount: BigNumber = BigNumber.from(0);
	let listed = true;
	let purchaseProcessing = false;
	let purchaseAmount = 1;

	// to the parent component
	const dispatch = createEventDispatcher<{
		purchaseComplete: { amount: number; txId: string };
		deselectListing: {};
	}>();
	const deselectListing = () => {
		dispatch('deselectListing');
	};

	const fetchAvailableAmount = async () => {
		availableAmount = await fetchBalanceOf(listing.listing, listing.tokenId.toNumber());
	};

	const _fetchListed = async () => {
		listed = await fetchListed(listing.listing);
	};

	/** purchase the NFT */
	const purchase = async () => {
		if (!$signer) {
			return;
		}
		purchaseProcessing = true;

		const receipt = await buyItems({
			amount: purchaseAmount,
			address: listing.listing,
			signer: $signer,
			price: listing.price
		});
		purchaseProcessing = false;
		if (receipt) {
			dispatch('purchaseComplete', {
				amount: purchaseAmount,
				txId: receipt.transactionHash
			});
		}
	};

	onMount(() => {
		fetchAvailableAmount();
		_fetchListed();
	});
</script>

<div>
	<button class="text-link" on:click={deselectListing}>Back</button>

	<div class="grid grid-cols-2">
		<div class="flex flex-col mb-4 py-4">
			<div class="flex flex-col">
				<div class="flex flex-col mb-1">
					<span class={labelClass}>Listing Address</span>
					<a
						href={`${etherscanBaseUrl(environmentNetwork()?.chainId ?? 137)}/address/${
							listing.listing
						}`}
						target="_blank"
						rel="noreferrer"
						class="text-link">{truncateAddress(listing.listing)}</a
					>
				</div>

				<div class="flex mb-1">
					<div class="flex flex-col mr-8">
						<span class={labelClass}>Available</span>
						{#if listed}
							{#if availableAmount}
								<span>{availableAmount.toString()}</span>
							{:else}
								<span>-</span>
							{/if}
						{:else}
							<div>
								<span class="font-bold text-yellow-600">Listing Canceled</span>
							</div>
						{/if}
					</div>

					<div class="flex flex-col">
						<span class={labelClass}>Total Listed</span>
						<span>{listing.amount}</span>
					</div>
				</div>

				<div class="flex flex-col mb-1">
					<span class={labelClass}>Price</span>
					<span>{utils.formatEther(listing.price)} ETH</span>
				</div>

				<div class="flex flex-col mb-2">
					<span class={labelClass}>Listed By</span>
					<a
						href={`${etherscanBaseUrl}/address/${listing.user}`}
						target="_blank"
						rel="noreferrer"
						class="text-link">{truncateAddress(listing.user)}</a
					>
				</div>
			</div>
		</div>

		<!-- form -->

		<SelectedListingForm
			{availableAmount}
			price={listing.price}
			formDisabled={purchaseProcessing}
			bind:purchaseAmount
			on:submitPurchase={purchase}
		/>
	</div>
</div>
