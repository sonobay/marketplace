<script lang="ts">
	import ImageInput from '$lib/components/inputs/ImageInput.svelte';
	import type { MintEntry } from '$lib/types/entry';
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	import { midi } from '$lib/stores/midi';
	import Tag from './Tag.svelte';
	import Input from './inputs/Input.svelte';
	import CircleCheck from './icons/CircleCheck.svelte';
	import TriangleExclamation from './icons/TriangleExclamation.svelte';
	import Button from './Button.svelte';
	import Label from './inputs/Label.svelte';

	const inputContainerClass = 'flex flex-col mb-4';
	let currentTag = '';

	const initEntry = (): MintEntry => ({
		name: '',
		midi: undefined,
		image: undefined,
		tags: []
	});

	let entry: MintEntry = initEntry();

	$: isValid = entry.midi && entry.midi?.length > 0 && entry.name.length > 0;

	const dispatch = createEventDispatcher<{ addEntry: { entry: MintEntry } }>();

	const onTagKeydown = (e: KeyboardEvent) => {
		if (e.code === 'Space' || e.code === 'Enter') {
			/**
			 * disallow multiple of the same tag
			 * UI restrict max of 5 tags per patch
			 */
			if (entry.tags.includes(currentTag) || entry.tags.length >= 5) {
				return;
			}

			entry.tags.push(currentTag);
			currentTag = '';
			entry = entry;
		}
	};

	const onTagInput = () => {
		// remove spaces from pasted text
		currentTag = currentTag.replaceAll(' ', '');
	};

	let unsubscribe;

	onMount(() => {
		unsubscribe = midi.subscribe((store) => {
			if (!store.selectedInput) {
				return;
			}

			store.selectedInput.onmidimessage = (msg) => {
				entry.midi = msg.data;
				entry = entry;
			};
		});
	});

	const submitEntry = () => {
		if (!isValid) {
			return;
		}
		dispatch('addEntry', { entry });
		entry = initEntry();
	};

	const removeTag = (i: number) => {
		entry.tags.splice(i, 1);
		entry = entry;
	};

	onDestroy(unsubscribe);
</script>

<div class="flex">
	<div class="mt-5">
		<ImageInput
			image={entry.image}
			id="entry-image"
			on:imageUpdated={(e) => (entry.image = e.detail.image)}
		/>
	</div>

	<div class="flex flex-col w-full">
		<div class="w-64">
			<div class={inputContainerClass}>
				<Label targetFor="entry-name" text="MIDI Name" />
				<Input name="entry-name" id="entry-name" bind:value={entry.name} required={true} />
			</div>
		</div>

		<div class={inputContainerClass}>
			<div class="w-64">
				<div class="flex items-center">
					<Label targetFor="entry-tags" text="Tags" />
				</div>

				<div class="rounded bg-gradient-to-b p-0.5 from-gray-300 to-gray-400">
					<input
						name="entry-tags"
						bind:value={currentTag}
						class="rounded-[3px] w-full px-2 py-1 bg-white"
						on:keydown={onTagKeydown}
						on:input={() => onTagInput()}
						disabled={entry.tags.length >= 5}
					/>
				</div>
			</div>

			<div>
				<div class="text-xs text-gray-400 font-semibold mb-2 mt-1">
					Add up to 5 tags per MIDI patch
				</div>
				<div class="flex">
					{#each entry.tags as tag, i}
						<Tag label={tag} color="gray" on:remove={() => removeTag(i)} />
					{/each}
				</div>
			</div>
		</div>

		<div class="float-left self-start flex">
			<div class="mr-2">
				<Button on:click={(_) => submitEntry()} text="Add to Pack" disabled={!isValid} />
			</div>

			<div class="flex items-center text-sm border border-black border-2 relative rounded-xl  px-4">
				{#if entry.midi && entry.midi.length > 10}
					<span>MIDI Received</span>
				{:else}
					<span>Awaiting MIDI</span>
				{/if}

				<div class="absolute -top-2 -right-2">
					{#if entry.midi && entry.midi.length > 10}
						<span><CircleCheck /></span>
					{:else}
						<span><TriangleExclamation /></span>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>
