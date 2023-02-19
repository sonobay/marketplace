<script lang="ts">
	import NounCheckbox from './icons/NounCheckbox.svelte';

	export let completed: boolean;
	export let text: string;
</script>

<div class="flex items-center">
	<div>
		{#if completed}
			<NounCheckbox isChecked={true} />
		{:else}
			<NounCheckbox isChecked={false} />
		{/if}
	</div>

	<span class="text-sm font-bold">{text}</span>
</div>
