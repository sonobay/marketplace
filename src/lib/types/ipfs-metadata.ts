import type { Entry } from './entry';

export interface IPFSMetadata {
	name: string;
	description: string;
	image: string;
	properties: {
		entries: Entry[];
	};
}
