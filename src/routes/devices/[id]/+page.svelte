<script lang="ts">
	import Pack from '$lib/components/Pack.svelte';
	import type { Device } from '$lib/types/device';
	import { page } from '$app/stores';
	import { onDestroy } from 'svelte';

	export let data: { device: Device };

	let { device } = data;
	let deviceId = device.id;

	const unsubscribe = page.subscribe((_page) => {
		console.log('something happened here!!!!');
		console.log('val is: ', _page);
		const { id } = _page.params;
		console.log('id is: ', id);

		if (id !== deviceId) {
			fetchDevice(id);
		}
	});

	const fetchDevice = async (id: string) => {
		console.log('fetch device!');

		const res = await fetch(`/api/fetchDevice/${id}.json`, {
			headers: {
				accept: 'application/json'
			}
		});

		console.log('res is: ', res);
		const json = (await res.json()) as { device: Device };
		device = json.device;
		deviceId = device.id;
	};

	onDestroy(unsubscribe);
</script>

<div>
	<h2 class="font-bold text-2xl mb-2">{device.manufacturer} {device.name}</h2>

	{#if device.midi_devices}
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 gap-y-8">
			{#each device.midi_devices as midiDevice}
				<a href={`/midi/${midiDevice.midi.id}`}>
					<Pack
						image={midiDevice.midi.metadata.image}
						name={midiDevice.midi.metadata.name}
						entries={midiDevice.midi.metadata.properties.entries}
						numberMinted={0}
					/>
				</a>
			{/each}
		</div>
	{/if}
</div>
