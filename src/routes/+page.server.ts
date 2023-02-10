// TODO this seems unused

// import type { LoadInput, LoadOutput } from '@sveltejs/kit';
import { addresses } from '$lib/constants/addresses';
import type { LoadEvent } from '@sveltejs/kit';
// import * as midiArtifact from '$lib/data/artifacts/contracts/MIDI.sol/MIDI.json';

export const load = async ({ params, data }: LoadEvent) => {
	// const { INFURA_ENDPOINT } = process.env;
	// const midi = new Contract(addresses.midi, midiArtifact.abi, getDefaultProvider(INFURA_ENDPOINT));

	// const totalSupply = await midi.totalSupply();
	// console.log('total supply is: ', totalSupply);

	return { metadata: '' };
};
