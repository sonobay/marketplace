import { error, type LoadEvent } from '@sveltejs/kit';
import { environment } from '$lib/env';
import type { Device } from '$lib/types/device';
import type { MIDI } from '$lib/types/midi';

export const load = async ({ params, fetch, url }: LoadEvent) => {
	const { apiEndpoint } = environment;
	const { id } = params;
	const query = url.searchParams.get('query');

	if (!id) {
		throw error(404, 'Device not found');
	}

	if (!query) {
		throw error(404, 'Query not found');
	}

	const queryUrl = new URL(`${apiEndpoint}/midi`);
	const queryUrlParams = new URLSearchParams();
	queryUrlParams.append('deviceId', id);
	queryUrlParams.append('search', query);
	queryUrl.search = queryUrlParams.toString();

	const fetchDevice = fetch(`${apiEndpoint}/devices/${id}`);
	const fetchMidi = fetch(queryUrl);

	const [deviceRes, midiRes] = await Promise.all([fetchDevice, fetchMidi]);
	const device = (await deviceRes.json()) as Device;
	let midi = (await midiRes.json()) as MIDI[];

	if (midi?.length > 0) {
		midi = midi.map((_midi) => {
			_midi.metadata.image = _midi.metadata.image.replace(
				'ipfs://',
				'https://nftstorage.link/ipfs/'
			);
			return _midi;
		});
	}

	return { query, midi, device };
};
