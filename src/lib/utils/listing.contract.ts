import * as listingArtifact from '$lib/data/artifacts/contracts/listing/Listing.sol/Listing.json';
import { Contract, getDefaultProvider, Signer, BigNumber, providers } from 'ethers';
import { environment } from '$lib/env';

export const listingContract = async (address: string, signer?: Signer) => {
	const { providerEndpoint } = environment;
	console.log('provider endpoint: ', providerEndpoint);
	console.log('trimmed endpoint: ', providerEndpoint.trim());
	console.log('address: ', address);
	console.log('signer: ', signer);

	console.log('entire env is: ', environment);
	console.log('listingArtifact.abi is: ', listingArtifact.abi);

	try {
		return new Contract(
			address,
			listingArtifact.abi,
			signer ?? getDefaultProvider(providerEndpoint)
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
	console.log('fetching price');
	const contract = await listingContract(address);
	console.log('fetchPrice contract initialized');
	console.log('contract.address is: ', contract.address);
	const _prov = contract.provider;
	console.log('network is: ', await _prov.getNetwork());
	const price = await contract.price();
	console.log('price to return is: ', price.toString());
	return price;
};

export const fetchSeller = async (address: string): Promise<string> => {
	console.log('fetching seller');
	const contract = await listingContract(address);
	console.log('fetchSeller contract initialized');
	const seller = await contract.seller();
	console.log('seller is: ', seller);
	return seller;
};

export const fetchTokenId = async (address: string): Promise<BigNumber> => {
	console.log('fetching tokenId');
	const contract = await listingContract(address);
	console.log('fetchTokenId contract initialized');
	const tokenId = await contract.tokenId();
	console.log('tokenId is: ', tokenId.toString());
	return tokenId;
};

export const fetchListed = async (address: string): Promise<boolean> => {
	console.log('fetching listed');
	const contract = await listingContract(address);
	console.log('fetchListed contract initialized');
	const listed = await contract.listed();
	console.log('listed is: ', listed);
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
