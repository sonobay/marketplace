<script lang="ts">
	import type { Listing } from '$lib/types/listing';
	import { buyItems, fetchListed } from '$lib/utils/listing.contract';
	import { utils } from 'ethers';
	import Button from './Button.svelte';
	import Dialog from './Dialog.svelte';
	import { signer } from 'svelte-ethers-store';
	import { createEventDispatcher, onMount } from 'svelte';
	import type { BigNumber } from 'ethers';
	import { fetchBalanceOf } from '$lib/utils/midi.contract';
	import { environmentNetwork, etherscanBaseUrl, truncateAddress } from '$lib/utils';

	export let listing: Listing;

	const dispatch = createEventDispatcher();
	let dialogVisible = false;
	let purchaseProcessing = false;
	let availableAmount: BigNumber;
	let listed = true;
	$: amountToBuy = 1;

	const purchase = async () => {
		if (!signer) {
			return;
		}
		purchaseProcessing = true;

		const success = await buyItems({
			amount: amountToBuy,
			address: listing.listing,
			signer: $signer,
			price: listing.price
		});
		purchaseProcessing = false;
		if (success) {
			dispatch('purchaseComplete');
		}
	};

	const setAmountToBuy = (e: Event) => {
		const target = e.target as HTMLInputElement;
		amountToBuy = Math.ceil(+target.value);
	};

	const _fetchAvailableAmount = async () => {
		availableAmount = await fetchBalanceOf(listing.listing, listing.tokenId.toNumber());
	};

	const _fetchListed = async () => {
		listed = await fetchListed(listing.listing);
	};

	onMount(() => {
		_fetchAvailableAmount();
		_fetchListed();
	});

	const labelClass = 'text-xs text-gray-500 font-bold';
</script>

<div class="flex flex-col shadow rounded mb-4 py-4 px-8 bg-white">
	<a class="flex flex-col" href={`/listing/${listing.listing}`}>
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
				<span class={labelClass}>Total Amount</span>
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
	</a>

	{#if listed}
		<div>
			<Button
				on:click={() => (dialogVisible = true)}
				text="Buy"
				disabled={!$signer || !availableAmount || availableAmount?.isZero()}
			/>
			{#if availableAmount?.isZero()}
				<span>SOLD OUT</span>
			{/if}
		</div>
	{/if}
</div>

<!-- modal -->
<Dialog id="purchase-dialog" visible={dialogVisible} on:close={() => (dialogVisible = false)}>
	<!-- Modal body -->
	<div class="p-6 space-y-6">
		<div class="mb-6">
			<div class="flex justify-between">
				<label
					for={`${listing.listing}-amountToBuy`}
					class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"># to buy</label
				>
			</div>
			<input
				type="number"
				value={amountToBuy}
				on:input={setAmountToBuy}
				id={`${listing.listing}-amountToBuy`}
				class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
				required
			/>
		</div>

		<p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
			lorem ipsum about listing MIDI NFT
		</p>

		<div class="font-xl text-white">
			<span>Total:</span>
			<span>{amountToBuy ? utils.formatEther(listing.price.mul(amountToBuy)) : '0'} ETH</span>
		</div>
	</div>

	<!-- Modal footer -->
	<div
		class="flex items-center p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600"
	>
		<!-- <Button text="Approve" disabled={approvalIsLoading || isApproved} loading={approvalIsLoading} on:click={() => approve()} /> -->
		<Button
			on:click={(_) => purchase()}
			text="Buy MIDI"
			loading={purchaseProcessing}
			disabled={purchaseProcessing}
		/>
	</div>
</Dialog>
