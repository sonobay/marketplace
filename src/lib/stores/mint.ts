import {  writable } from "svelte/store";
import type { MintEntry } from "$lib/types/entry";
import type { Mint } from "$lib/types/mint";

export const mint = writable<Mint>(getNewMint())

export function getNewMint() : Mint {
   return {devices:  new Array<{name: '', manufacturer: ''}>, packName: '', description: '', amountToMint: 1, packTags:  new Array<string>, image: undefined , patches:  new Array<MintEntry>, step: 1, minted: false}
}