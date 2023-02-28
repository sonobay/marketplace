import { variables } from '$lib/env';
import type { Device } from '$lib/types/device';
import type { RequestEvent } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

interface GetParams extends Record<string, string> {
	id: string;
}

export const GET = async (event: RequestEvent<GetParams>) => {
	const params = event.params;

	const { apiEndpoint } = variables;
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

	return json({ device });
};
