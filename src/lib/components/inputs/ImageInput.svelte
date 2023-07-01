<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	export let image: File | undefined;
	export let id: string;

	let files: FileList | undefined;

	const dispatch = createEventDispatcher<{ imageUpdated: { files: FileList | undefined } }>();
</script>

<label class="cursor-pointer flex flex-col justify-center gap-2" for={id}>
	{#if image}
		<div class="w-24 h-24">
			<img
				class="w-full h-full object-cover rounded-xl"
				src={URL.createObjectURL(image)}
				alt="Entry Logo"
			/>
		</div>
	{:else}
		<div class="p-2 bg-white rounded-xl w-24 h-24">
			<img src="./placeholderImage.png" alt="placeholder" />
		</div>
	{/if}
	<div class="bg-charcoal px-4 py-1 text-white rounded-2xl text-xs">Add image</div>
	<input
		name={id}
		{id}
		type="file"
		class="hidden"
		bind:files
		on:change={(e) => dispatch('imageUpdated', { files })}
	/>
</label>
