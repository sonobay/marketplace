import type { LoadEvent } from '@sveltejs/kit';
import { environment } from '$lib/env';
import type { Device } from '$lib/types/device';

export const load = async ({ params, fetch }: LoadEvent) => {
	const { apiEndpoint } = environment;
	const { id } = params;
	const res = await fetch(`${apiEndpoint}/devices/${id}`);
	const device = (await res.json()) as Device;

	if (device.midi_devices && device.midi_devices.length > 0) {
		device.midi_devices = device.midi_devices.map((midiDevice) => {
			midiDevice.midi.metadata.image = midiDevice.midi.metadata.image.replace(
				'ipfs://',
				'https://nftstorage.link/ipfs/'
			);
			return midiDevice;
		});
	}

	return { device };
};
