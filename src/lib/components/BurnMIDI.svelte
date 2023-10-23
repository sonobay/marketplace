<script lang="ts">
	import { midiContract } from '$lib/utils/midi.contract';
	import { createEventDispatcher } from 'svelte';
	import Dialog from './Dialog.svelte';
	import type { BigNumber } from 'ethers';
	import Button from './Button.svelte';
	import { environmentNetwork, etherscanBaseUrl } from '$lib/utils';
	import { signer, signerAddress } from 'svelte-ethers-store';
	import { connected } from 'svelte-ethers-store';
	import BurnIcon from './icons/BurnIcon.svelte';
	import WhiteButton from './buttons/WhiteButton.svelte';

	export let balance: BigNumber;
	export let id: number;

	const dispatch = createEventDispatcher();
	let dialogVisible = false;
	let burnAmount: number;
	let isTransferring = false;
	let transactionHash: string;

	const explorerBase = `${etherscanBaseUrl(environmentNetwork()?.chainId ?? 137)}/tx`;

	const toggleModal = () => {
		dialogVisible = !dialogVisible;
	};

	const burn = async () => {
		isTransferring = true;

		const tx = await midiContract($signer).burn($signerAddress, id, burnAmount);
		const receipt = await tx.wait();

		if (receipt.transactionHash) {
			transactionHash = receipt.transactionHash;
		}

		isTransferring = false;

		dispatch('midiBurned');
	};
</script>

<WhiteButton action={() => toggleModal()} disabled={!$connected}>
	<div class="flex items-center">
		<BurnIcon />
		<span class="ml-1">Burn</span>
	</div>
</WhiteButton>

<!-- modal -->
<Dialog id="burn-dialog" visible={dialogVisible} on:close={toggleModal}>
	<!-- Modal body -->
	<div class="p-6 space-y-6">
		<div class="mb-6">
			<div class="flex justify-between">
				<label for="amount" class="block mb-2 text-sm font-medium text-gray-900"># to Burn</label>
				<span class="text-base leading-relaxed text-gray-500">Balance: {balance.toString()}</span>
			</div>
			<input
				min="1"
				max={balance.toNumber()}
				bind:value={burnAmount}
				type="number"
				id="burn-amount"
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
				on:click={(_) => burn()}
				text="Burn NFT"
				disabled={!burnAmount || burnAmount <= 0 || balance.toNumber() < burnAmount}
				loading={isTransferring}
			/>
		{/if}
	</div>
</Dialog>
