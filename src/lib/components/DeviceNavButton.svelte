<script lang="ts">
	import CircleCheck from './icons/CircleCheck.svelte';
	import TriangleExclamation from './icons/TriangleExclamation.svelte';

	export let connected: boolean;
</script>

<a href="/config" class="flex items-center text-sm border-black bg-white border-2 relative rounded-3xl px-4">
	<span>DEVICE</span>

	<div class="absolute -top-2 -right-2">
		{#if connected}
			<CircleCheck />
		{:else}
			<TriangleExclamation />
		{/if}
	</div>
</a>
