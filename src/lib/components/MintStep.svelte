<script lang="ts">
	import NounInfo from './icons/NounInfo.svelte.svelte';

	export let stepNumber: number;
	export let instruction: string;
	export let toolTipText: string | undefined = undefined;

	let toolTipDisplayed = false;

	const toggleToolTip = () => {
		toolTipDisplayed = !toolTipDisplayed;
	};
</script>

<div class="flex items-center font-bold mb-2">
	<span class="text-midiBlue text-sm mr-2">Step {stepNumber}</span>

	<span class="text-charcoal">{instruction}</span>

	{#if toolTipText}
		<div class="relative ml-2">
			<div on:mouseenter={(_) => toggleToolTip()} on:mouseleave={(_) => toggleToolTip()}>
				<NounInfo size={16} />
			</div>

			{#if toolTipDisplayed}
				<div
					role="tooltip"
					class="absolute w-64 left-5 -top-8 z-10 inline-block px-3 py-2 text-sm font-medium text-gray-400 bg-gray-100 border-gray-400 border-2 rounded-lg shadow-sm"
				>
					{toolTipText}
				</div>
			{/if}
		</div>
	{/if}
</div>
