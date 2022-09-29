import * as midiArtifact from '$lib/data/artifacts/contracts/midi/MIDI.sol/MIDI.json';
// import * as marketArtifact from '$lib/data/artifacts/contracts/market/Market.sol/Market.json';
import { addresses } from '$lib/constants/addresses';
import { Contract, getDefaultProvider, Signer, utils, BigNumber, constants } from 'ethers';
import { variables } from '$lib/env';

export const midiContract = (signer?: Signer) => {
	const { infuraEndpoint } = variables;
	return new Contract(
		addresses.midi,
		midiArtifact.abi,
		signer ?? getDefaultProvider(infuraEndpoint)
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
