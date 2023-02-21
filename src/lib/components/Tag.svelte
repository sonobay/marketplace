<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import NounClose from './icons/NounClose.svelte';

	export let label: string;
	export let color: 'gray' | 'yellow' = 'gray';

	const bg = color === 'gray' ? 'bg-gray-100' : 'bg-amber-100';
	const textColor = color === 'gray' ? 'text-gray-500' : 'text-amber-500';
	const borderColor = color === 'gray' ? 'border-gray-500' : 'border-amber-500';

	const dispatch = createEventDispatcher();
</script>

<div class={`${bg} ${textColor} ${borderColor} border-2 pl-4 pr-2 py-2 rounded-xl flex mr-2`}>
	<span>#{label}</span>

	<button
		class={`ml-4 ${color === 'gray' ? 'hover:bg-gray-200' : 'hover:bg-amber-200'} rounded pr-1`}
		on:click|preventDefault={(_) => dispatch('remove')}
	>
		<NounClose size={12} color={color === 'gray' ? `rgb(156 163 175)` : `#FF9999`} />
	</button>
</div>
