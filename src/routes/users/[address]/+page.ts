import type { LoadEvent } from '@sveltejs/kit';
import { get } from '$lib/api/metadata/ipfs';
import { getDefaultProvider, Contract, BigNumber } from 'ethers';
import { variables } from '$lib/env';
import { addresses } from '$lib/constants/addresses';
import * as midiArtifact from '$lib/data/artifacts/contracts/MIDI.sol/MIDI.json';
import type { UserToken } from '$lib/types/user-token';

export const load = async ({ params }: LoadEvent) => {
	const { address } = params;
	console.log('searching for: ', address);

	const { infuraEndpoint } = variables;
	const midi = new Contract(addresses.midi, midiArtifact.abi, getDefaultProvider(infuraEndpoint));

	const transferFromSingleEvents = await midi.queryFilter(
		midi.filters.TransferSingle(null, address, null, null, null)
	);
	const transferToSingleEvents = await midi.queryFilter(
		midi.filters.TransferSingle(null, null, address, null, null)
	);
	const transferFromBatchEvents = await midi.queryFilter(
		midi.filters.TransferBatch(null, address, null, null, null)
	);
	const transferToBatchEvents = await midi.queryFilter(
		midi.filters.TransferBatch(null, null, address, null, null)
	);

	const allEvents = [
		...transferFromSingleEvents,
		...transferToSingleEvents,
		...transferFromBatchEvents,
		...transferToBatchEvents
	];
	allEvents.sort(
		(a, b) =>
			parseFloat(`${a.blockNumber}.${a.transactionIndex}`) -
			parseFloat(`${b.blockNumber}.${b.transactionIndex}`)
	);

	const balanceMap: { [id: number]: BigNumber } = {};

	for (const event of allEvents) {
		if (!event.args) {
			throw new Error(`No event args found in ${event.transactionHash}`);
		}

		// single NFT received
		if (event.event === 'TransferSingle' && event.args.to === address) {
			const id = BigNumber.from(event.args.id).toNumber();

			if (!balanceMap[event.args.id.toNumber()]) {
				balanceMap[id] = BigNumber.from(0);
			}
			balanceMap[id] = balanceMap[id].add(event.args.value);
		}

		// single NFT sent
		if (event.event === 'TransferSingle' && event.args.from === address) {
			const id = event.args.id.toNumber();
			balanceMap[id] = balanceMap[id].sub(event.args.value);
		}

		// batch NFT received
		if (event.event === 'TransferBatch' && event.args.to === address) {
			for (let i = 0; i < event.args.ids.length; i++) {
				const id = BigNumber.from(event.args.ids[i]).toNumber();

				/**
				 * if balance not present, initialize
				 */
				if (!balanceMap[id]) {
					balanceMap[id] = BigNumber.from(0);
				}
				balanceMap[id] = balanceMap[id].add(event.args[4][i]);
			}
		}

		// batch NFT sent
		if (event.event === 'TransferBatch' && event.args.from === address) {
			for (let i = 0; i < event.args.ids.length; i++) {
				const id = BigNumber.from(event.args.ids[i]).toNumber();
				balanceMap[id] = balanceMap[id].sub(event.args[4][i]);
			}
		}
	}

	const userTokens: UserToken[] = [];
	for (const [key, value] of Object.entries(balanceMap)) {
		userTokens.push({ id: +key, balance: value });
	}

	return { userTokens };
};
