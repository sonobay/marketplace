export interface IPFSMetadata {
	name: string;
	description: string;
	image: string;
	properties: {
		entries: {
			name: string;
			midi: Uint8Array;
			image: string | undefined;
		}[];
	};
}
