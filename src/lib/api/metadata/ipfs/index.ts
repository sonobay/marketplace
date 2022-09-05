import { addresses } from '$lib/constants/addresses';
import { Contract, getDefaultProvider } from 'ethers';
import * as midiArtifact from '$lib/data/artifacts/contracts/MIDI.sol/MIDI.json';
import 'dotenv/config';
import type { IPFSMetadata } from '$lib/types/ipfs-metadata';

export const get = async (id: string) => {
	const { INFURA_ENDPOINT } = process.env;
	const midi = new Contract(addresses.midi, midiArtifact.abi, getDefaultProvider(INFURA_ENDPOINT));
	let uri: string = await midi.uri(id);
	uri = uri.replace('ipfs://', 'https://nftstorage.link/ipfs/');
	const res = await fetch(`${uri}`);
	const metadata = (await res.json()) as IPFSMetadata;

	metadata.image = metadata.image.replace('ipfs://', 'https://nftstorage.link/ipfs/');
	metadata.properties.entries = metadata.properties.entries.map((entry) => {
		if (entry.image) {
			entry.image = entry.image?.replace('ipfs://', 'https://nftstorage.link/ipfs/');
		}
		return entry;
	});

	return metadata;
};
