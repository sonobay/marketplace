<script lang="ts">
	export let data: { midi: MIDI };
	import { signerAddress } from 'svelte-ethers-store';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { midiContract } from '$lib/utils/midi.contract';
	import { BigNumber } from 'ethers';
	import type { MIDI } from '$lib/types/midi';
	import MidiPatchBasicInfo from '$lib/components/MIDIPatchBasicInfo.svelte';
	import Container from '$lib/components/Container.svelte';
	import { listingsStore } from '$lib/stores/listings';

	let { midi } = data;
	let tokenBalance = BigNumber.from(0);

	onMount(() => {
		listingsStore.fetchListings(+$page.params.id);
	});

	const fetchBalance = async () => {
		if (!$signerAddress) {
			return;
		}
		const { id } = $page.params;

		const fetchBalance = await midiContract().balanceOf($signerAddress, id);
		tokenBalance = BigNumber.from(fetchBalance);
	};
</script>

<Container>
	<MidiPatchBasicInfo {midi} {tokenBalance} on:refreshBalance={() => fetchBalance()} />
</Container>
