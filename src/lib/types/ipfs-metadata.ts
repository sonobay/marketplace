import type { IPFSEntry } from './entry';
import type { Device } from './device';

export interface IPFSMetadata {
	name: string;
	description: string;
	image: string;
	properties: {
		entries: IPFSEntry[];
		devices: Device[];
	};
}
