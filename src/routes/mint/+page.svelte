<script lang="ts">
	import AddDevice from './steps/AddDevice.svelte';
	import StepHeader from './components/StepHeader.svelte';
	import type { Device } from '$lib/types/device';
	import { mint } from '$lib/stores/mint';
	import AddPack from './steps/AddPack.svelte';
	import AddMidi from './steps/AddMidi.svelte';
	import MintNft from './steps/MintNft.svelte';
	import { headerCSS } from '$lib/stores/header.js';
	import { onMount } from 'svelte';
	import Container from '$lib/components/Container.svelte';

	onMount(() => {
		$headerCSS = 'text-black before:bg-black';
	});

	export let data: { devices: Device[] };

	function nextStep() {
		$mint.step++;
		$mint.step = $mint.step;
	}
	function previousStep() {
		$mint.step--;
		$mint.step = $mint.step;
	}
</script>

<Container>
	<section class="flex flex-col justify-center items-center w-full px-4 ">
		<div class="text-center mb-6">
			<h1 class="font-bold text-5xl mb-6">Minting MIDI NFT Pack</h1>
			<div class="flex justify-center gap-4 md:gap-10">
				<StepHeader blue={$mint.step >= 1} text="Add Devices" />
				<StepHeader blue={$mint.step >= 2} text="Add Pack Info" />
				<StepHeader blue={$mint.step >= 3} text="Add MIDI Patches" />
				<StepHeader blue={$mint.step >= 4} text="Mint NFT" />
			</div>
		</div>

		<div class="w-full">
			{#if $mint.step == 1}
				<AddDevice devices={data.devices} nextAction={nextStep} />
			{/if}
			{#if $mint.step == 2}
				<AddPack nextAction={nextStep} previousAction={previousStep} />
			{/if}
			{#if $mint.step == 3}
				<AddMidi nextAction={nextStep} previousAction={previousStep} />
			{/if}
			{#if $mint.step == 4}
				<MintNft />
			{/if}
		</div>
	</section>
</Container>
