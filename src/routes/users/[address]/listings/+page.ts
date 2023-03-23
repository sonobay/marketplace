import type { LoadEvent } from '@sveltejs/kit';
import { variables } from '$lib/env';
import type { ListingRow } from '$lib/types/listing-row';

export const load = async ({ params, fetch }: LoadEvent) => {
	const { apiEndpoint } = variables;
	const { address } = params;

	const listingsRes = await fetch(`${apiEndpoint}/listings?userId=${address}`);
	let { listings } = (await listingsRes.json()) as { listings: ListingRow[] };

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

	return { listings };
};
