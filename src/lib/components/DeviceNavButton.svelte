<script lang="ts">
	import CircleCheck from './icons/CircleCheck.svelte';
	import TriangleExclamation from './icons/TriangleExclamation.svelte';

	export let connected: boolean;
</script>

<a href="/config" class="flex items-center text-sm border-black border-2 relative rounded-xl px-4">
	<span>DEVICE</span>

	<div class="absolute -top-2 -right-2">
		{#if connected}
			<div class="bg-white rounded-full"><CircleCheck /></div>
		{:else}
			<span><TriangleExclamation /></span>
		{/if}
	</div>
</a>
