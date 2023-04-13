import type { LoadEvent } from '@sveltejs/kit';
import { environment } from '$lib/env';
import { loadMIDIData } from '$lib/utils';

export const load = async ({ params }: LoadEvent) => {
	const { id } = params;
	if (!id) {
		throw new Error('No ID found');
	}

	const { apiEndpoint } = environment;

	const midi = await loadMIDIData(id, apiEndpoint);

	return { midi };
};
