import { get } from '$lib/api/metadata/ipfs';
import { fetchListed, fetchPrice, fetchSeller, fetchTokenId } from '$lib/utils/listing.contract';
import { fetchBalanceOf, fetchTotalReceived } from '$lib/utils/midi.contract';
import type { LoadEvent } from '@sveltejs/kit';

export const load = async ({ params }: LoadEvent) => {
	const { address } = params;
	if (!address) {
		throw new Error('No ID found');
	}

	const [price, seller, tokenId, listed] = await Promise.all([
		fetchPrice(address),
		fetchSeller(address),
		fetchTokenId(address),
		fetchListed(address)
	]);

	const [availableAmount, totalAmount, ipfsMetadata] = await Promise.all([
		fetchBalanceOf(address, tokenId.toNumber()),
		fetchTotalReceived(address, tokenId.toNumber()),
		get(tokenId.toString())
	]);

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
