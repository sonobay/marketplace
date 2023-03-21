import { variables } from '$lib/env';
import type { ListingRow } from '$lib/types/listing-row';
import type { RequestEvent } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

interface GetParams extends Record<string, string> {
	id: string;
}

export const GET = async (event: RequestEvent<GetParams>) => {
	const { apiEndpoint } = variables;

	const deviceId = event.url.searchParams.get('deviceId');
	const userId = event.url.searchParams.get('userId');

	const url = new URL(`${apiEndpoint}/listings`);

	if (deviceId) {
		url.searchParams.append('deviceId', deviceId);
	}

	if (userId) {
		url.searchParams.append('userId', userId);
	}

	const res = await fetch(url);
	let { listings } = (await res.json()) as { listings: ListingRow[] };

	if (listings && listings.length > 0) {
		listings = listings.map((_listing) => {
			if (_listing.midi) {
				_listing.midi.metadata.image = _listing.midi.metadata.image.replace(
					'ipfs://',
					'https://nftstorage.link/ipfs/'
				);
			}

			return _listing;
		});
	}

	return json({ listings });
};
