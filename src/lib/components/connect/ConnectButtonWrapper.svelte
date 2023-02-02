<script lang="ts">
	import ConnectButton from "./ConnectButton.svelte";
	import ConnectedDropdown from "./ConnectedDropdown.svelte";
  import { signerAddress } from 'svelte-ethers-store'

  let dropdownVisible = false;

</script>

<div class="relative">
  <ConnectButton {dropdownVisible} on:toggleDropdown={() => dropdownVisible = !dropdownVisible} />
  {#if dropdownVisible && $signerAddress}
    <ConnectedDropdown userAddress={$signerAddress} />
  {/if}
</div>