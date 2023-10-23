<script lang="ts">
	export let link: string | undefined = undefined;
	export let type: 'device' | 'tag';

	const bgColor = type === 'device' ? 'bg-black' : 'bg-blue-800';
	const tagClass = `${bgColor} text-white px-2 py-1 flex mr-1 mb-1text-sm`;
</script>

<div class="float-left text-sm">
	{#if link}
		<a class="float-left" href={link}>
			<div class={tagClass}>
				<slot />
			</div>
		</a>
	{:else}
		<div class={tagClass}>
			<slot />
		</div>
	{/if}
</div>
