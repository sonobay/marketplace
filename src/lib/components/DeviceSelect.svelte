<script lang="ts">
	import type { Device } from '$lib/types/device';
	import { getManufacturersList } from '$lib/utils';
	import { createEventDispatcher, onMount } from 'svelte';
	import Button from './Button.svelte';
	import Input from './inputs/Input.svelte';
	import Label from './inputs/Label.svelte';

	export let devices: Device[];

	const manufacturers = devices && devices.length > 0 ? getManufacturersList(devices) : [];

	manufacturers.unshift('-');
	let selectedManufacturer = manufacturers[0] ?? '';
	let selectedDevice = '';
	let manufacturerDevices: Device[] = [];
	let setManufacturerManually = false;
	let setDeviceManually = false;
	const inputContainerClass = 'flex flex-col mb-4';
	const selectClass = 'rounded-[3px] w-full px-2 py-1.5 bg-white';
	const selectContainerClass =
		'rounded bg-gradient-to-b p-0.5 from-gray-300 to-gray-400 w-full flex mb-1';
	const dispatch = createEventDispatcher<{
		addDevice: { manufacturer: string; name: string };
	}>();

	const filterManufacturerDevices = () => {
		manufacturerDevices = devices.filter(
			(device) => device.manufacturer.toUpperCase() === selectedManufacturer.toUpperCase()
		);

		if (manufacturerDevices.length <= 0) {
			manufacturerDevices.push({ manufacturer: '-', name: '-', created_at: '', id: '' });
		}

		selectedDevice = manufacturerDevices.length > 0 ? manufacturerDevices[0].name : '-';
	};

	onMount(() => {
		filterManufacturerDevices();
	});

	const toggleSetManufacturerManually = () => {
		if (setManufacturerManually) {
			setManufacturerManually = false;
			selectedManufacturer = manufacturers[0] ?? '-';

			if (setDeviceManually) {
				toggleSetDeviceManually();
			}
		} else {
			setManufacturerManually = true;
			selectedManufacturer = '';
			selectedDevice = '';
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
		dispatch('addDevice', { manufacturer: selectedManufacturer, name: selectedDevice });

		selectedManufacturer = '-';
		filterManufacturerDevices();
	};
</script>

<div>
	<div class={`${inputContainerClass} mr-4`}>
		<Label targetFor={`manufacturer`} text="Manufacturer" />

		{#if setManufacturerManually}
			<div>
				<div class="mb-1">
					<Input
						id={`manufacturer`}
						name={`manufacturer`}
						bind:value={selectedManufacturer}
						placeholder="Enter Device Manufacturer (i.e Roland)"
					/>
				</div>
				<div class="text-xs">
					<button
						class="text-link underline"
						on:click|preventDefault={(_) => toggleSetManufacturerManually()}>Cancel</button
					>
				</div>
			</div>
		{:else}
			<div>
				<div class={selectContainerClass}>
					<select
						bind:value={selectedManufacturer}
						on:change={(_) => {
							filterManufacturerDevices();
							if (setDeviceManually) {
								toggleSetDeviceManually();
							}
						}}
						id={`manufacturer`}
						name={`manufacturer`}
						class={selectClass}
					>
						{#each manufacturers as manufacturer}
							<option value={manufacturer}>{manufacturer}</option>
						{/each}
					</select>
				</div>

				<div class="text-xs">
					<span>Can't find the manufacturer of your device? </span>
					<button
						class="text-link underline"
						on:click|preventDefault={(_) => toggleSetManufacturerManually()}
						>Add manufacturer</button
					>
				</div>
			</div>
		{/if}
	</div>

	<div class={`${inputContainerClass} mr-4`}>
		<Label targetFor={`device`} text="Device" />

		{#if setDeviceManually}
			<div>
				<div class="mb-1">
					<Input
						id={`device-manual`}
						name={`device-manual`}
						bind:value={selectedDevice}
						placeholder="Enter Device Name (i.e Jupiter 6)"
					/>
				</div>
				{#if !setManufacturerManually}
					<div class="text-xs">
						<button
							class="text-link underline"
							on:click|preventDefault={(_) => toggleSetDeviceManually()}>Cancel</button
						>
					</div>
				{/if}
			</div>
		{:else}
			<div>
				<div class={selectContainerClass}>
					<select bind:value={selectedDevice} id={`device`} name={`device`} class={selectClass}>
						{#each manufacturerDevices as device}
							<option value={device.name}>{device.name}</option>
						{/each}
					</select>
				</div>
				<div class="text-xs">
					<span>Can't find your device? </span>
					<button
						on:click|preventDefault={(_) => toggleSetDeviceManually()}
						class="text-link underline">Add device</button
					>
				</div>
			</div>
		{/if}
	</div>

	<div class="float-left w-32">
		<Button
			disabled={!selectedDevice ||
				selectedDevice === '-' ||
				selectedDevice.length <= 0 ||
				selectedManufacturer.length <= 0 ||
				selectedManufacturer === '-'}
			text="Add Device"
			on:click={(_) => addDevice()}
		/>
	</div>
</div>
