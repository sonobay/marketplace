<script lang="ts">
	export let placeholder = 'Placeholder';
	export let onInputAction = (value: string) => {};
	export let value = '';
</script>

<textarea
	bind:value
	rows="4"
	class="rounded-xl border border-midiGrayLight  bg-transparent px-3 py-1 focus:outline-none w-full overflow-hidden"
	{placeholder}
	on:input={() => {
		onInputAction(value);
	}}
/>
