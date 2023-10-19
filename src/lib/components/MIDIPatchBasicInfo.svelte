<script lang="ts">
	import type { MIDI } from '$lib/types/midi';
	import { environmentNetwork, etherscanBaseUrl, truncateAddress } from '$lib/utils';
	import type { BigNumber } from 'ethers';
	import { createEventDispatcher, onMount } from 'svelte';
	import { connected } from 'svelte-ethers-store';
	import TransferMidi from './TransferMIDI.svelte';
	import BurnMidi from './BurnMIDI.svelte';
	import { fetchTotalSupply } from '$lib/utils/midi.contract';
	import { environment } from '$lib/env';
	import Tag from './Tag.svelte';
	import Cart from './icons/Cart.svelte';

	export let midi: MIDI;
	export let tokenBalance: BigNumber | undefined;

	let totalSupply: BigNumber | undefined = undefined;
	const { midiAddress } = environment;

	const tokenIdLink = `${etherscanBaseUrl(
		environmentNetwork()?.chainId ?? 137
	)}/token/${midiAddress}?a=${midi.id}`;

	const dispatch = createEventDispatcher();

	const _fetchTotalSupply = async () => {
		totalSupply = await fetchTotalSupply(midi.id);
	};

	/** fetch total supply on load */
	onMount(() => {
		_fetchTotalSupply();
	});
</script>

<div class="flex flex-col justify-between mb-4 rounded shadow p-4 bg-white">
	<div class="mb-4">
		<div class="flex">
			<div class="rounded overflow-hidden w-72 h-72">
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
					<a href={`/users/${midi.createdBy}`} class="text-link text-sm"
						>{truncateAddress(midi.createdBy)}</a
					>
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

				<!-- Device Tags-->
				<div class="flex flex-wrap w-full mb-1">
					{#each midi.midi_devices as midiDevice}
						<Tag link={`/devices/${midiDevice.device.id}`} type="device">
							<span>{midiDevice.device.manufacturer}: {midiDevice.device.name}</span>
						</Tag>
					{/each}
				</div>

				<!-- Pack Tags -->
				<div class="flex flex-wrap w-full mb-1">
					{#each midi.tags as packTag}
						<Tag type="tag">
							<span>#{packTag.toLowerCase()}</span>
						</Tag>
					{/each}
				</div>

				<p class="mb-4 text-sm">{midi.metadata.description}</p>
			</div>
		</div>
	</div>
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

			<!-- Buy -->
			<button>
				<div class="flex align-center items-center">
					<Cart />
					<span class="ml-1">Buy</span>
				</div>
			</button>

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
