import * as listingArtifact from '$lib/data/artifacts/contracts/listing/Listing.sol/Listing.json';
import { Contract, getDefaultProvider, Signer, BigNumber } from 'ethers';
import { variables } from '$lib/env';

export const listingContract = (address: string, signer?: Signer) => {
	const { infuraEndpoint } = variables;
	return new Contract(address, listingArtifact.abi, signer ?? getDefaultProvider(infuraEndpoint));
};

export const buyItems = async ({
	amount,
	address,
	signer,
	price
}: {
	amount: number;
	address: string;
	signer: Signer;
	price: BigNumber;
}) => {
	try {
		const contract = listingContract(address, signer);
		const userAddress = await signer.getAddress();
		await contract.buyItems(amount, { value: price.mul(amount), from: userAddress });
		return true;
	} catch (error) {
		console.log('error buying items: ', error);
		return false;
	}
};

// export const price = async (address: string) => {
//   const contract = listingContract(address)

// }
