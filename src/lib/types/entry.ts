type Entry = {
	name: string;
	midi: Uint8Array | undefined;
	// image: FileList | undefined;
	tags: string[];
};

export type MintEntry = Entry & {
	// name: string;
	// midi: Uint8Array | undefined;
	image: File | undefined;
	// tags: string[];
};

export type IPFSEntry = Entry & {
	image: string | undefined;
};
