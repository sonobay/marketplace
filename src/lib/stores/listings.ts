import type { AvailableListing, Listing } from '$lib/types/listing';
import { fetchListed } from '$lib/utils/listing.contract';
import { fetchListingEvents } from '$lib/utils/market.contract';
import { fetchBalanceOf } from '$lib/utils/midi.contract';
import type { BigNumber } from 'ethers';
import { writable } from 'svelte/store';

const createListingsStore = () => {
	const { subscribe, set } = writable<{
		listings: AvailableListing[];
		loading: boolean;
	}>({ listings: [], loading: false });
	let currentPackId: number | undefined;

	const fetchListings = async (packId: number) => {
		if (currentPackId === packId) {
			return;
		}

		set({ listings: [], loading: true });

		const listings = await fetchListingEvents(packId);
		const availableListings = await Promise.all(
			listings.map(async (listing) => {
				return {
					...listing,
					available: await _fetchAvailableAmount(listing),
					listed: await _fetchListed(listing)
				};
			})
		);

		set({ listings: availableListings, loading: false });
	};

	/**
	 * Fetches the available amount of a listing
	 * @param listing
	 * @returns
	 */
	const _fetchAvailableAmount = async (listing: Listing): Promise<BigNumber> => {
		return await fetchBalanceOf(listing.listing, listing.tokenId.toNumber());
	};

	/**
	 * Fetches whether or not the listing has been canceled
	 * @param listing
	 * @returns
	 */
	const _fetchListed = async (listing: Listing) => {
		return await fetchListed(listing.listing);
	};

	return { subscribe, fetchListings };
};

export const listingsStore = createListingsStore();
