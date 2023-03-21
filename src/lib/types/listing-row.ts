import type { MIDI } from './midi';

export type ListingRow = {
	token_id: number;
	listing_address: string;
	amount: number;
	price: string;
	lister: string;
	midi?: MIDI;
};
