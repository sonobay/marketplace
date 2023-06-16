import { midiContract } from '$lib/utils/midi.contract';
import { signer, signerAddress } from 'svelte-ethers-store';

export const mint = async (formData) => {

    const json = saveMintToDb(formData)
    if(!json) return false;


    /**
     * Mint on Ethereum
     */
    const midi = midiContract($signer);
    const tx = await midi.mint($signerAddress, BigNumber.from(amount), json.metadata, []);

    mintTxSigned = true;

    const receipt = await tx.wait();

    txProcessed = true;

    /**
     * We poll MIDI from our DB to get indexed device data
     */
    pollMIDI(receipt.events[0].args.id);
};

const saveMintToDb = async (formData) => {
    const res = await fetch('api/mint.json', {
        method: 'POST',
        headers: {
            accept: 'application/json'
        },
        body: formData
    });

    if (res.status !== 200) {
        console.error(await res.json());
        return false;
    }

    const json: { metadata: string } = await res.json();
    return json;
}

export const pollMIDI = async (id: number) => {
    pollAttempts += 1;
    if (pollAttempts <= 10) {
        try {
            const { apiEndpoint } = environment;
            const res = await fetch(`${apiEndpoint}/midi/${id}`);
            if (!res.ok) {
                throw new Error(`error fetching ${id}`);
            }
            const midi = (await res.json()) as MIDI;
            createdMidiId = midi.id;
            metadataIndexed = true;
        } catch (error) {
            setTimeout(() => pollMIDI(id), 10 * 1000); // every 10 seconds
        }
    }
};