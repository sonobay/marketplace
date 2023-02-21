<script lang="ts">
	import { createEventDispatcher } from 'svelte';

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
		<!-- credit for spinner https://mynaui.com/spinner/ -->
		<div class="flex">
			<div aria-label="Loading..." role="status">
				<svg class="h-4 w-4 animate-spin stroke-white" viewBox="0 0 256 256">
					<line
						x1="128"
						y1="32"
						x2="128"
						y2="64"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="24"
					/>
					<line
						x1="195.9"
						y1="60.1"
						x2="173.3"
						y2="82.7"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="24"
					/>
					<line
						x1="224"
						y1="128"
						x2="192"
						y2="128"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="24"
					/>
					<line
						x1="195.9"
						y1="195.9"
						x2="173.3"
						y2="173.3"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="24"
					/>
					<line
						x1="128"
						y1="224"
						x2="128"
						y2="192"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="24"
					/>
					<line
						x1="60.1"
						y1="195.9"
						x2="82.7"
						y2="173.3"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="24"
					/>
					<line
						x1="32"
						y1="128"
						x2="64"
						y2="128"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="24"
					/>
					<line
						x1="60.1"
						y1="60.1"
						x2="82.7"
						y2="82.7"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="24"
					/>
				</svg>
			</div>
		</div>
	{/if}
	<span>{text}</span>
</button>
