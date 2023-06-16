<script lang="ts">
	import BlueBox from '$lib/components/boxes/BlueBox.svelte';
	import YellowButton from '$lib/components/buttons/YellowButton.svelte';
	import Input from '../components/Input.svelte';
	import Tag from '../components/Tag.svelte';
	import TagInput from '../components/TagInput.svelte';
	import { mint } from '$lib/stores/mint';
	import BlueButton from '$lib/components/buttons/BlueButton.svelte';
	import { midi } from '$lib/stores/midi';
	import { onDestroy } from 'svelte';
	import { sendMidiToOutput } from '$lib/stores/midi';
	import type { MintEntry } from '$lib/types/entry';
	import CircleCheck from '$lib/components/icons/CircleCheck.svelte';
	import ImageInput from '$lib/components/inputs/ImageInput.svelte';

	export let nextAction = (images: FileList) => {};
	export let previousAction = () => {};

	let images: FileList;

	const initEntry = (): MintEntry => ({
		name: '',
		midi: undefined,
		image: undefined,
		tags: []
	});

	let entry: MintEntry = initEntry();
	$: validEntry = entry.midi && entry.midi?.length > 0 && entry.name.length > 0;
	$: done = images != undefined;

	const unsubscribe = midi.subscribe((store) => {
		if (!store.selectedInput) {
			return;
		}
		store.selectedInput.onmidimessage = (msg) => {
			entry.midi = msg.data;
			entry = entry;
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
	}
	function removePatch(patch: MintEntry) {
		$mint.patches = $mint.patches.filter((p) => patch);
	}
</script>

<BlueBox>
	<div class="flex lg:flex-row flex-col items-center md:items-start gap-6">
		<div class="w-24 h-24">
			<ImageInput
				image={images}
				id="patch-logo"
				on:imageUpdated={(e) => {
					if (e.detail.image != undefined) images = e.detail.image;
				}}
			/>
		</div>
		<div class="w-full lg:w-4/5">
			<div class="lg:w-4/5">
				<div>
					<Input
						placeholder="Patch Name"
						max={40}
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

			<div class="mt-8 mb-8 flex flex-col lg:flex-row gap-4 items-center">
				<YellowButton text="ADD TO PACK" disabled={!validEntry} action={addPatch} />
				<div>
					{#if entry.midi && entry.midi.length > 10}
						<p class="flex gap-2 items-center"><CircleCheck /> MIDI Received</p>
					{:else}
						<p class="flex gap-2 items-center">
							<span class="animate-ping w-2 h-2 rounded-full bg-midiYellow" /> Awaiting MIDI...
						</p>
					{/if}
				</div>
			</div>

			<div class="bg-white p-8 rounded-2xl w-full text-xs text-midiGray">
				<div class="my-2 flex justify-between">
					<div class="flex gap-3 items-center">
						<p class="font-bold w-4">{1}.</p>
						<div class="w-6 h-6 bg-charcoal" />
						<p class="font-bold">name</p>
					</div>

					<p class="font-bold flex items-center">tags</p>

					<div class="flex gap-3">
						<button
							class="rounded-2xl px-4 py-1 bg-white border text-center  border-midiGrayLight text-xs"
							on:click={() => {
								sendMidiToOutput(entry.midi ?? new Uint8Array(0));
							}}>SEND TO DEVICE</button
						>
						<button
							class="rounded-2xl px-4 py-1 bg-white border text-center  border-midiGrayLight text-xs"
							on:click={() => {
								//removePatch();
							}}>DELETE</button
						>
					</div>
				</div>
			</div>
		</div>
	</div>
</BlueBox>
<div class="flex justify-end mt-12 gap-4">
	<YellowButton text="BACK" action={previousAction} />
	<BlueButton text="MINT NFT" action={nextAction} disabled={!done} />
</div>
