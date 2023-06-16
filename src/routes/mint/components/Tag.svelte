<script lang="ts">
	import XMark from '$lib/components/icons/XMark.svelte';
	export let text = '';
	export let action = (value: string) => {};
</script>

<p
	class="rounded-3xl bg-midiBlue py-[0.3rem] px-4 flex items-center justify-between text-white text-xs md:text-sm"
>
	{text}
	<button on:click={() => action(text)} aria-label={'remove tag ' + text} class="ml-4 "
		><XMark color="rgb(255 255 255)" width="12px" height="12px" /></button
	>
</p>
