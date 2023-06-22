import * as listingArtifact from '$lib/data/artifacts/contracts/listing/Listing.sol/Listing.json';
import { Contract, getDefaultProvider, Signer, BigNumber, providers } from 'ethers';
import { environment } from '$lib/env';

export const listingContract = async (address: string, signer?: Signer) => {
	const { providerEndpoint } = environment;
	console.log('provider endpoint: ', providerEndpoint);

	// if (!signer) {
	// 	const defaultProvider = getDefaultProvider(providerEndpoint);

	// 	defaultProvider.on('error', (error) => {
	// 		console.error(error);
	// 	});

	// 	await defaultProvider.ready;
	// }

	const provider = new providers.JsonRpcProvider(providerEndpoint);
	await provider.ready;

	try {
		return new Contract(
			address,
			listingArtifact.abi,
			signer ?? new providers.JsonRpcProvider(providerEndpoint)
		);
	} catch (error) {
		console.log('error is: ', error?.toString());
		throw new Error(error?.toString());
	}
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
		const contract = await listingContract(address, signer);
		const userAddress = await signer.getAddress();
		const res = await contract.buyItems(amount, userAddress, { value: price.mul(amount) });
		await res.wait();
		return true;
	} catch (error) {
		console.log('error buying items: ', error);
		return false;
	}
};

export const fetchPrice = async (address: string): Promise<BigNumber> => {
	const contract = await listingContract(address);
	const price = await contract.price();
	return price;
};

export const fetchSeller = async (address: string): Promise<string> => {
	const contract = await listingContract(address);
	const seller = await contract.seller();
	return seller;
};

export const fetchTokenId = async (address: string): Promise<BigNumber> => {
	const contract = await listingContract(address);
	const tokenId = await contract.tokenId();
	return tokenId;
};

export const fetchListed = async (address: string): Promise<boolean> => {
	const contract = await listingContract(address);
	const listed = await contract.listed();
	return listed;
};

export const cancelListing = async (address: string, signer: Signer) => {
	try {
		const contract = await listingContract(address, signer);
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
		const contract = await listingContract(address, signer);
		const res = await contract.withdraw();
		await res.wait();
		return true;
	} catch (error) {
		console.error(error);
	}
};
