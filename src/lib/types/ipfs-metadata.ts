export interface Entry {
	name: string;
	midi: Uint8Array;
	image: string | undefined;
}

export interface IPFSMetadata {
	name: string;
	description: string;
	image: string;
	properties: {
		entries: Entry[];
	};
}
