import { get } from '$lib/api/metadata/ipfs';
import {
	fetchAvailableAmount,
	fetchListed,
	fetchPrice,
	fetchSeller,
	fetchTokenId,
	fetchTotalAmount
} from '$lib/utils/listing.contract';
import type { LoadEvent } from '@sveltejs/kit';

export const load = async ({ params }: LoadEvent) => {
	const { address } = params;
	if (!address) {
		throw new Error('No ID found');
	}

	const [availableAmount, totalAmount, price, seller, tokenId, listed] = await Promise.all([
		fetchAvailableAmount(address),
		fetchTotalAmount(address),
		fetchPrice(address),
		fetchSeller(address),
		fetchTokenId(address),
		fetchListed(address)
	]);

	const ipfsMetadata = await get(tokenId.toString());

	return {
		availableAmount,
		totalAmount,
		price,
		seller,
		tokenId,
		listed,
		ipfsMetadata
	};
};
