<script lang="ts">
	import type { MIDI } from '$lib/types/midi';
	import { environmentNetwork } from '$lib/utils';
	import type { BigNumber } from 'ethers';
	import { connected } from 'svelte-ethers-store';

	export let midi: MIDI;
	export let tokenBalance: BigNumber | undefined;

	const correctNetwork = environmentNetwork();
	const tokenIdLink =
		correctNetwork?.chainId === 1
			? `https://etherscan.io/token/0xe88bc69c554ffb8457f499055ed23d03a5515944?a=${midi.id}`
			: `https://goerli.etherscan.io/token/0xe88bc69c554ffb8457f499055ed23d03a5515944?a=${midi.id}`;
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
			<p>{midi.metadata.description}</p>
		</div>
	</div>
</div>
