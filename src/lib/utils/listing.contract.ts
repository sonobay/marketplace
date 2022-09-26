import * as listingArtifact from '$lib/data/artifacts/contracts/listing/Listing.sol/Listing.json';
import { Contract, getDefaultProvider, Signer } from 'ethers';
import { variables } from '$lib/env';

export const listingContract = (address: string, signer?: Signer) => {
	const { infuraEndpoint } = variables;
	return new Contract(address, listingArtifact.abi, signer ?? getDefaultProvider(infuraEndpoint));
};

// export const price = async (address: string) => {
//   const contract = listingContract(address)

// }
