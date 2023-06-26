import { get } from '$lib/api/metadata/ipfs';
import { fetchListed, fetchPrice, fetchSeller, fetchTokenId } from '$lib/utils/listing.contract';
import { fetchBalanceOf, fetchTotalReceived } from '$lib/utils/midi.contract';
import type { LoadEvent } from '@sveltejs/kit';

export const load = async ({ params }: LoadEvent) => {
	const { address } = params;
	if (!address) {
		throw new Error('No ID found');
	}

	console.log('listing address: ', address);

	const [price, seller, tokenId, listed] = await Promise.all([
		fetchPrice(address),
		fetchSeller(address),
		fetchTokenId(address),
		fetchListed(address)
	]);

	console.log('listing contract info successfully fetched');
	console.log('fetching midi info');

	// const price = await fetchPrice(address);
	// console.log('price is: ', price);
	// const seller = await fetchSeller(address);
	// console.log('seller is: ', seller);
	// const tokenId = await fetchTokenId(address);
	// console.log('tokenId is: ', tokenId);
	// const listed = await fetchListed(address);
	// console.log('listed is: ', listed);

	// const availableAmount = await fetchBalanceOf(address, tokenId.toNumber());
	// console.log('availableAmount is: ', availableAmount.toString());

	// const totalAmount = await fetchTotalReceived(address, tokenId.toNumber());
	// console.log('totalAmount is: ', totalAmount.toString());

	// const ipfsMetadata = await get(tokenId.toString());
	// console.log('ipfsMetadata is: ', ipfsMetadata);

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
