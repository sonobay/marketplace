import type { MIDI } from './midi';

export type Device = {
	created_at: string;
	name: string;
	manufacturer: string;
	id: string;
	imageSrc?: string;
	midi_devices?: {
		id?: number;
		device?: string;
		midi: MIDI;
	}[];
};
