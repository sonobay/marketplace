<script lang="ts">
  import { connected, signerAddress, defaultEvmStores } from 'svelte-ethers-store'
  import Web3Modal from 'web3modal'
  import detectEthereumProvider from '@metamask/detect-provider'
  import {truncateAddress} from '$lib/utils';

  const connect = async () => {
    const web3Modal = new Web3Modal({
      providerOptions: {
        injected: {
          package: detectEthereumProvider(),
        },
      },
    })
    const provider = await web3Modal.connect()
    defaultEvmStores.setProvider(provider)
  }

  const baseClass = 'bg-midiYellow text-black rounded-lg py-2 px-4 uppercase text-sm'

</script>

{#if !$connected}

<button 
  type="button" 
  on:click={(e) => connect()}
  class={`${baseClass}`}
>
  Connect Wallet
</button>

{:else}

<div class={`${baseClass} font-bold`}>
  {truncateAddress($signerAddress)}
</div>

{/if}