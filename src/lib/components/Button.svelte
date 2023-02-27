<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Spinner from './Spinner.svelte';

	export let text: string;
	export let disabled = false;
	export let loading = false;
	const dispatch = createEventDispatcher();

	const baseClass =
		'flex items-center font-medium rounded-xl text-sm py-2.5 text-center w-full justify-center';

	$: btnClass = loading
		? `${baseClass} pr-5 pl-1 text-white bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:focus:ring-blue-800`
		: disabled
		? `${baseClass} px-5 text-gray-500 bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 border-2 border-gray-200 focus:z-10`
		: `${baseClass} px-5 text-white bg-midiBlue hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300`;
</script>

<button
	class={btnClass}
	disabled={disabled || loading}
	type="button"
	on:click|preventDefault={(_) => dispatch('click')}
>
	{#if loading}
		<Spinner size={16} />
	{/if}
	<span>{text}</span>
</button>
