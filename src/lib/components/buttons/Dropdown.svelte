<script>
	import { slide } from 'svelte/transition';
	import CaretDown from '../icons/CaretDown.svelte';
	import CaretUp from '../icons/CaretUp.svelte';
	export let items = ['recent', 'popular', 'price lowest'];
	export let placeholder = 'dropdown';
	export let action = () => {};

	let showMenu = false;
	let mouseOverMenu = false;

	function onSelect(option) {
		placeholder = option;
		showMenu = false;
		action(option);
	}
</script>

<div
	class="relative group w-full"
	on:mouseleave={() => {
		if (mouseOverMenu == false) showMenu = false;
	}}
>
	<button
		on:click={() => {
			showMenu = !showMenu;
		}}
		class="rounded-2xl px-3 py-1 border-2 border-midiGray bg-white text-midiGray flex flex-row justify-between w-full items-center"
	>
		{placeholder}

		{#if showMenu}
			<CaretUp color="rgb(0 0 0 / 0.3)" width="16px" height="16px" />
		{:else}
			<CaretDown color="rgb(0 0 0 / 0.3)" width="16px" height="16px" />
		{/if}
	</button>

	{#if showMenu}
		<div
			in:slide={{ duration: 50 }}
			out:slide={{ duration: 50 }}
			class="absolute w-full"
			on:mouseleave={() => {
				mouseOverMenu = false;
				showMenu = false;
			}}
			on:mouseenter={() => {
				mouseOverMenu = true;
			}}
		>
			<div
				class=" bg-white text-midiGray  rounded-md py-2 px-2 flex-col flex gap-1 mt-4 shadow-lg "
			>
				{#each items as item}
					<button
						class="hover:bg-midiGrayLight pl-2 py-2 rounded-md list-none text-left"
						on:click={() => {
							onSelect(item);
						}}
					>
						{item}
					</button>
				{/each}
			</div>
		</div>
	{/if}
</div>
