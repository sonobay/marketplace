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

export const fetchPrice = async (address: string): Promise<BigNumber> => {
	const contract = listingContract(address);
	const price = await contract.price();
	return price;
};

export const fetchSeller = async (address: string): Promise<string> => {
	const contract = listingContract(address);
	const seller = await contract.seller();
	return seller;
};

export const fetchTokenId = async (address: string): Promise<BigNumber> => {
	const contract = listingContract(address);
	const tokenId = await contract.tokenId();
	return tokenId;
};

export const fetchListed = async (address: string): Promise<boolean> => {
	const contract = listingContract(address);
	const listed = await contract.listed();
	return listed;
};

export const cancelListing = async (address: string, signer: Signer) => {
	try {
		const contract = listingContract(address, signer);
		const res = await contract.cancelListing();
		await res.wait();
		return true;
	} catch (error) {
		console.error(error);
		return false;
	}
};

export const withdraw = async (address: string, signer: Signer) => {
	try {
		const contract = listingContract(address, signer);
		const res = await contract.withdraw();
		await res.await();
		return true;
	} catch (error) {
		console.error(error);
	}
};
