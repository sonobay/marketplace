<script lang="ts">
	import AddDevice from './steps/AddDevice.svelte';
	import StepHeader from './components/StepHeader.svelte';
	import type { Device } from '$lib/types/device';
	import { mint } from '$lib/stores/mint';
	import AddPack from './steps/AddPack.svelte';
	import AddMidi from './steps/AddMidi.svelte';
	import MintNft from './steps/MintNft.svelte';

	export let data: { devices: Device[] };

	let patchImage: File;
	let packImage: File;

	function nextStep() {
		$mint.step++;
	}
	function previousStep() {
		$mint.step--;
	}

	function setPackImage(images: FileList) {
		packImage = images[0];
		nextStep();
	}
	function setPatchImage(images: FileList) {
		patchImage = images[0];
		nextStep();
	}
</script>

<section class="mt-16 md:mt-0 flex flex-col justify-center items-center w-full ">
	<div class="text-center mb-12">
		<h1 class="font-bold text-5xl mb-6">Minting MIDI NFT Pack</h1>
		<div class="flex justify-center gap-4 md:gap-10">
			<StepHeader blue={$mint.step >= 1} text="Add Devices" />
			<StepHeader blue={$mint.step >= 2} text="Add Pack Info" />
			<StepHeader blue={$mint.step >= 3} text="Add MIDI Patches" />
			<StepHeader blue={$mint.step >= 4} text="Mint NFT" />
		</div>
	</div>

	<div class="w-full lg:w-[800px]">
		{#if $mint.step == 1}
			<AddDevice devices={data.devices} nextAction={nextStep} />
		{/if}
		{#if $mint.step == 2}
			<AddPack nextAction={setPackImage} previousAction={previousStep} />
		{/if}
		{#if $mint.step == 3}
			<AddMidi nextAction={setPatchImage} previousAction={previousStep} />
		{/if}
		{#if $mint.step == 4}
			<MintNft {packImage} {patchImage} />
		{/if}
	</div>
</section>
