import type {MintEntry} from "$lib/types/entry"

export type Mint = {
    devices:  Array<{name: string, manufacturer: string}>, 
    packName: string, 
    description: string, 
    amountToMint: number, 
    packTags:  Array<string>, 
    image: File |undefined, 
    patches:  Array<MintEntry>, step: number,
    minted: boolean
}
