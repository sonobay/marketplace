<script lang="ts">
	import ImageRegular from './icons/ImageRegular.svelte';
	export let size: number;
	export let path: string | undefined;
	export let alt: string;
</script>

<div
	style:width={`${size}px`}
	style:height={`${size}px`}
	class={`mr-4 rounded-full bg-gray-200 flex overflow-hidden shadow`}
>
	<div class="flex align-items w-full">
		{#if path}
			<img class="w-full" src={path} {alt} />
		{:else}
			<div class="float-left w-full rounded-full px-4 py-2 flex justify-center items-center">
				<ImageRegular size={size > 128 ? 48 : 24} color="rgb(156 163 175)" />
			</div>
		{/if}
	</div>
</div>
