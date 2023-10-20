<script lang="ts">
	import { slide } from 'svelte/transition';
	import CaretDown from '../icons/CaretDown.svelte';
	import CaretUp from '../icons/CaretUp.svelte';
	export let items = ['recent', 'popular', 'price lowest'];
	export let placeholder = 'dropdown';
	export let action = (value: string) => {};

	let showMenu = false;
	let mouseOverMenu = false;

	function onSelect(option: string) {
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
		class="rounded-xl px-3 py-1 border border-charcoal bg-transparent  flex flex-row justify-between w-full items-center"
	>
		{placeholder}

		{#if showMenu}
			<CaretUp color="rgb(65 65 65)" width="14px" height="14px" />
		{:else}
			<CaretDown color="rgb(65 65 65)" width="14px" height="14px" />
		{/if}
	</button>

	{#if showMenu}
		<div
			in:slide|global={{ duration: 50 }}
			out:slide|global={{ duration: 50 }}
			class="absolute w-full z-20"
			on:mouseleave={() => {
				mouseOverMenu = false;
				showMenu = false;
			}}
			on:mouseenter={() => {
				mouseOverMenu = true;
			}}
		>
			<div class="bg-white rounded-md py-2 px-2 flex-col flex gap-1 mt-4 shadow-lg ">
				{#each items as item}
					<button
						class="hover:bg-midiGray/25 pl-2 py-2 rounded-md list-none text-left"
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
