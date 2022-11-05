import type { IPFSMetadata } from './ipfs-metadata';

export type Device = {
	created_at: string;
	name: string;
	manufacturer: string;
	id: string;
	imageSrc?: string;
	midi?: {
		createdBy: string;
		device: string;
		id: number;
		metadata: IPFSMetadata;
	}[];
};
