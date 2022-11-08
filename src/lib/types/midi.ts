import type { Device } from './device';
import type { IPFSMetadata } from './ipfs-metadata';

export type MIDI = {
	id: number;
	createdBy: string;
	device: string;
	devices?: Device;
	metadata: IPFSMetadata;
};
