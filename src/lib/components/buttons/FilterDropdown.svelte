<script>
	import { slide, scale } from 'svelte/transition';
	import Filter from '../icons/Filter.svelte';

	import CaretDown from '../icons/CaretDown.svelte';
	import CaretUp from '../icons/CaretUp.svelte';

	export let items = ['recent', 'popular', 'price lowest'];
	export let placeholder = 'dropdown';
	export let action = () => {};

	let showMenu = false;
	let mouseOverMenu = false;
	let selected = [];

	function onSelectMultiple() {
		selected = [];
		let options = document.getElementsByClassName('option');
		for (let i = 0; i < options.length; i++) {
			console.log(options[i]);
			if (options[i].checked) selected.push(options[i].id);
		}
		action(selected);
	}
</script>

<div
	class="relative group w-full text-midiGray"
	on:mouseleave={() => {
		if (mouseOverMenu == false) showMenu = false;
	}}
>
	<button
		on:click={() => {
			showMenu = !showMenu;
		}}
		class="rounded-xl px-3 py-1 border border-midiGrayLight bg-transparent flex flex-row justify-between w-full items-center"
	>
		{placeholder}

		{#if selected.length < 1}
			{#if showMenu}
				<CaretUp color="rgb(127 127 127)" width="16px" height="16px" />
			{:else}
				<CaretDown color="rgb(127 127 127)" width="16px" height="16px" />
			{/if}
		{:else}
			<div in:scale class="rounded-full bg-midiBlue text-white px-2">{selected.length}</div>
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
			<div class=" bg-white  rounded-md py-2 px-2 flex-col flex gap-1 mt-4 shadow-lg ">
				{#each items as item}
					<label class="hover:bg-midiGrayLight/25 pl-2 py-2 rounded-md list-none text-left">
						<input
							type="checkbox"
							class="option mr-1"
							id={item}
							on:click={onSelectMultiple}
							checked={selected.includes(item)}
						/>
						{item}
					</label>
				{/each}
			</div>
		</div>
	{/if}
</div>
