import { addresses } from '$lib/constants/addresses';
import type { LoadEvent } from '@sveltejs/kit';
import { Contract, getDefaultProvider, BigNumber } from 'ethers';
import * as midiArtifact from '$lib/data/artifacts/contracts/MIDI.sol/MIDI.json';
import 'dotenv/config';

export interface Metadata {
	name: string;
	description: string;
	image: string;
	properties: {
		entries: {
			name: string;
			midi: Uint8Array;
			image: string | undefined;
		}[];
	};
}

export const load = async ({ params }: LoadEvent) => {
	const { INFURA_ENDPOINT } = process.env;
	const midi = new Contract(addresses.midi, midiArtifact.abi, getDefaultProvider(INFURA_ENDPOINT));
	const { id } = params;
	let uri: string = await midi.uri(BigNumber.from(id));
	uri = uri.replace('ipfs://', 'https://ipfs.io/ipfs/');
	const res = await fetch(`${uri}`);
	const metadata = (await res.json()) as Metadata;
	console.log('metadata is: ', metadata);

	metadata.image = metadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/');

	return { metadata };
};
