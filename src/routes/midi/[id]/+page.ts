import type { LoadEvent } from '@sveltejs/kit';
import { variables } from '$lib/env';
import type { MIDI } from '$lib/types/midi';

export const load = async ({ params }: LoadEvent) => {
	const { id } = params;
	if (!id) {
		throw new Error('No ID found');
	}

	const { apiEndpoint } = variables;

	const res = await fetch(`${apiEndpoint}/midi/${id}`);
	if (!res.ok) {
		throw new Error(`error fetching ${id}`);
	}
	const midi = (await res.json()) as MIDI;

	midi.metadata.image = midi.metadata.image.replace('ipfs://', 'https://nftstorage.link/ipfs/');
	midi.metadata.properties.entries = midi.metadata.properties.entries.map((entry) => {
		if (entry.image) {
			entry.image = entry.image?.replace('ipfs://', 'https://nftstorage.link/ipfs/');
		}
		return entry;
	});

	return { midi };
};
