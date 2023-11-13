import type { BigNumber } from 'ethers';

export interface Listing {
	tokenId: BigNumber;
	listing: string;
	price: BigNumber;
	amount: BigNumber;
	user: string;
}

export type AvailableListing = Listing & {
	available: BigNumber;
	listed: boolean;
};
