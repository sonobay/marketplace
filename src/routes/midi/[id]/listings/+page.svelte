<script lang="ts">
	export let data: { midi: MIDI };
	import { signerAddress } from 'svelte-ethers-store';
	import { onDestroy, onMount } from 'svelte';
	import { page } from '$app/stores';
	import { isApprovedForAll, midiContract } from '$lib/utils/midi.contract';
	import { fetchListingEvents } from '$lib/utils/market.contract';
	import { BigNumber } from 'ethers';
	import type { Listing } from '$lib/types/listing';
	import ListingItem from '$lib/components/ListingItem.svelte';
	import type { MIDI } from '$lib/types/midi';
	import MidiPatchBasicInfo from '$lib/components/MIDIPatchBasicInfo.svelte';
	import { environment } from '$lib/env';
	import Container from '$lib/components/Container.svelte';

	let { midi } = data;
	let tokenBalance = BigNumber.from(0);
	let isApproved = false;
	let listings: Listing[] = [];
	const { marketAddress } = environment;

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

	const _fetchListings = async () => {
		listings = await fetchListingEvents(+$page.params.id);
	};

	onMount(() => {
		_fetchListings();
	});

	onDestroy(sub);
</script>

<Container>
	<MidiPatchBasicInfo {midi} {tokenBalance} />

	<!-- Listings -->
	{#if listings.length > 0}
		<div class="flex">
			<div class="grid grid-cols-3 gap-4">
				{#each listings as listing}
					<ListingItem {listing} on:purchaseComplete={() => fetchBalance()} />
				{/each}
			</div>
		</div>
	{:else}
		<div
			class="rounded-xl bg-amber-100 text-amber-500 border-2 border-amber-500 text-center w-full py-8"
		>
			No Listings Found
		</div>
	{/if}
</Container>
