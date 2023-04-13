import * as midiArtifact from '$lib/data/artifacts/contracts/midi/MIDI.sol/MIDI.json';
import { addresses, MIDI_DEPLOY_BLOCK } from '$lib/constants/addresses';
import { Contract, getDefaultProvider, Signer, BigNumber } from 'ethers';
import { environment } from '$lib/env';

export const midiContract = (signer?: Signer) => {
	const { providerEndpoint } = environment;
	return new Contract(
		addresses.midi,
		midiArtifact.abi,
		signer ?? getDefaultProvider(providerEndpoint)
	);
};

export const isApprovedForAll = async ({
	account,
	operator
}: {
	account: string;
	operator: string;
}) => {
	const contract = midiContract();
	const isApproved: boolean = await contract.isApprovedForAll(account, operator);
	return isApproved;
};

export const setApprovalForAll = async ({
	operator,
	approved,
	signer
}: {
	operator: string;
	approved: boolean;
	signer?: Signer;
}) => {
	try {
		const contract = midiContract(signer);
		const res = await contract.setApprovalForAll(operator, approved);
		await res.wait();
		return approved;
	} catch (error) {
		return false;
	}
};

export const fetchBalanceOf = async (address: string, tokenId: number): Promise<BigNumber> => {
	const contract = midiContract();
	const balance = await contract.balanceOf(address, tokenId);
	return balance;
};

export const fetchTotalReceived = async (address: string, tokenId: number): Promise<BigNumber> => {
	const contract = midiContract();

	const transferToSingleEvents = await contract.queryFilter(
		contract.filters.TransferSingle(null, null, address, null, null),
		MIDI_DEPLOY_BLOCK
	);

	/**
	 * Only searching single because batch tokens should not be sent to Listing contract
	 */
	const balance = transferToSingleEvents.reduce((_balance, _event) => {
		if (_event.args?.id?.toNumber() === tokenId) {
			_balance = _balance.add(_event.args?.value);
		}

		return _balance;
	}, BigNumber.from(0));

	return balance;
};

/** Fetch total supply by id */
export const fetchTotalSupply = async (tokenId: number): Promise<BigNumber> => {
	const contract = midiContract();
	const totalSupply = await contract.totalSupply(tokenId);
	return totalSupply;
};
