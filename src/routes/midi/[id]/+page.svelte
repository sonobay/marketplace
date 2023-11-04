<script lang="ts">
	export let data: { midi: MIDI };
	import { signerAddress } from 'svelte-ethers-store';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { midiContract } from '$lib/utils/midi.contract';
	import { fetchListingEvents } from '$lib/utils/market.contract';
	import { BigNumber } from 'ethers';
	import type { MIDI } from '$lib/types/midi';
	import MidiPatchBasicInfo from '$lib/components/MIDIPatchBasicInfo.svelte';
	import Container from '$lib/components/Container.svelte';
	import type { Listing } from '$lib/types/listing';

	let { midi } = data;
	let tokenBalance = BigNumber.from(0);
	let listings: Listing[] = [];

	onMount(() => {
		fetchListings();
	});

	const fetchBalance = async () => {
		if (!$signerAddress) {
			return;
		}
		const { id } = $page.params;

		const fetchBalance = await midiContract().balanceOf($signerAddress, id);
		tokenBalance = BigNumber.from(fetchBalance);
	};

	const fetchListings = async () => {
		listings = await fetchListingEvents(+$page.params.id);
	};
</script>

<Container>
	<MidiPatchBasicInfo {listings} {midi} {tokenBalance} on:refreshBalance={() => fetchBalance()} />
</Container>
