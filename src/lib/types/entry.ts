export interface Entry {
	name: string;
	midi: Uint8Array | undefined;
	image: FileList | undefined;
	tags: string[];
}
