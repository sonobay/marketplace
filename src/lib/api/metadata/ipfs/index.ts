import { Contract, getDefaultProvider } from 'ethers';
import * as midiArtifact from '$lib/data/artifacts/contracts/midi/MIDI.sol/MIDI.json';
import type { IPFSMetadata } from '$lib/types/ipfs-metadata';
import { environment } from '$lib/env';

export const get = async (id: string) => {
	const { providerEndpoint, midiAddress } = environment;

	const midi = new Contract(midiAddress, midiArtifact.abi, getDefaultProvider(providerEndpoint));
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
