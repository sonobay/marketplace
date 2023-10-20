<script lang="ts">
	import BlueBox from '$lib/components/boxes/BlueBox.svelte';
	import YellowButton from '$lib/components/buttons/YellowButton.svelte';
	import Input from '$lib/components/inputs/Input.svelte';
	import Tag from '../components/Tag.svelte';
	import TagInput from '$lib/components/inputs/TagInput.svelte';
	import { mint } from '$lib/stores/mint';
	import BlueButton from '$lib/components/buttons/BlueButton.svelte';
	import { midi } from '$lib/stores/midi';
	import { onDestroy } from 'svelte';
	import { sendMidiToOutput } from '$lib/stores/midi';
	import type { MintEntry } from '$lib/types/entry';
	import CircleCheck from '$lib/components/icons/CircleCheck.svelte';
	import ImageInput from '$lib/components/inputs/ImageInput.svelte';
	import ImageRegular from '$lib/components/icons/ImageRegular.svelte';
	import { fade } from 'svelte/transition';
	import { connected } from 'svelte-ethers-store';
	import PatchTable from '$lib/components/PatchTable.svelte';

	export let nextAction = () => {};
	export let previousAction = () => {};

	const minMidiLength = 10;

	const initEntry = (): MintEntry => ({
		name: '',
		midi: undefined,
		image: undefined,
		tags: []
	});

	let entry: MintEntry = initEntry();
	$: validEntry = entry.midi && entry.midi?.length > 0 && entry.name.length > 0;
	$: done = $mint.patches.length > 0;

	const unsubscribe = midi.subscribe((store) => {
		if (!store.selectedInput) {
			return;
		}
		store.selectedInput.onmidimessage = (msg) => {
			if (msg.data.length > minMidiLength) {
				entry.midi = msg.data;
				entry = entry;
			}
		};
	});

	onDestroy(unsubscribe);

	function addTag(tag: string) {
		if (tag.length == 0 || tag.trim().length == 0) return;
		if (entry.tags.length >= 5) return;
		if (entry.tags.includes(tag)) return;
		entry.tags.push(tag);
		entry.tags = entry.tags;
	}
	function removeTag(tag: string) {
		entry.tags = entry.tags.filter((t) => t != tag);
	}
	function validateNameInput(input: string) {
		entry.name = input;
	}
	function addPatch() {
		if (!validEntry) return;
		$mint.patches.push(entry);
		$mint.patches = $mint.patches;
		entry = initEntry();
	}
	function removePatch(patch: MintEntry) {
		$mint.patches = $mint.patches.filter((p) => p != patch);
		$mint.patches = $mint.patches;
	}
</script>

<div in:fade|global class="min-h-[365px]">
	<BlueBox>
		<div class="flex lg:flex-row flex-col items-center md:items-start gap-6">
			<ImageInput
				image={entry.image}
				id="patch-logo"
				on:imageUpdated={(e) => {
					if (e.detail.files != undefined) {
						entry.image = e.detail.files[0];
					}
				}}
			/>

			<div class="w-full lg:w-4/5">
				<div class="lg:w-4/5">
					<div>
						<Input
							placeholder="Patch Name"
							max={20}
							value={entry.name.length > 0 ? entry.name : ''}
							onInputAction={validateNameInput}
						/>
					</div>
					<div class="mt-4 lg:w-60 w-full">
						<TagInput placeholder="Tags" action={addTag} />
					</div>
				</div>

				<div class="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 w-full">
					{#each entry.tags as tag}
						<Tag text={tag} action={removeTag} />
					{/each}
				</div>

				<div class="mt-8 mb-8 flex flex-col sm:flex-row gap-4 items-center">
					<YellowButton text="ADD TO PACK" disabled={!validEntry} action={addPatch} />
					<div>
						{#if entry.midi && entry.midi.length > minMidiLength}
							<p class="flex gap-2 items-center"><CircleCheck /> MIDI Received</p>
						{:else}
							<p class="flex gap-2 items-center">
								<span class="animate-ping w-2 h-2 rounded-full bg-midiYellow" /> Awaiting MIDI...
							</p>
						{/if}
					</div>
				</div>
			</div>
		</div>
		<PatchTable patches={$mint.patches} {removePatch} />
	</BlueBox>
</div>

<div class="flex justify-end mt-12 gap-4">
	<YellowButton text="BACK" action={previousAction} />
	<BlueButton text="MINT NFT" action={nextAction} disabled={!done || $connected == undefined} />
</div>
