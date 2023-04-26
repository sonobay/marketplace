<script lang="ts">
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

<div>
	<h2 class="text-2xl font-bold mb-8">Browse Devices</h2>

	<div class="grid grid-cols-3 gap-4">
		{#each manufacturerDevices as manufacturer}
			<div class="flex flex-col">
				<span class="font-bold underline">{manufacturer.name}</span>

				{#each manufacturer.devices as device}
					<div>
						<a class="hover:bg-emerald-500 hover:text-white" href={`/devices/${device.id}`}>
							<span>{device.name}</span>
						</a>
					</div>
				{/each}
			</div>
		{/each}
	</div>
</div>
