import { environment } from '$lib/env';
import type { Device } from '$lib/types/device';
import type { MIDI } from '$lib/types/midi';
import type { MetaMaskInpageProvider } from '@metamask/providers';

const truncateRegex = /^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/;

export const truncateAddress = (address: string) => {
	const match = address.match(truncateRegex);
	if (!match) return address;
	return match[1] + '\u2026' + match[2];
};

export const isNumber = (n: string) => !isNaN(parseFloat(n));

export const isPositiveInteger = (n: string) => {
	if (!isNumber(n)) {
		return false;
	}
	return +n >>> 0 === parseFloat(n);
};

declare global {
	interface Window {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		//@ts-ignore
		ethereum?: MetaMaskInpageProvider;
	}
}

export const environmentNetwork = () => {
	switch (+environment.networkId) {
		case 1:
			return {
				chainName: 'Mainnet',
				chainId: 1,
				rpcUrls: ['https://mainnet.infura.io/v3/']
			};

		case 11155111:
			return {
				chainName: 'Sepolia',
				chainId: 11155111,
				rpcUrls: ['https://sepolia.infura.io/v3/']
			};

		default:
			console.error(`Unsupported Network: ${+environment.networkId}`);
			break;
	}
};

export const promptSwitchNetwork = async ({
	chainId,
	chainName,
	rpcUrls
}: {
	chainId: number;
	chainName: string;
	rpcUrls: string[];
}) => {
	if (!window?.ethereum) {
		console.error('no window.ethereum found');
		return;
	}

	try {
		await window?.ethereum.request({
			method: 'wallet_switchEthereumChain',
			params: [{ chainId: `0x${chainId}` }]
		});
	} catch (switchError: any) {
		// This error code indicates that the chain has not been added to MetaMask.
		if (switchError?.code === 4902) {
			try {
				await window?.ethereum.request({
					method: 'wallet_addEthereumChain',
					params: [
						{
							chainId: `0x${chainId}`,
							chainName,
							rpcUrls
						}
					]
				});
			} catch (addError) {
				console.error('error adding network: ', addError);
			}
		} else {
			console.error('other switch error: ', switchError);
		}
	}
};

export const loadMIDIData = async (id: string, apiEndpoint: string) => {
	if (!id) {
		throw new Error('No ID found');
	}

	const res = await fetch(`${apiEndpoint}/midi/${id}`);
	if (!res.ok) {
		throw new Error(`error fetching ${id}`);
	}
	const midi = (await res.json()) as MIDI;

	midi.metadata.image = midi.metadata.image.replace('ipfs://', 'https://nftstorage.link/ipfs/');
	midi.metadata.properties.entries = midi.metadata.properties.entries.map((entry) => {
		if (entry.image) {
			entry.image = entry.image?.replace('ipfs://', 'https://nftstorage.link/ipfs/');
		}
		return entry;
	});

	return midi;
};

export const getManufacturersList = (devices: Device[]) => {
	return devices.reduce((manufacturers: string[], device) => {
		if (!manufacturers.includes(device.manufacturer)) {
			manufacturers.push(device.manufacturer);
		}

		return manufacturers;
	}, []);
};

export const clearImageExtensions = (image: string) => {
	return image.replace('.png', '').replace('.jpg', '').replace('.jpeg', '');
};
