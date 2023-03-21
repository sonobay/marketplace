import type { LoadEvent } from '@sveltejs/kit';
import { variables } from '$lib/env';
import type { Device } from '$lib/types/device';
import type { ListingRow } from '$lib/types/listing-row';

export const load = async ({ params, fetch }: LoadEvent) => {
	const { apiEndpoint } = variables;
	const { id } = params;
	const res = await fetch(`${apiEndpoint}/devices/${id}`);
	const device = (await res.json()) as Device;

	const listingsRes = await fetch(`${apiEndpoint}/listings?deviceId=${id}`);
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

	return { device, listings };
};
