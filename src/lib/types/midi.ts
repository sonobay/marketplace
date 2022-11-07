import type { IPFSMetadata } from './ipfs-metadata';

export type MIDI = {
	id: number;
	createdBy: string;
	device: string;
	metadata: IPFSMetadata;
};
