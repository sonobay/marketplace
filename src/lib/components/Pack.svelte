<script lang="ts">

	import type { ListingRow } from '$lib/types/listing-row';
	import Ethereum from './icons/Ethereum.svelte';
	import NounErrorPage from './icons/NounErrorPage.svelte';
	import { ethers } from 'ethers';
	import Synth from './icons/Synth.svelte';
	export let listing: ListingRow;
	$: image=listing.midi?.metadata?.image
									? listing.midi.metadata.image.replace('ipfs://', 'https://nftstorage.link/ipfs/')
									: ''
	$: name = listing.midi?.metadata?.name ? listing.midi.metadata.name : ''
	$: manufacturer = listing.midi?.metadata?.properties?.devices[0] ? listing.midi?.metadata?.properties?.devices[0].manufacturer : "";
	$: model = listing.midi?.metadata?.properties?.devices[0] ? listing.midi?.metadata?.properties?.devices[0].name : "";
	
</script>

<div class="relative">
	<a href={'/midi/' + listing.midi?.id}>
	<div class="rounded-xl overflow-hidden items-center justify-center flex bg-gray-100">
		{#if image}
			<img class="w-full" src={image} alt={name} />
		{:else}
			<NounErrorPage size={36} />
		{/if}
	</div>
	<div class="absolute top-0 bottom-0 left-0 right-0 flex flex-col p-2 justify-between">
			<p class="bg-black/75 text-white text-center w-full rounded-3xl py-1 px-3 font-bold"
				>{name}</p>
			<div>
				<div class="bg-white/75 text-black rounded-3xl w-min flex items-center">
					<div class="px-2 py-1">
						<Ethereum></Ethereum>
					</div>
					
					<p class="bg-midiYellow rounded-full p-2 text-sm">
						{parseFloat(ethers.utils.formatEther(listing.price)).toFixed(2)}
					</p>
				</div>

				<div class="bg-midiBlue rounded-3xl gap-2 flex items-center w-full text-white font-bold mt-2">
					<div class="bg-black rounded-3xl  flex py-2 px-4 gap-2">
						<Synth></Synth> 
						<p>{manufacturer}</p> 
					</div>
					<p>{model}</p>
				</div>
			</div>
	</div>
	</a>
</div>
