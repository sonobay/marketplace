import type { Device } from './device';
import type { IPFSMetadata } from './ipfs-metadata';

export type MIDI = {
	id: number;
	createdBy: string;
	metadata: IPFSMetadata;
	totalSupply: number;
	midi_devices: {
		id?: number;
		device: Device;
	}[];
};
