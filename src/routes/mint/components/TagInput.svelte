<script lang="ts">
	export let placeholder = 'Placeholder';
	export let action = (value: string) => {};
	let tag = '';

	function setTag() {
		action(tag);
		tag = '';
	}
</script>

<div class="relative">
	<input
		maxlength="14"
		minlength="1"
		bind:value={tag}
		on:keydown={(e) => {
			if (e.key == 'Enter') setTag();
		}}
		class="rounded-xl border border-midiGrayLight bg-transparent px-3 py-1 focus:outline-none w-full"
		{placeholder}
	/>
	<button
		on:click={setTag}
		class="absolute right-4 top-0 bottom-0 m-auto w-6 h-6 flex items-center justify-center bg-midiGrayLight text-white rounded-md"
	>
		+
	</button>
</div>
