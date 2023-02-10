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
		ethereum?: MetaMaskInpageProvider;
	}
}

export const promptSwitchNetwork = async ({
	chainId,
	chainName,
	rpcUrls
}: {
	chainId: number;
	chainName: string;
	rpcUrls: string[];
}) => {
	if (!window.ethereum) {
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
