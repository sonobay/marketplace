<script lang="ts">
	export let data: { midi: MIDI };
	import { signerAddress, signer } from 'svelte-ethers-store';
	import { onDestroy } from 'svelte';
	import { page } from '$app/stores';
	import { isApprovedForAll, midiContract, setApprovalForAll } from '$lib/utils/midi.contract';
	import { createListing } from '$lib/utils/market.contract';
	import { BigNumber } from 'ethers';
	import Dialog from '$lib/components/Dialog.svelte';
	import { addresses } from '$lib/constants/addresses';
	import Button from '$lib/components/Button.svelte';
	import type { MIDI } from '$lib/types/midi';
	import PatchTable from '$lib/components/PatchTable.svelte';
	import MidiPatchBasicInfo from '$lib/components/MIDIPatchBasicInfo.svelte';

	let { midi } = data;
	let tokenBalance = BigNumber.from(0);
	let dialogVisible = false;
	let listingAmount = 1;
	let listingPrice = 1;
	let isApproved = false;
	let approvalIsLoading = false;
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
		console.log('fetching balance: ');
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

		fetchBalance();
		dialogVisible = false;
	};

	onDestroy(sub);
</script>

<div>
	<MidiPatchBasicInfo {midi} {tokenBalance} />

	<!-- Sub nav-->
	<div class="flex mb-4">
		<a
			class="bg-amber-500 text-white py-1 px-4 rounded-lg mr-4 border-amber-500 border-2"
			href={`/midi/${midi.id}`}>Patches</a
		>
		<a
			class="border-2 border-amber-500 text-amber-500 hover:bg-amber-100 py-1 px-4 rounded-lg mr-4"
			href={`/midi/${midi.id}/listings`}>Listings</a
		>
	</div>

	<!-- Patch Table -->
	<PatchTable entries={midi.metadata.properties.entries} />
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
