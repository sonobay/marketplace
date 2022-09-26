import type { LoadEvent } from '@sveltejs/kit';
import { get } from '$lib/api/metadata/ipfs';
// import { fetchListings } from '$lib/utils/market.contract';

export const load = async ({ params }: LoadEvent) => {
	const { id } = params;
	if (!id) {
		throw new Error('No ID found');
	}

	const ipfsMetadata = await get(id);

	return { metadata: ipfsMetadata };
};
