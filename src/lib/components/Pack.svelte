<script lang="ts">
	import type { IPFSEntry, MintEntry } from '$lib/types/entry';
	import NounErrorPage from './icons/NounErrorPage.svelte';
	import NounMidi from './icons/NounMIDI.svelte';
	import NounMint from './icons/NounMint.svelte';

	export let image: string | undefined = undefined;
	export let name: string;
	export let numberMinted: number;
	export let entries: IPFSEntry[] | MintEntry[];
</script>

<div class="relative w-72 h-72">
	<div class="rounded-xl overflow-hidden w-72 h-72 items-center justify-center flex bg-gray-100">
		{#if image}
			<img class="w-full" src={image} alt={name} />
		{:else}
			<NounErrorPage size={36} />
		{/if}
	</div>

	<div class="absolute bottom-1 left-0 right-0 flex flex-col p-2">
		<div class="mb-2">
			<div class="bg-white/75 text-black rounded-lg py-1 px-3 text-sm flex float-left items-center">
				<NounMint size={16} />
				<span class="ml-2">{numberMinted}</span>
			</div>
		</div>

		<div class="mb-2">
			<div class="bg-white/75 text-black rounded-lg py-1 px-3 text-sm flex float-left items-center">
				<NounMidi size={16} />
				<span class="ml-2">{entries.length}</span>
			</div>
		</div>

		<div class="w-full flex">
			<span class="bg-black/75 text-white w-full rounded-lg py-1 px-3 font-bold text-sm"
				>{name}</span
			>
		</div>
	</div>
</div>
