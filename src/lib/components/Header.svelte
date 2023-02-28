<script lang="ts">
	import ConnectButtonWrapper from './connect/ConnectButtonWrapper.svelte';
	import DeviceNavButton from './DeviceNavButton.svelte';
	import Logo from './Logo.svelte';
	import { chainId, connected } from 'svelte-ethers-store';
	import { variables } from '$lib/env';
	import { environmentNetwork, getManufacturersList, promptSwitchNetwork } from '$lib/utils';
	import type { Device } from '$lib/types/device';
	import { onMount } from 'svelte';
	import Label from './inputs/Label.svelte';
	export let devices: Device[];

	const manufacturers = devices && devices.length > 0 ? getManufacturersList(devices) : [];
	let selectedManufacturer = manufacturers[0] ?? '';
	let selectedDeviceId: string | undefined;
	let manufacturerDevices: Device[] = [];
	const selectClass = 'rounded-[3px] w-full px-2 py-1.5 bg-white';
	const selectContainerClass =
		'rounded bg-gradient-to-b p-0.5 from-gray-300 to-gray-400 w-full flex mb-1';

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
</script>

{#if $connected && +$chainId !== +variables.networkId}
	<button
		on:click|preventDefault={(_) => switchNetwork()}
		class="w-full bg-orange-500 text-white text-center py-2"
	>
		<b>Switch Network To {correctNetwork?.chainName}</b>
	</button>
{/if}

<header class="container mx-auto py-4 px-4">
	<div>
		<div class="flex justify-between mb-4">
			<div class="flex flex-col">
				<h1>
					<a href="/" class="flex align-items">
						<Logo />
						<div class="ml-2 h-8 flex">
							<img src="/images/sono-bay-logo.png" alt="Sonobay.xyz" />
						</div>
					</a>
				</h1>
			</div>

			<div class="flex">
				<div class="flex items-center text-sm border border-black border-2 rounded-xl px-4">
					<a href="/mint">Mint</a>
				</div>

				<DeviceNavButton />

				<ConnectButtonWrapper />
			</div>
		</div>

		<div class="flex bg-gray-100 py-4 px-8 rounded-lg">
			<div class="flex flex-col mr-4 w-full">
				<Label targetFor={`manufacturer-nav`} text="Manufacturer" />
				<div class={selectContainerClass}>
					<select
						bind:value={selectedManufacturer}
						on:change={(_) => filterManufacturerDevices()}
						id={`manufacturer-nav`}
						name={`manufacturer-nav`}
						class={selectClass}
					>
						{#each manufacturers as manufacturer}
							<option value={manufacturer}>{manufacturer}</option>
						{/each}
					</select>
				</div>
			</div>

			<div class="flex flex-col mr-4 w-full">
				<Label targetFor={`manufacturer-device-nav`} text="Device" />
				<div class={selectContainerClass}>
					<select
						bind:value={selectedDeviceId}
						id={`manufacturer-device-nav`}
						name={`manufacturer-device-nav`}
						class={selectClass}
					>
						{#each manufacturerDevices as device}
							<option value={device.id}>{device.name}</option>
						{/each}
					</select>
				</div>
			</div>

			<div class="mt-5 block">
				<a
					href={`/devices/${selectedDeviceId}`}
					class="bg-midiBlue hover:bg-midiBlueLink text-white h-9 px-4 rounded flex items-center w-36 justify-center"
					>View Packs</a
				>
			</div>
		</div>
	</div>
</header>
