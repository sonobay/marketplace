import type { LoadEvent } from '@sveltejs/kit';
import { get } from '$lib/api/metadata/ipfs';

export const load = async ({ params }: LoadEvent) => {
	const { id } = params;
	if (!id) {
		throw new Error('No ID found');
	}

	const ipfsMetadata = await get(id);
	return { metadata: ipfsMetadata };
};
