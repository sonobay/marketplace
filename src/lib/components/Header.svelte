<script lang="ts">
	import ConnectButtonWrapper from "./connect/ConnectButtonWrapper.svelte";
	import DeviceNavButton from './DeviceNavButton.svelte';
	import Logo from "./Logo.svelte";
  import { chainId, connected } from 'svelte-ethers-store'
	import { variables } from "$lib/env";
	import { promptSwitchNetwork } from "$lib/utils";

  

  const correctNetwork = () => {
    switch (+variables.networkId) {
      case 1:
        return {
          chainName: 'Mainnet',
          chainId: 1,
          rpcUrls: ['https://mainnet.infura.io/v3/']
        }

      case 5: 
        return {
          chainName: 'Goerli',
          chainId: 5,
          rpcUrls: ['https://goerli.infura.io/v3/']
        }
    
      default:
        console.error(`Unsupported Network: ${+variables.networkId}`)
        break;
    }
  }

  const switchNetwork = () => {
    const targetNetwork = correctNetwork()
    if (!targetNetwork) {
      return;
    }
    promptSwitchNetwork(targetNetwork)
  }

</script>

{#if $connected && +($chainId) !== +(variables.networkId)}
  <button on:click|preventDefault={(_) => switchNetwork()} class="w-full bg-orange-500 text-white text-center py-2">
    <b>Switch Network To {correctNetwork()?.chainName}</b>
  </button>
{/if}

<header class="container mx-auto py-4 px-4">
  <div>
    <div class="flex justify-between">
      <div>
        <h1>
          <a href="/" class="flex align-items">
            <Logo />
            <div class="ml-2 h-8 flex">
              <img src="/images/sono-bay-logo.png" alt="Sonobay.xyz" />
            </div>
          </a>
        </h1>
      </div>
  
      <div class="flex">
        <div class="flex items-center text-sm border border-black border-2 rounded-xl px-4">
          <a href="/mint">Mint</a>
        </div>

        
        <DeviceNavButton />

        <ConnectButtonWrapper />
      </div>
    </div>
  </div>
</header>