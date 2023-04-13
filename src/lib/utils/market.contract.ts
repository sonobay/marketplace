import * as marketArtifact from '$lib/data/artifacts/contracts/market/Market.sol/Market.json';
import { addresses, MIDI_DEPLOY_BLOCK } from '$lib/constants/addresses';
import { Contract, getDefaultProvider, Signer, utils, BigNumber, constants } from 'ethers';
import { environment } from '$lib/env';
import type { Listing } from '$lib/types/listing';

export const marketContract = (signer?: Signer) => {
	const { providerEndpoint } = environment;
	return new Contract(
		addresses.market,
		marketArtifact.abi,
		signer ?? getDefaultProvider(providerEndpoint)
	);
};

export const createListing = async ({
	tokenId,
	amount,
	price,
	signer
}: {
	tokenId: number;
	amount: number;
	price: number;
	signer: Signer;
}) => {
	const contract = marketContract(signer);
	try {
		const formattedPrice = utils.parseUnits(String(price));

		const res = await contract.createListing(
			BigNumber.from(tokenId),
			BigNumber.from(amount),
			formattedPrice,
			constants.HashZero
		);
		console.log('res is: ', res);
		const tx = await res.wait();
		console.log('tx is: ', tx);
		return true;
	} catch (error) {
		console.log(error);
		return false;
	}
};

export const fetchListingEvents = async (tokenId: number) => {
	const contract = marketContract();
	// const listings = await contract.fetchListingsById(tokenId);
	// console.log('listings are: ', listings);
	// return listings;

	const listingEventsById = await contract.queryFilter(
		contract.filters.ListingCreated(tokenId, null, null, null, null),
		MIDI_DEPLOY_BLOCK
	);
	console.log('listing events by id', listingEventsById);
	const listings: Listing[] = listingEventsById
		.filter((event) => event.args)
		.map((event) => {
			const { tokenId, listing, price, amount, user } = event.args as unknown as Listing;
			return { tokenId, listing, price, amount, user };
		});

	console.log('listings : ', listings);
	return listings;
};
