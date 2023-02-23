import type { IPFSEntry } from './entry';

export interface IPFSMetadata {
	name: string;
	description: string;
	image: string;
	properties: {
		entries: IPFSEntry[];
	};
}
