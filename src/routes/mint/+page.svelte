<script lang="ts">
	import { signer, signerAddress } from 'svelte-ethers-store';
	import ImageInput from '$lib/components/inputs/ImageInput.svelte';
	import type { MintEntry } from '$lib/types/entry';
	import AddEntry from '$lib/components/AddEntry.svelte';
	import { BigNumber } from 'ethers';
	import { isPositiveInteger } from '$lib/utils';
	import { midiContract } from '$lib/utils/midi.contract';
	import Dialog from '$lib/components/Dialog.svelte';
	import Button from '$lib/components/Button.svelte';
	import { environment } from '$lib/env';
	import type { MIDI } from '$lib/types/midi';
	import MintStep from '$lib/components/MintStep.svelte';
	import Input from '$lib/components/inputs/Input.svelte';
	import TextArea from '$lib/components/inputs/TextArea.svelte';
	import type { Device } from '$lib/types/device';
	import DeviceSelect from '$lib/components/DeviceSelect.svelte';
	import Label from '$lib/components/inputs/Label.svelte';
	import DialogProgressCheckbox from '$lib/components/DialogProgressCheckbox.svelte';
	import Pack from '$lib/components/Pack.svelte';
	import NounClose from '$lib/components/icons/NounClose.svelte';
	import PatchTable from '$lib/components/PatchTable.svelte';

	let name = '';
	let description = '';
	let image: FileList | undefined;
	export let data: { devices: Device[] };
	const { devices } = data;

	let collectionDevices: { name: Readonly<string>; manufacturer: Readonly<string> }[] = [];

	let amount: string;
	let dialogVisible = false;
	let mintProcessing = false;
	let pollAttempts = 0;
	let createdMidiId: number;

	let metadataUploaded = false;
	let mintTxSigned = false; // this is when metamask is prompted and waiting for feedback to mint
	let txProcessed = false;
	let metadataIndexed = false;

	const inputContainerClass = 'flex flex-col mb-4';

	let entries: MintEntry[] = [];
	const addEntry = (entry: MintEntry) => {
		entries = [...entries, entry];
	};

	const removeEntry = (index: number) => {
		entries.splice(index, 1);
		entries = entries;
	};

	$: isValid =
		signer &&
		collectionDevices.length > 0 &&
		name.length > 0 &&
		image &&
		image.length > 0 &&
		entries.length > 0 &&
		isPositiveInteger(amount);

	const handleSubmit = async () => {
		if (!$signer) {
			console.error('not connected');
			return;
		}

		if (!image || (image && image.length <= 0)) {
			console.error('image required');
			return;
		}

		mintProcessing = true;

		const formData = new FormData();

		formData.append('name', name);
		formData.append('description', description);
		formData.append('logo', image[0]);
		formData.append('devices', JSON.stringify(collectionDevices));

		entries.forEach((entry, i) => {
			formData.append(`entries[${i}].name`, entry.name);
			formData.append(`entries[${i}].midi`, entry.midi?.toString() ?? '');
			formData.append(`entries[${i}].tags`, JSON.stringify(entry.tags));
			if (entry.image) {
				formData.append(`entries[${i}].image`, entry.image[0]);
			}
		});

		const res = await fetch('api/mint.json', {
			method: 'POST',
			headers: {
				accept: 'application/json'
			},
			body: formData
		});

		console.log('res', res);

		const json: { metadata: string } = await res.json();

		if (res.status !== 200) {
			console.error(res.json());
			txProcessed = false;
			return;
		}

		metadataUploaded = true;

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

	const pollMIDI = async (id: number) => {
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

	const addDevice = ({ name, manufacturer }: { name: string; manufacturer: string }) => {
		collectionDevices.push({
			name,
			manufacturer
		});
		collectionDevices = collectionDevices;
	};

	const removeDevice = (index: number) => {
		collectionDevices.splice(index, 1);
		collectionDevices = collectionDevices;
	};
</script>

<div>
	<div class="text-center mb-8">
		<h2 class="text-4xl mb-1 text-charcoal font-semibold">Start Minting Now</h2>
		<span class="text-gray-400"
			>Follow the MIDI.link workflow below to build <br /> your catalogue of MIDI NFTs.</span
		>
	</div>

	<div>
		<MintStep
			stepNumber={1}
			instruction="Select MIDI Devices"
			toolTipText="Users have the option to include any additional devices which are also compatible with the original production device."
		/>

		<div class="mb-12 flex flex-col">
			<DeviceSelect {devices} on:addDevice={(_device) => addDevice(_device.detail)} />

			<div class="flex mt-4">
				{#if collectionDevices.length <= 0}
					<div
						class="rounded-xl bg-amber-100 text-amber-500 border-2 border-amber-500 text-center w-full py-8"
					>
						Add device
					</div>
				{:else}
					<div class="flex">
						{#each collectionDevices as _device, i}
							<div
								class="bg-amber-100 text-amber-500 border-2 border-amber-500 pl-4 pr-2 py-2 rounded-xl flex mr-2"
							>
								<span>{_device.manufacturer}: {_device.name}</span>
								<button
									class="ml-4 hover:bg-amber-200 rounded pr-1"
									on:click|preventDefault={(e) => removeDevice(i)}
								>
									<NounClose size={12} color="#FF9999" />
								</button>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</div>

		<MintStep stepNumber={2} instruction="Create Collection" />

		<div class="mb-12">
			<div class="flex">
				<div class="mt-5">
					<ImageInput {image} id="logo" on:imageUpdated={(e) => (image = e.detail.image)} />
				</div>

				<div class="flex flex-col w-full">
					<div class="flex">
						<div class={`${inputContainerClass} mr-4`}>
							<Label targetFor="collectionName" text="Collection Name" />
							<Input id="collectionName" name="collectionName" required={true} bind:value={name} />
						</div>

						<div class={inputContainerClass}>
							<Label targetFor="amount" text="# To Mint" />
							<Input type="number" id="amount" name="amount" bind:value={amount} required={true} />
						</div>
					</div>

					<div class={inputContainerClass}>
						<Label targetFor="description" text="Description" />
						<TextArea id="description" name="description" bind:value={description} />
					</div>
				</div>
			</div>
		</div>

		<MintStep stepNumber={3} instruction="Add MIDI to your collection" />

		<div class="mb-12">
			<AddEntry on:addEntry={(e) => addEntry(e.detail.entry)} />
		</div>

		<div class="mb-4">
			<PatchTable {entries} on:removeEntry={(e) => removeEntry(e.detail.index)} isEditable={true} />
		</div>

		<button
			class={isValid
				? 'bg-midiYellow border-midiYellow border-2 text-black rounded-xl py-2 px-4 uppercase text-sm'
				: 'bg-gray-100 border-gray-400 border-2 text-gray-400 rounded-xl py-2 px-4 uppercase text-sm'}
			on:click={(_) => (dialogVisible = true)}
			disabled={!isValid}>Mint Pack</button
		>
	</div>
</div>

<!-- modal -->
<Dialog id="mint-modal" visible={dialogVisible} on:close={() => (dialogVisible = false)}>
	<!-- Modal body -->
	<div class="p-6 space-y-6">
		<div class="flex">
			<div class="w-1/2">
				<Pack
					image={image ? URL.createObjectURL(image[0]) : undefined}
					{name}
					numberMinted={+amount}
					{entries}
				/>
			</div>

			<div class="w-1/2 flex flex-col justify-between">
				<div>
					<div class="mb-4">
						<DialogProgressCheckbox
							text="Uploading Metadata to IPFS"
							completed={metadataUploaded}
						/>
					</div>
					<div class="mb-4">
						<DialogProgressCheckbox
							text="Waiting for wallet to sign transaction"
							completed={mintTxSigned}
						/>
					</div>
					<div class="mb-4">
						<DialogProgressCheckbox text="Transaction processed onchain" completed={txProcessed} />
					</div>
					<div class="mb-4">
						<DialogProgressCheckbox
							text="Metadata indexed on Sonobay"
							completed={metadataIndexed}
						/>
					</div>
				</div>

				<div class="flex w-full rounded-b pl-2">
					{#if createdMidiId}
						<div
							class="flex items-center font-medium rounded-xl text-sm py-2.5 text-center w-full justify-center px-5 text-white bg-green-500"
						>
							<a href={`/midi/${createdMidiId}`}>🎉 View NFT 🎉</a>
						</div>
					{:else}
						<Button
							on:click={(_) => handleSubmit()}
							text="Mint NFT MIDI Pack"
							loading={mintProcessing}
							disabled={mintProcessing}
						/>
					{/if}
				</div>
			</div>
		</div>
	</div>
</Dialog>
