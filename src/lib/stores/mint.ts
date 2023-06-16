import {  writable } from "svelte/store";
import type { MintEntry,IPFSEntry } from "$lib/types/entry";

export const mint = writable({devices: new Array<{name: String, manufacturer: String}>, packName: '', description: '', amountToMint: 0, packTags: new Array<string>, patches: new Array<MintEntry | IPFSEntry>, step: 1}) 