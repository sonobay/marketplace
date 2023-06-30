<script lang="ts">
	import Spinner from '$lib/components/icons/Spinner.svelte';
	import BlueBox from '$lib/components/boxes/BlueBox.svelte';
	import CircleCheck from '$lib/components/icons/CircleCheck.svelte';
	import { signer, signerAddress } from 'svelte-ethers-store';
	import { midiContract } from '$lib/utils/midi.contract';
	import { getNewMint, mint } from '$lib/stores/mint';
	import { onDestroy, onMount } from 'svelte';
	import { BigNumber } from 'ethers';
	import { environment } from '$lib/env';
	import type { MIDI } from '$lib/types/midi';
	import Greenbox from '$lib/components/boxes/Greenbox.svelte';

	let minted: MIDI | null;
	let pollAttempts = 0;

	let metadataUploaded = false;
	let mintTxSigned = false; // this is when metamask is prompted and waiting for feedback to mint
	let metadataIndexed = false;

	onMount(async () => {
		if ($mint.step != 4) return;

		if (!$signer) {
			console.error('not connected');
			return;
		}
		const json = await uploadMetaData();
		if (json == undefined) {
			$mint.step = 3;
			return;
		}
		metadataUploaded = true;
		const receipt = await signMint(json);
		mintTxSigned = true;
		pollMIDI(receipt.events[0].args.id);
	});

	const pollMIDI = async (id: number) => {
		pollAttempts += 1;
		if (pollAttempts <= 10) {
			try {
				const { apiEndpoint } = environment;
				const res = await fetch(`${apiEndpoint}/midi/${id}`);
				if (!res.ok) {
					throw new Error(`error fetching ${id}`);
				}
				minted = (await res.json()) as MIDI;
				metadataIndexed = true;
			} catch (error) {
				setTimeout(() => pollMIDI(id), 10 * 1000); // every 10 seconds
			}
		}
	};

	const uploadMetaData = async () => {
		const formData = new FormData();
		formData.append('name', $mint.packName);
		formData.append('description', $mint.description);
		if ($mint.image != undefined) formData.append('logo', $mint.image);
		formData.append('devices', JSON.stringify($mint.devices));
		formData.append('packTags', JSON.stringify($mint.packTags));
		$mint.patches.forEach((entry, i) => {
			formData.append(`entries[${i}].name`, entry.name);
			formData.append(`entries[${i}].midi`, entry.midi?.toString() ?? '');
			formData.append(`entries[${i}].tags`, JSON.stringify(entry.tags));
			if (entry.image) {
				formData.append(`entries[${i}].image`, entry.image);
			}
		});

		try {
			const res = await fetch('api/mint.json', {
				method: 'POST',
				headers: {
					accept: 'application/json'
				},
				body: formData
			});

			const json: { metadata: string } = await res.json();
			return json;
		} catch (error) {
			console.error(error);
			return;
		}
	};

	const signMint = async (json: { metadata: string }) => {
		const midi = midiContract($signer);
		const tx = await midi.mint(
			$signerAddress,
			BigNumber.from($mint.amountToMint),
			json.metadata,
			[]
		);
		const receipt = await tx.wait();
		return receipt;
	};

	onDestroy(() => {
		$mint = getNewMint();
	});
</script>

{#if metadataIndexed == false}
	<BlueBox>
		<div class="flex flex-col md:flex-row gap-8">
			<img src="/images/pack-example.png" alt="" class="w-full md:w-1/2 h-auto" />
			<div class="flex flex-col justify-between w-full md:w-1/2">
				<div>
					<p class="flex gap-2 mb-6 items-center">
						{#if metadataUploaded}
							<CircleCheck width="28px" height="28px" />
						{:else}
							<CircleCheck width="28px" height="28px" color="#D9D9D9" />
						{/if}Uploading Metadata to IPFS...
					</p>
					<p class="flex gap-2 mb-6  items-center">
						{#if mintTxSigned}
							<CircleCheck width="28px" height="28px" />
						{:else}
							<CircleCheck width="28px" height="28px" color="#D9D9D9" />
						{/if}Waiting for wallet to sign transaction...
					</p>
					<p class="flex gap-2 mb-6 items-center">
						{#if metadataIndexed}
							<CircleCheck width="28px" height="28px" />
						{:else}
							<CircleCheck width="28px" height="28px" color="#D9D9D9" />
						{/if}Metadata indexed on Sonobay...
					</p>
				</div>

				<button
					class="bg-midiBlue py-4 px-6 rounded-3xl text-base lg:text-xl flex gap-4 items-center justify-between text-white"
				>
					MINTING PACK <Spinner width="28px" height="28px" />
				</button>
			</div>
		</div>
	</BlueBox>
{:else}
	<Greenbox>
		<div class="flex flex-col md:flex-row gap-8">
			<img src="/images/pack-example.png" alt="" class="w-full md:w-1/2 h-auto " />
			<div class="flex flex-col justify-between w-full md:w-1/2">
				<div>
					<p class="flex gap-2 mb-6 items-center font-bold">
						<CircleCheck width="28px" height="28px" color="rgb(34 197 94)" /> Mint Successfull!
					</p>
					<p>
						Congratulations on minting an NFT pack of MIDI patches. In order to list your pack for
						sale, please go to the listing page to confirm the sale parameters.
					</p>
				</div>

				<div class="flex flex-col gap-4">
					<a
						href={'/midi/' + minted?.id}
						class="bg-midiYellow text-center py-4 px-6 rounded-3xl text-base lg:text-xl text-white hover:brightness-105"
						>VIEW PACK</a
					>
					<!-- 
					<a
						href="#"
						class="bg-midiBlue text-center py-4 px-6 rounded-3xl text-base lg:text-xl text-white"
					>
						GO TO LISTINGS
					</a>-->
				</div>
			</div>
		</div>
	</Greenbox>
{/if}
