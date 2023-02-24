import type { LoadEvent } from '@sveltejs/kit';
import { get } from '$lib/api/metadata/ipfs';
import { getDefaultProvider, Contract, BigNumber } from 'ethers';
import { variables } from '$lib/env';
import { addresses, MIDI_DEPLOY_BLOCK } from '$lib/constants/addresses';
import * as midiArtifact from '$lib/data/artifacts/contracts/midi/MIDI.sol/MIDI.json';
import type { UserToken } from '$lib/types/user-token';
import type { IPFSMetadata } from '$lib/types/ipfs-metadata';

const getMetadata = async ({
	userTokens,
	page,
	limit
}: {
	userTokens: UserToken[];
	page: number;
	limit: number;
}) => {
	let metadatas: { metadata: IPFSMetadata; id: number }[] = [];
	const map = new Map<number, IPFSMetadata>();

	if (page * limit <= userTokens.length) {
		const promises = [];

		for (let i = page * limit; i < page * limit + limit; i++) {
			if (userTokens[i]) {
				promises.push(
					new Promise<{ id: number; metadata: IPFSMetadata }>((resolve) => {
						get(String(userTokens[i].id)).then((ipfs) => {
							resolve({ metadata: ipfs, id: userTokens[i].id });
						});
					})
				);
			}
		}

		metadatas = await Promise.all(promises);

		for (const metadata of metadatas) {
			map.set(metadata.id, metadata.metadata);
		}
	}

	return map;
};

export const load = async ({ params }: LoadEvent) => {
	const { address } = params;

	const { infuraEndpoint } = variables;
	const midi = new Contract(addresses.midi, midiArtifact.abi, getDefaultProvider(infuraEndpoint));

	const transferFromSingleEvents = await midi.queryFilter(
		midi.filters.TransferSingle(null, address, null, null, null),
		MIDI_DEPLOY_BLOCK
	);
	const transferToSingleEvents = await midi.queryFilter(
		midi.filters.TransferSingle(null, null, address, null, null),
		MIDI_DEPLOY_BLOCK
	);
	const transferFromBatchEvents = await midi.queryFilter(
		midi.filters.TransferBatch(null, address, null, null, null),
		MIDI_DEPLOY_BLOCK
	);
	const transferToBatchEvents = await midi.queryFilter(
		midi.filters.TransferBatch(null, null, address, null, null),
		MIDI_DEPLOY_BLOCK
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
	userTokens.reverse();

	const ipfs = await getMetadata({ userTokens, page: 0, limit: 12 });

	return { userTokens, ipfs };
};
