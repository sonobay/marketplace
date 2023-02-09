<script lang="ts">
	import ConnectButtonWrapper from "./connect/ConnectButtonWrapper.svelte";
	import DeviceNavButton from './DeviceNavButton.svelte';
	import Logo from "./Logo.svelte";



</script>

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