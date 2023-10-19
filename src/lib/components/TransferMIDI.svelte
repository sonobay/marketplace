<script lang="ts">
	import Dialog from './Dialog.svelte';
	import { BigNumber, utils } from 'ethers';
	import Button from './Button.svelte';
	import { midiContract } from '$lib/utils/midi.contract';
	import { signer, signerAddress } from 'svelte-ethers-store';
	import { environmentNetwork, etherscanBaseUrl } from '$lib/utils';
	import { createEventDispatcher } from 'svelte';
	import Send from './icons/Send.svelte';

	export let balance: BigNumber;
	export let id: number;

	let dialogVisible = false;
	let transferAmount: number;
	let transferToAddress: string;
	let isTransferring = false;
	let transactionHash: string;
	const dispatch = createEventDispatcher();

	const toggleModal = () => {
		dialogVisible = !dialogVisible;
	};

	const explorerBase = `${etherscanBaseUrl(environmentNetwork()?.chainId ?? 137)}/tx`;

	const transfer = async () => {
		/**
		 * address invalid
		 */
		if (!utils.isAddress(transferToAddress)) {
			return;
		}

		isTransferring = true;

		const midi = midiContract($signer);

		const tx = await midi.safeTransferFrom(
			$signerAddress,
			transferToAddress,
			id,
			transferAmount,
			[]
		);

		const receipt = await tx.wait();

		if (receipt.transactionHash) {
			transactionHash = receipt.transactionHash;

			dispatch('midiTransferred');
		}

		isTransferring = false;
	};
</script>

<button on:click={(_) => toggleModal()}>
	<div class="flex items-center">
		<Send />
		<span class="ml-1">Send</span>
	</div>
</button>

<!-- modal -->
<Dialog id="transfer-dialog" visible={dialogVisible} on:close={toggleModal}>
	<!-- Modal body -->
	<div class="p-6 space-y-6">
		<div class="mb-6">
			<div class="flex justify-between">
				<label for="amount" class="block mb-2 text-sm font-medium text-gray-900"
					># to Transfer</label
				>
				<span class="text-base leading-relaxed text-gray-500 dark:text-gray-400"
					>Balance: {balance.toString()}</span
				>
			</div>
			<input
				min="1"
				max={balance.toNumber()}
				bind:value={transferAmount}
				type="number"
				id="transfer-amount"
				class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
				required
			/>
		</div>

		<div class="mb-6">
			<div class="flex justify-between">
				<label for="price" class="block mb-2 text-sm font-medium text-gray-900"
					>Transfer to Address</label
				>
			</div>
			<input
				bind:value={transferToAddress}
				id="transfer-to-address"
				class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
				required
			/>
		</div>
	</div>

	<!-- Modal footer -->
	<div class="flex items-center p-6 space-x-2 rounded-b border-t border-gray-200">
		{#if transactionHash}
			<div
				class="flex items-center font-medium rounded-xl text-sm py-2.5 text-center w-full justify-center px-5 text-white bg-green-500"
			>
				<a href={`${explorerBase}/${transactionHash}`} target="_blank" rel="noreferrer"
					>🎉 View Transaction 🎉</a
				>
			</div>
		{:else}
			<Button
				on:click={(_) => transfer()}
				text="Transfer NFT"
				disabled={!utils.isAddress(transferToAddress) ||
					!transferAmount ||
					transferAmount <= 0 ||
					balance.toNumber() < transferAmount}
				loading={isTransferring}
			/>
		{/if}
	</div>
</Dialog>
