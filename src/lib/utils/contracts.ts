import * as midiArtifact from '$lib/data/artifacts/contracts/MIDI.sol/MIDI.json';
import { addresses } from '$lib/constants/addresses';
import { Contract, getDefaultProvider } from 'ethers';
import { variables } from '$lib/env';

export const midiContract = () => {
	const { infuraEndpoint } = variables;
	return new Contract(addresses.midi, midiArtifact.abi, getDefaultProvider(infuraEndpoint));
};
