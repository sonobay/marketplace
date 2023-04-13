import { environment } from '$lib/env';
import type { ListingRow } from '$lib/types/listing-row';

export const load = async () => {
	const { apiEndpoint } = environment;

	const listingsRes = await fetch(`${apiEndpoint}/listings`);
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
