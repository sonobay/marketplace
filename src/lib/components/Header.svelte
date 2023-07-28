<script lang="ts">
	import { slide } from 'svelte/transition';
	import ConnectButtonWrapper from './connect/ConnectButtonWrapper.svelte';
	import DeviceNavButton from './DeviceNavButton.svelte';
	import { chainId, connected } from 'svelte-ethers-store';
	import { environment } from '$lib/env';
	import { environmentNetwork, getManufacturersList, promptSwitchNetwork } from '$lib/utils';
	import type { Device } from '$lib/types/device';
	import { onMount } from 'svelte';
	import { midi } from '$lib/stores/midi';
	import XMark from './icons/XMark.svelte';
	import Filter from './icons/Filter.svelte';
	import { onDestroy } from 'svelte';
	import {headerCSS} from '$lib/stores/header.js';

	export let devices: Device[];

	let openMenu = false;
	const manufacturers = devices && devices.length > 0 ? getManufacturersList(devices) : [];
	let selectedManufacturer = manufacturers[0] ?? '';
	let selectedDeviceId: string | undefined;
	let manufacturerDevices: Device[] = [];

	const filterManufacturerDevices = () => {
		manufacturerDevices = devices.filter(
			(device) => device.manufacturer.toUpperCase() === selectedManufacturer.toUpperCase()
		);

		if (manufacturerDevices.length <= 0) {
			manufacturerDevices.push({ manufacturer: '-', name: '-', created_at: '', id: '' });
		}

		selectedDeviceId = manufacturerDevices.length > 0 ? manufacturerDevices[0].id : undefined;
	};

	onMount(() => {
		filterManufacturerDevices();
	});

	const correctNetwork = environmentNetwork();

	const switchNetwork = () => {
		correctNetwork;
		if (!correctNetwork) {
			return;
		}
		promptSwitchNetwork(correctNetwork);
	};

	let deviceConnected: boolean;

	const unsubscribe = midi.subscribe((store) => {
		deviceConnected = store.selectedInput != undefined && store.selectedOutput != undefined;
	});

	onDestroy(unsubscribe);
</script>

{#if $connected && +$chainId !== +environment.networkId}
	<button
		on:click|preventDefault={(_) => switchNetwork()}
		class="w-full bg-orange-500 text-white text-center py-2"
	>
		<b>Switch Network To {correctNetwork?.chainName}</b>
	</button>
{/if}

<header>
	<nav class="hidden md:flex justify-center py-4 px-4 absolute top-0 w-full z-20" aria-label="Main navigation">
		<div class="flex justify-between container">
				<a href="/" class="flex items-center">
					<img src="/images/Logo.png" alt="Sonobay.xyz" class="h-8 ml-2" />
				</a>
			<div class="flex gap-4">
				<div class="flex items-center">
					<a
						class={"text-sm hover:before:scale-x-100 hover:before:origin-left relative before:w-full before:h-[2px] before:origin-right before:transition-transform before:duration-300 before:scale-x-0 before:absolute before:left-0 before:bottom-0 " + $headerCSS}
						href="/mint">CREATE</a
					>
				</div>
					<div class="flex items-center">
						<a
							class={"flex items-center text-sm hover:before:scale-x-100 hover:before:origin-left relative before:w-full before:h-[2px] before:origin-right before:transition-transform before:duration-300 before:scale-x-0  before:absolute before:left-0 before:bottom-0 " + $headerCSS}
							href="/devices">MARKET</a
						>
					</div>
				<DeviceNavButton connected={deviceConnected} />
				<ConnectButtonWrapper />
			</div>
		</div>
	</nav>

	<nav class="flex md:hidden fixed top-0 w-full z-20" aria-label="Main navigation">
		<div class="flex flex-col md:hidden w-full ">
			<div class="flex justify-between w-full bg-midiYellow px-4 h-16 items-center">
				<a href="/" class="flex align-items justify-center">
					<div class="ml-2 h-8 flex">
						<img src="/images/sono-bay-logo.png" alt="Sonobay.xyz" />
					</div>
				</a>
				<button
					aria-label="Toggle menu"
					on:click={() => {
						openMenu = !openMenu;
					}}
				>
					{#if openMenu}
						<XMark width="24px" height="24px" color="#414141" />
					{:else}
						<Filter />
					{/if}
				</button>
			</div>
			{#if openMenu}
				<div
					in:slide={{ duration: 300 }}
					out:slide={{ duration: 300 }}
					class="w-full py-8 flex flex-col gap-4 bg-midiYellow px-4"
				>
					<a href="#">CREATE</a>
					<a href="#">MARKET</a>
					<a href="#">DEVICE</a>
					<a href="">CONNECT WALLET</a>
				</div>
			{/if}
		</div>
	</nav>
</header>
