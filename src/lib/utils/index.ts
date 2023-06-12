import { environment } from '$lib/env';
import type { Device } from '$lib/types/device';
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

		case 80001:
			return {
				chainName: 'Polygon Mumbai',
				chainId: 80001,
				rpcUrls: ['https://polygon-mumbai.infura.io/v3/']
			};

		case 137:
			return {
				chainName: 'Polygon',
				chainId: 137,
				rpcUrls: ['https://polygon-mainnet.infura.io/v3/']
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

export const envChainId = (): 1 | 11155111 | 80001 | 137 => {
	switch (+environment.networkId) {
		case 1:
			return 1;

		case 11155111:
			return 11155111;

		case 80001:
			return 80001;

		case 137:
			return 137;

		default:
			return 1;
	}
};

export const etherscanBaseUrl = (chainId: number) => {
	switch (chainId) {
		case 1:
			return 'https://etherscan.io';

		case 11155111:
			return 'https://sepolia.etherscan.io';

		case 137:
			return 'https://polygonscan.com';

		case 80001:
			return 'https://mumbai.polygonscan.com';
	}
};
