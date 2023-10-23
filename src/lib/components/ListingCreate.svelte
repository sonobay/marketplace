<script lang="ts">
	import { BigNumber } from 'ethers';
	import Dialog from './Dialog.svelte';
	import Button from './Button.svelte';
	import { isApprovedForAll, midiContract, setApprovalForAll } from '$lib/utils/midi.contract';
	import { environment } from '$lib/env';
	import { signer, signerAddress } from 'svelte-ethers-store';
	import { page } from '$app/stores';
	import { createListing } from '$lib/utils/market.contract';
	import { onDestroy } from 'svelte';
	import YellowButton from './buttons/YellowButton.svelte';
	import DollarIcon from './icons/DollarIcon.svelte';
	import { connected } from 'svelte-ethers-store';

	let listingAmount = 1;
	let listingPrice = 1;
	let tokenBalance = BigNumber.from(0);
	let approvalIsLoading = false;
	let dialogVisible = false;
	let isApproved = false;
	const { marketAddress } = environment;
	const tokenId = $page.params.id;

	const toggleModal = () => {
		dialogVisible = !dialogVisible;
	};

	const approve = async () => {
		approvalIsLoading = true;
		const approved = await setApprovalForAll({
			operator: marketAddress,
			approved: true,
			signer: $signer
		});
		isApproved = approved;
		approvalIsLoading = false;
	};

	const fetchBalance = async () => {
		if (!$signerAddress) {
			return;
		}
		const { id } = $page.params;

		const fetchBalance = await midiContract().balanceOf($signerAddress, id);
		tokenBalance = BigNumber.from(fetchBalance);
	};

	const checkOwner = async () => {
		if (!$signerAddress) {
			return;
		}

		await fetchBalance();

		/**
		 * check if marketplace approved
		 */
		if (tokenBalance.gt(0)) {
			isApproved = await isApprovedForAll({ account: $signerAddress, operator: marketAddress });
		}
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

	const sub = signerAddress.subscribe(async (address) => {
		checkOwner();
	});

	onDestroy(sub);
</script>

<YellowButton action={toggleModal} disabled={!$connected}>
	<div class="flex align-center items-center">
		<DollarIcon />
		<span class="ml-1">Sell</span>
	</div>
</YellowButton>

<!-- modal -->
<Dialog id="listings-dialog" visible={dialogVisible} on:close={toggleModal}>
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
