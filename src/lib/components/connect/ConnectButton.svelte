<script lang="ts">
	import { connected, signerAddress, defaultEvmStores } from 'svelte-ethers-store';
	import Web3Modal from 'web3modal';
	import detectEthereumProvider from '@metamask/detect-provider';
	import { truncateAddress } from '$lib/utils';
	import { createEventDispatcher } from 'svelte';
	import AngleUp from '../icons/AngleUp.svelte';

	export let dropdownVisible: boolean;

	const connect = async () => {
		const web3Modal = new Web3Modal({
			providerOptions: {
				injected: {
					package: detectEthereumProvider()
				}
			}
		});
		const provider = await web3Modal.connect();
		defaultEvmStores.setProvider(provider);
	};

	const baseClass =
		'bg-midiYellow border-midiYellow border-2 text-black rounded-3xl py-2 px-4 uppercase text-sm';

	const dispatch = createEventDispatcher();
</script>

{#if !$connected}
	<button type="button" on:click={(_) => connect()} class={`${baseClass}`}> Connect Wallet </button>
{:else}
	<button
		on:click|preventDefault={(_) => dispatch('toggleDropdown')}
		class={`${baseClass} font-bold flex align-items`}
	>
		<span>{truncateAddress($signerAddress)}</span>
		<div class={`${dropdownVisible ? '' : 'rotate-180'} ml-2`}>
			<AngleUp size={16} />
		</div>
	</button>
{/if}
