<script lang="ts">
	import type { Listing } from '$lib/types/listing';
	import Dialog from '../Dialog.svelte';
	import BlueButton from '../buttons/BlueButton.svelte';
	import Cart from '../icons/Cart.svelte';
	import { connected } from 'svelte-ethers-store';
	import ListingsTable from './ListingsTable.svelte';
	import SelectedListing from './SelectedListing.svelte';
	import PurchaseSuccess from './PurchaseSuccess.svelte';
	import type { MIDI } from '@sonobay/sdk';
	import { listingsStore } from '$lib/stores/listings';

	export let midi: MIDI;
	let dialogVisible = false;
	let selectedListing: Listing | undefined = undefined;
	let purchaseTxHash: string | undefined = undefined;
	let purchaseAmount: number | undefined;

	const toggleDialog = () => {
		dialogVisible = !dialogVisible;
	};
</script>

<BlueButton action={toggleDialog} disabled={!$connected}>
	<div class="flex align-center items-center">
		<Cart />
		<span class="ml-1">Buy</span>
	</div>
</BlueButton>

<Dialog id="buy-modal" visible={dialogVisible} on:close={toggleDialog}>
	<!-- Modal body -->
	<div class="p-6 space-y-6">
		<div class="mb-6">
			{#if !selectedListing && !purchaseTxHash}
				<!-- if no listing is selected, show listings table -->
				{#if $listingsStore.listings.length > 0}
					<ListingsTable on:listingSelected={(e) => (selectedListing = e.detail)} />
				{:else}
					<span>No packs listed.</span>
				{/if}
			{:else if selectedListing && !purchaseTxHash}
				<!-- if a listing is selected, show the buy component -->
				<SelectedListing
					listing={selectedListing}
					on:deselectListing={() => (selectedListing = undefined)}
					on:purchaseComplete={(val) => {
						purchaseAmount = val.detail.amount;
						purchaseTxHash = val.detail.txId;
						selectedListing = undefined;
					}}
				/>
			{:else}
				<PurchaseSuccess
					amount={purchaseAmount ?? 0}
					on:close={toggleDialog}
					packName={midi.metadata.name}
				/>
			{/if}
		</div>
	</div>
</Dialog>
