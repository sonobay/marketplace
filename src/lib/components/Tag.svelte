<script lang="ts">
	export let link: string | undefined = undefined;
	export let type: 'device' | 'tag';

	const bgColor = type === 'device' ? 'bg-black' : 'bg-blue-800';
</script>

<div class="float-left">
	{#if link}
		<a class="float-left" href={link}>
			<div class={`${bgColor} text-white px-2 py-1 flex mr-1 text-sm`}>
				<slot />
			</div>
		</a>
	{:else}
		<div class={`${bgColor} text-white px-2 py-1 flex mr-1 text-sm`}>
			<slot />
		</div>
	{/if}
</div>
