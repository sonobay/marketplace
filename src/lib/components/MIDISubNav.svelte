<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let midiID: number;
	export let active: 'PATCHES' | 'LISTINGS';
	export let createListingDisabled = true;

	const baseClass = 'border-2 mr-4 rounded-lg py-1 px-4';
	const inactiveClass = 'border-amber-500 text-amber-500 hover:bg-amber-100';
	const activeClass = 'bg-amber-500 text-white border-amber-500';

	const listingDisabledClass = 'border-2 border-gray-400 text-gray-400 bg-gray-100 rounded-lg px-4';
	const listingEnabledClass = 'border-2 border-black rounded-lg px-4';

	const dispatch = createEventDispatcher();
</script>

<div class="flex justify-between mb-4">
	<div class="flex">
		<a
			class={`${baseClass} ${active === 'PATCHES' ? activeClass : inactiveClass}`}
			href={`/midi/${midiID}`}>Patches</a
		>
		<a
			class={`${baseClass} ${active === 'LISTINGS' ? activeClass : inactiveClass}`}
			href={`/midi/${midiID}/listings`}>Listings</a
		>
	</div>

	<button
		disabled={createListingDisabled}
		on:click|preventDefault={(_) => {
			if (!createListingDisabled) {
				dispatch('launchCreateListingModal');
			}
		}}
		class={createListingDisabled ? listingDisabledClass : listingEnabledClass}
		>Create Listing</button
	>
</div>
