<script lang="ts">
	import { addresses } from '$lib/constants/addresses';
	import type { MIDI } from '$lib/types/midi';
	import { environmentNetwork } from '$lib/utils';
	import type { BigNumber, constants } from 'ethers';
	import { createEventDispatcher, onMount } from 'svelte';
	import { connected } from 'svelte-ethers-store';
	import TransferMidi from './TransferMIDI.svelte';
	import BurnMidi from './BurnMIDI.svelte';
	import { fetchTotalSupply } from '$lib/utils/midi.contract';

	export let midi: MIDI;
	export let tokenBalance: BigNumber | undefined;

	const correctNetwork = environmentNetwork();
	let totalSupply: BigNumber | undefined = undefined;

	const midiAddress = addresses.midi;

	const tokenIdLink =
		correctNetwork?.chainId === 1
			? `https://etherscan.io/token/${midiAddress}?a=${midi.id}`
			: `https://sepolia.etherscan.io/token/${midiAddress}?a=${midi.id}`;
	const dispatch = createEventDispatcher();

	const _fetchTotalSupply = async () => {
		totalSupply = await fetchTotalSupply(midi.id);
	};

	/** fetch total supply on load */
	onMount(() => {
		_fetchTotalSupply();
	});
</script>

<div class="flex justify-between mb-4">
	<div class="flex">
		<div class="rounded-xl overflow-hidden w-72 h-72">
			{#if midi.metadata.image}
				<img class="w-full" src={midi.metadata.image} alt={midi.metadata.name} />
			{:else}
				<span>No image found</span>
			{/if}
		</div>

		<div class="px-4">
			<h2 class="font-bold text-2xl">{midi.metadata.name}</h2>

			<div>
				<span class="text-sm text-gray-400">By: </span>
				<a href={`/users/${midi.createdBy}`} class="text-link text-sm">{midi.createdBy}</a>
			</div>

			<div>
				<span class="text-sm text-gray-400">Token ID: </span>
				<a href={tokenIdLink} target="_blank" rel="noreferrer" class="text-link text-sm"
					>{midi.id}</a
				>
			</div>

			<div class="mb-1">
				<span class="text-sm text-gray-400">Total Supply: </span>
				<span class="text-sm text-gray-400">{totalSupply ? totalSupply.toString() : '-'}</span>
			</div>

			<div class="flex w-full mb-2">
				{#each midi.midi_devices as midiDevice}
					<a class="float-left" href={`/devices/${midiDevice.device.id}`}>
						<div
							class="bg-amber-100 text-amber-500 border-2 border-amber-500 pl-4 pr-4 py-2 rounded-xl flex mr-2"
						>
							<span>{midiDevice.device.manufacturer}: {midiDevice.device.name}</span>
						</div>
					</a>
				{/each}
			</div>
			<p class="mb-4">{midi.metadata.description}</p>

			{#if $connected}
				<div class="bg-gray-100 rounded shadow-sm pt-2 pb-4 px-4">
					<div class="mb-2">
						<span class="text-sm text-gray-400">Your Balance: </span>
						{#if tokenBalance}
							<span class="text-gray-500 text-sm">{tokenBalance.toString()}</span>
						{:else if $connected}
							<span class="text-gray-500 text-sm">0</span>
						{:else}
							<span class="text-gray-500 text-sm">-</span>
						{/if}
					</div>

					{#if tokenBalance && +tokenBalance > 0}
						<div class="grid grid-cols-2 gap-4">
							<TransferMidi
								balance={tokenBalance}
								id={midi.id}
								on:midiTransferred={() => dispatch('refreshBalance')}
							/>

							<BurnMidi
								balance={tokenBalance}
								id={midi.id}
								on:midiBurned={() => {
									dispatch('refreshBalance');
									_fetchTotalSupply();
								}}
							/>
						</div>
					{/if}
				</div>
			{/if}
		</div>
	</div>
</div>
