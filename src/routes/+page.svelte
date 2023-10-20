<script lang="ts">
	import Pack from '$lib/components/Pack.svelte';
	import type { Device } from '$lib/types/device';
	import CaretRight from '$lib/components/icons/CaretRight.svelte';
	import CaretLeft from '$lib/components/icons/CaretLeft.svelte';
	import type { ListingRow } from '$lib/types/listing-row';
	import { onMount } from 'svelte';
	import {headerCSS} from '$lib/stores/header.js';
	import { fade } from 'svelte/transition';
	import Footer from '$lib/components/Footer.svelte';
	import BlueLink from '$lib/components/buttons/BlueLink.svelte';

	let scrollContainer: HTMLDivElement;
	let innerWidth: number;
	let showLeftScroll = false;
	let showRightScroll = true;

	function scrollRight() {
		let maxScrollLeft = scrollContainer.scrollWidth - scrollContainer.clientWidth;
		scrollContainer.scrollLeft += innerWidth / 2;
		if (scrollContainer.scrollLeft >= maxScrollLeft - 100) showRightScroll = false;
		showLeftScroll = true;
	}
	function scrollLeft() {
		scrollContainer.scrollLeft -= innerWidth / 2;
		if (scrollContainer.scrollLeft == 0) showLeftScroll = false;
		showRightScroll = true;
	}

	export let data: { listings: ListingRow[]; devices: Device[] };

	let { listings } = data;

	onMount(()=> {
		$headerCSS = "text-white before:bg-white";
	})

</script>

<svelte:window bind:innerWidth />

<section class="py-32 bg-frontpage pb-16 flex justify-center px-4" aria-labelledby="frontpage-header">
	<div class="container flex flex-col md:flex-row justify-center items-center gap-8 md:gap-0">
		<div class="w-full text-center md:text-left md:w-1/2 flex flex-col justify-center gap-4">
			<h1 class="text-white text-5xl" id="frontpage-header">Create something completley new</h1>
			<p class="text-midiYellowLight">Connect your synthesizer to build NFT packs and explore new sounds to grow your collection</p>
			<div>
				<BlueLink href="/config" text="CONNECT"></BlueLink>
			</div>	
		</div>
		<img class="w-full md:w-1/2" src="/images/frontpage/frontpage-image.webp" alt="">
	</div>
</section>

<section class="flex justify-center py-32 px-4" aria-labelledby="packs-header">
	<div class="container flex flex-col md:flex-row justify-center items-center gap-8 md:gap-4">
		<div class="flex flex-col gap-4 w-full md:w-[60%] text-center md:text-left items-center md:items-start">
			<h1 class="text-5xl" id="packs-header">Find packs compatible with your synthesizer</h1>
			<img class="w-64" src="/images/frontpage/model.webp" alt="Dropdown list of synthesizer models">
			<img class="w-64" src="/images/frontpage/manufacturer.webp" alt="Dropdown list of synthesizer manufacturers">
		</div>
		<img class="w-full md:w-96" src="/images/frontpage/packs.webp" alt="NFT Packs">
	</div>
</section>


<section class="flex justify-center py-32 px-4 bg-grayLight" aria-labelledby="marketplace-header">
	<div class="container flex flex-col md:flex-row justify-center items-center gap-8 lg:gap-20">
		<img class="w-full md:w-96" src="/images/frontpage/laptop.webp" alt="Sonobay marketplace">
		<div class="flex flex-col gap-4 w-full md:w-[60%] text-center md:text-left items-center md:items-start">
			<h1 class="text-5xl" id="marketplace-header">List your creations on the marketplace</h1>
			<p>Once your device is connected, youre ready to upload your original sounds and start selling</p>
			<div>
				<BlueLink href="/mint" text="CREATE PACK"></BlueLink>
			</div>	
		</div>
	</div>
</section>

<section class="flex justify-center pt-32 px-4 bg-midiYellowLight overflow-y-hidden" aria-labelledby="leaderboard-header">
	<div class="container flex flex-col lg:flex-row gap-4">
		<div class="w-full text-center lg:text-left lg:w-[60%] flex flex-col gap-4 pb-32">
			<h1 class="text-5xl" id="leaderboard-header">Top the charts on the Sono bay leaderboard</h1>
			<p>Users smashing sells and building massive collections are rewarded with goodies + cred</p>
			<div>
				<BlueLink href="/leaderboard" text="LEADERBOARD"></BlueLink>
			</div>	
		</div>
		<div class="hidden lg:flex w-[40%] relative">
			<img class="w-full absolute bottom-0 object-cover" src="/images/frontpage/leaderboard.webp" alt="Sonobay leaderboard">
		</div>
	</div>
</section>

<section class="py-32 flex flex-col items-center gap-6 px-4" aria-labelledby="drops-header">
		<div class="container text-center lg:text-left">
			<h1 class="text-5xl" id="drops-header">Check the latest MIDI pack drops</h1>
		</div>
		<div class="relative w-full">
			<div
				bind:this={scrollContainer}
				class="flex flex-row gap-8 overflow-x-scroll lg:no-scrollbar pb-6 scroll-smooth"
				style="-webkit-overflow-scrolling: auto;"
			>
				{#each listings as listing}
					<div class="flex justify-center">
						<div class="h-72 w-72 lg:h-80 lg:w-80">
							<Pack
							{listing}
							/>
						</div>
					</div>
				{/each}
			</div>
			{#if showLeftScroll && listings.length > 4}
				<div class="hidden absolute top-0 bottom-6 left-2  m-auto lg:flex items-center z-10">
					<button
						aria-label="Scroll left"
						in:fade|global
						out:fade|global
						on:click={scrollLeft}
						class="bg-gray-50 border border-white hover:cursor-pointer rounded-full p-2 sm:p-4 shadow-md hover:shadow-lg "
					>
					<CaretLeft></CaretLeft>
					</button>
				</div>
			{/if}
			{#if showRightScroll && listings.length > 4}
				<div
					class="hidden absolute top-0 bottom-6 right-2 m-auto lg:flex items-center justify-end z-10"
				>
					<button
						aria-label="Scroll right"
						in:fade|global
						out:fade|global
						on:click={scrollRight}
						class="bg-gray-50 border border-white hover:cursor-pointer rounded-full p-2 sm:p-4 shadow-md hover:shadow-lg "
					>
						<CaretRight></CaretRight>
					</button>
				</div>
			{/if}
		</div>
</section>

<Footer></Footer>