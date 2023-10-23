<script lang="ts">
	import type { Device } from '$lib/types/device';
	import { getManufacturersList } from '$lib/utils';
	import BlueButton from '$lib/components/buttons/BlueButton.svelte';
	import BlueBox from '$lib/components/boxes/BlueBox.svelte';
	import Input from '$lib/components/inputs/Input.svelte';
	import Dropdown from '$lib/components/buttons/Dropdown.svelte';
	import YellowButton from '$lib/components/buttons/YellowButton.svelte';
	import { mint } from '$lib/stores/mint';
	import XMark from '$lib/components/icons/XMark.svelte';
	import { fade } from 'svelte/transition';
	export let nextAction = () => {};
	export let devices: Device[];
	const manufacturers = devices && devices.length > 0 ? getManufacturersList(devices) : [];

	$: done = $mint.devices.length > 0;

	let selectedManufacturer: string | undefined;
	let selectedDevice: string | undefined;
	let manufacturerDevices: Device[] = [];
	let setManufacturerManually = false;
	let setDeviceManually = false;

	const filterManufacturerDevices = () => {
		if (!selectedManufacturer) return;

		manufacturerDevices = devices.filter(
			(device) => device.manufacturer.toUpperCase() === selectedManufacturer?.toUpperCase()
		);

		if (!manufacturerDevices[0]) return;

		selectedDevice = manufacturerDevices[0].name;
	};

	const toggleSetManufacturerManually = () => {
		if (setManufacturerManually) {
			setManufacturerManually = false;

			if (!manufacturers[0]) return;

			selectedManufacturer = manufacturers[0];

			if (setDeviceManually) {
				toggleSetDeviceManually();
			}
		} else {
			setManufacturerManually = true;
			selectedManufacturer = undefined;
			selectedDevice = undefined;
			manufacturerDevices = [];

			if (!setDeviceManually) {
				toggleSetDeviceManually();
			}
		}
	};

	const toggleSetDeviceManually = () => {
		if (setDeviceManually) {
			setDeviceManually = false;
			filterManufacturerDevices();
		} else {
			setDeviceManually = true;
			selectedDevice = '';
		}
	};

	const addDevice = () => {
		if (!selectedManufacturer || !selectedDevice) return;
		$mint.devices.push({ manufacturer: selectedManufacturer, name: selectedDevice });
		$mint.devices = $mint.devices;
		selectedManufacturer = undefined;
		selectedDevice = undefined;
	};
	const removeDevice = (device: { name: String; manufacturer: String }) => {
		$mint.devices = $mint.devices.filter((d) => d != device);
	};
</script>

<div in:fade|global class="min-h-[365px]">
	<BlueBox>
		{#if setManufacturerManually}
			<div class="lg:flex items-start justify-start mb-6">
				<p class="lg:mr-3 lg:w-1/6 lg:text-right">Manufacturer</p>
				<div class="w-full lg:w-80">
					<Input
						value={selectedManufacturer ? selectedManufacturer : ''}
						placeholder="Enter Device Manufacturer (i.e Roland)"
						max={40}
						onInputAction={(value) => {
							selectedManufacturer = value;
						}}
					/>
					<div class="text-xs">
						<button
							class="text-link underline"
							on:click|preventDefault={(_) => toggleSetManufacturerManually()}>Cancel</button
						>
					</div>
				</div>
			</div>
		{:else}
			<div class="lg:flex items-start justify-start mb-6">
				<p class="lg:mr-3 lg:w-1/6 lg:text-right">Manufacturer</p>
				<div class="w-full lg:w-80">
					<Dropdown
						items={manufacturers}
						placeholder={selectedManufacturer ? selectedManufacturer : 'Choose...'}
						action={(value) => {
							selectedManufacturer = value;
							filterManufacturerDevices();
							if (setDeviceManually) {
								toggleSetDeviceManually();
							}
						}}
					/>
					<div class="text-xs">
						<span>Can't find the manufacturer of your device? </span>
						<button
							class="text-link underline"
							on:click|preventDefault={(_) => toggleSetManufacturerManually()}>Add</button
						>
					</div>
				</div>
			</div>
		{/if}

		{#if setDeviceManually}
			<div class="lg:flex items-start justify-start">
				<p class="lg:mr-3 lg:w-1/6 lg:text-right">Model</p>
				<div class="w-full lg:w-80">
					<Input
						value={selectedDevice ? selectedDevice : ''}
						placeholder="Enter Device Name (i.e Jupiter 6)"
						max={40}
						onInputAction={(value) => {
							selectedDevice = value;
						}}
					/>
					{#if !setManufacturerManually}
						<div class="text-xs">
							<button
								class="text-link underline"
								on:click|preventDefault={(_) => toggleSetDeviceManually()}>Cancel</button
							>
						</div>
					{/if}
				</div>
			</div>
		{:else}
			<div class="lg:flex items-start justify-start">
				<p class="lg:mr-3 lg:w-1/6 lg:text-right">Model</p>
				<div class="w-full lg:w-80">
					<Dropdown
						items={manufacturerDevices.map((m) => m.name)}
						placeholder={selectedDevice ? selectedDevice : 'Choose...'}
						action={(value) => {
							selectedDevice = value;
						}}
					/>
					<div class="text-xs">
						<span>Can't find your device? </span>
						<button
							on:click|preventDefault={(_) => toggleSetDeviceManually()}
							class="text-link underline">Add</button
						>
					</div>
				</div>
			</div>
		{/if}

		<div class="flex justify-start mt-8">
			<div class="lg:mr-3 lg:w-1/6" />
			<YellowButton action={addDevice}>
				<span>Add Device</span>
			</YellowButton>
		</div>

		<div class="flex justify-start mt-8">
			<div class="lg:mr-3 lg:w-1/6" />
			<div class="grid grid-cols md:grid-cols-2 gap-2">
				{#each $mint.devices as device}
					<div class="rounded-3xl text-white  bg-midiBlue py-2 px-4 justify-between flex gap-2">
						<p>
							{device.manufacturer}: {device.name}
						</p>
						<button
							on:click={() => {
								removeDevice(device);
							}}
						>
							<XMark color="#FFFF" />
						</button>
					</div>
				{/each}
			</div>
		</div>
	</BlueBox>
</div>
<div class="flex justify-end">
	<BlueButton action={nextAction} disabled={!done}>
		<span class="uppercase">Next</span>
	</BlueButton>
</div>
