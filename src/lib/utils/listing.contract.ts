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
		const res = await contract.buyItems(amount, { value: price.mul(amount), from: userAddress });
		await res.wait();
		return true;
	} catch (error) {
		console.log('error buying items: ', error);
		return false;
	}
};

export const fetchAvailableAmount = async (address: string): Promise<BigNumber> => {
	const contract = listingContract(address);
	const availableAmount = await contract.availableAmount();
	return availableAmount;
};

// export const price = async (address: string) => {
//   const contract = listingContract(address)

// }
