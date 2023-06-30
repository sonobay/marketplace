<script lang="ts">
	import Dropdown from '$lib/components/buttons/Dropdown.svelte';
	import FilterDropdown from '$lib/components/buttons/FilterDropdown.svelte';
	import type { Device } from '$lib/types/device';
	import { getManufacturersList } from '$lib/utils';
	import { onMount } from 'svelte';

	export let data: { devices: Device[] };
	const { devices } = data;

	interface ManufacturerDevices {
		name: string;
		devices: Device[];
	}

	const manufacturers = devices && devices.length > 0 ? getManufacturersList(devices) : [];

	let manufacturerDevices: ManufacturerDevices[] = [];

	const setManufacturerDevices = () => {
		manufacturerDevices = manufacturers.map((manufacturer) => {
			const _devices = devices.filter(
				(device) => device.manufacturer.toUpperCase() === manufacturer.toUpperCase()
			);
			return { name: manufacturer, devices: _devices };
		});
		console.log('manufacturerDevices are: ', manufacturerDevices);
	};

	onMount(() => {
		setManufacturerDevices();
	});
</script>

<section class="mt-16 md:mt-0 flex flex-col justify-center w-full ">
	<h1 class="mb-8">Browse Devices</h1>
	<div class="grid grid-cols-3 gap-4">
		{#each manufacturerDevices as manufacturer}
			<div>
				<h2>{manufacturer.name}</h2>
				{#each manufacturer.devices as device}
					<div>
						<a
							class="hover:before:scale-x-100 hover:before:origin-left relative before:w-full before:h-[2px] before:origin-right before:transition-transform before:duration-300 before:scale-x-0 before:bg-charcoal before:absolute before:left-0 before:bottom-0"
							href={`/devices/${device.id}`}
						>
							{device.name}
						</a>
					</div>
				{/each}
			</div>
		{/each}
	</div>
</section>
