import type { LoadEvent } from '@sveltejs/kit';
import { variables } from '$lib/env';
import type { Device } from '$lib/types/device';

export const load = async ({ params, fetch }: LoadEvent) => {
	const { apiEndpoint } = variables;
	const { id } = params;
	const res = await fetch(`${apiEndpoint}/devices/${id}`);
	const device = (await res.json()) as Device;

	if (device.midi && device.midi.length > 0) {
		device.midi = device.midi.map((midi) => {
			midi.metadata.image = midi.metadata.image.replace('ipfs://', 'https://nftstorage.link/ipfs/');
			return midi;
		});
	}

	return { device };
};
