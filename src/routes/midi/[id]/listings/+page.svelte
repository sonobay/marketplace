<script lang="ts">
	export let data: { midi: MIDI };
	import { signerAddress, signer } from 'svelte-ethers-store';
	import { onDestroy, onMount } from 'svelte';
	import { page } from '$app/stores';
	import { isApprovedForAll, midiContract, setApprovalForAll } from '$lib/utils/midi.contract';
	import { createListing, fetchListingEvents } from '$lib/utils/market.contract';
	import { BigNumber } from 'ethers';
	import Dialog from '$lib/components/Dialog.svelte';
	import { addresses } from '$lib/constants/addresses';
	import Button from '$lib/components/Button.svelte';
	import type { Listing } from '$lib/types/listing';
	import ListingItem from '$lib/components/ListingItem.svelte';
	import type { MIDI } from '$lib/types/midi';
	import MidiPatchBasicInfo from '$lib/components/MIDIPatchBasicInfo.svelte';
	import MidiSubNav from '$lib/components/MIDISubNav.svelte';

	let { midi } = data;
	let tokenBalance = BigNumber.from(0);
	let dialogVisible = false;
	let listingAmount = 1;
	let listingPrice = 1;
	let isApproved = false;
	let approvalIsLoading = false;
	let listings: Listing[] = [];
	const tokenId = $page.params.id;

	const checkOwner = async () => {
		if (!$signerAddress) {
			return;
		}

		await fetchBalance();

		/**
		 * check if marketplace approved
		 */
		if (tokenBalance.gt(0)) {
			isApproved = await isApprovedForAll({ account: $signerAddress, operator: addresses.market });
		}
	};

	const fetchBalance = async () => {
		if (!$signerAddress) {
			return;
		}
		const { id } = $page.params;

		const fetchBalance = await midiContract().balanceOf($signerAddress, id);
		tokenBalance = BigNumber.from(fetchBalance);
	};

	const sub = signerAddress.subscribe(async (address) => {
		checkOwner();
	});

	const toggleModal = () => {
		dialogVisible = !dialogVisible;
	};

	const approve = async () => {
		approvalIsLoading = true;
		const approved = await setApprovalForAll({
			operator: addresses.market,
			approved: true,
			signer: $signer
		});
		isApproved = approved;
		approvalIsLoading = false;
	};

	const _fetchListings = async () => {
		listings = await fetchListingEvents(+$page.params.id);
	};

	const list = async () => {
		if (!tokenId) {
			console.error('no token id');
			return;
		}
		const success = await createListing({
			tokenId: +tokenId,
			amount: listingAmount,
			price: listingPrice,
			signer: $signer
		});
		if (!success) {
			return;
		}

		_fetchListings();
		fetchBalance();
		dialogVisible = false;
	};

	onMount(() => {
		_fetchListings();
	});

	onDestroy(sub);
</script>

<div>
	<MidiPatchBasicInfo {midi} {tokenBalance} />

	<!-- Sub nav-->
	<MidiSubNav
		midiID={midi.id}
		active="LISTINGS"
		on:launchCreateListingModal={() => (dialogVisible = true)}
		createListingDisabled={!tokenBalance || tokenBalance.lte(0)}
	/>

	<!-- Listings -->
	{#if listings.length > 0}
		<div class="grid grid-cols-3 gap-4">
			{#each listings as listing}
				<ListingItem {listing} on:purchaseComplete={() => fetchBalance()} />
			{/each}
		</div>
	{:else}
		<div
			class="rounded-xl bg-amber-100 text-amber-500 border-2 border-amber-500 text-center w-full py-8"
		>
			No Listings Found
		</div>
	{/if}
</div>

<!-- modal -->
<Dialog visible={dialogVisible} on:close={toggleModal}>
	<!-- Modal body -->
	<div class="p-6 space-y-6">
		<div class="mb-6">
			<div class="flex justify-between">
				<label for="amount" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
					># to list</label
				>
				<span class="text-base leading-relaxed text-gray-500 dark:text-gray-400"
					>Balance: {tokenBalance.toString()}</span
				>
			</div>
			<input
				min="1"
				max={tokenBalance.toNumber()}
				bind:value={listingAmount}
				type="number"
				id="amount"
				class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
				required
			/>
		</div>

		<div class="mb-6">
			<div class="flex justify-between">
				<label for="price" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
					>Price per Pack (in ETH)</label
				>
			</div>
			<input
				min="0"
				bind:value={listingPrice}
				type="number"
				id="price"
				class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
				required
			/>
		</div>

		<p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
			lorem ipsum about listing MIDI NFT
		</p>
	</div>

	<!-- Modal footer -->
	<div
		class="flex items-center p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600"
	>
		<Button
			text="Approve"
			disabled={approvalIsLoading || isApproved}
			loading={approvalIsLoading}
			on:click={() => approve()}
		/>
		<Button on:click={(_) => list()} text="Create Listing" disabled={!isApproved} />
	</div>
</Dialog>