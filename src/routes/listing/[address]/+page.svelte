<script lang="ts">
	import { onMount } from 'svelte';
  import { signerAddress, signer } from 'svelte-ethers-store'
  import type { BigNumber } from 'ethers'
  import { utils } from 'ethers'
	import type { IPFSMetadata } from '$lib/types/ipfs-metadata';
	import { truncateAddress } from '$lib/utils';
	import Dialog from '$lib/components/Dialog.svelte';
  import { page } from '$app/stores';
	import Button from '$lib/components/Button.svelte';
	import { buyItems, cancelListing } from '$lib/utils/listing.contract';

  export let data: {
		availableAmount: BigNumber,
		totalAmount: BigNumber,
		price: BigNumber,
		seller: string,
		tokenId: BigNumber,
    ipfsMetadata: IPFSMetadata,
    listed: boolean
	};
  let { availableAmount, totalAmount, price, seller, tokenId, ipfsMetadata, listed } = data;
  let dialogVisible = false;
  const listingAddress = $page.params.address;
  let purchaseProcessing = false;
  $: amountToBuy = 1;

  console.log('data is: ', data)

  const setAmountToBuy = (e: Event) => {
    const target = e.target as HTMLInputElement;
    amountToBuy = Math.ceil(+target.value)
  }

  const purchase = async () => {
    if (!signer) {
      return;
    }
    purchaseProcessing = true;

    await buyItems({amount: amountToBuy, address: listingAddress, signer: $signer, price}) 
    purchaseProcessing = false;
    dialogVisible = false;
  }

  const _cancelListing = async () => {
    if (!$signer) {
      return;
    }
    const success = await cancelListing(listingAddress, $signer)

    if (success) {
      listed = false;
    }
  }

  onMount(() => {

  })

</script>

<div class="flex flex-col">

  <h1 class="text-lg">{ipfsMetadata.name} Listing by {truncateAddress(seller)}</h1>

  <a class="text-link mb-8" href={`/midi/${tokenId}`}>↤ View more listings for {ipfsMetadata.name}</a>
  
  <div class="flex flex-col">

    {#if listed}

      {#if availableAmount}
        <span>Available: {availableAmount.toString()}</span>
      {:else}
        <span>Available: ...</span>
      {/if}

    {:else}
      <div>Available: <span class="font-bold text-yellow-600">Listing Canceled</span></div>
    {/if}

    <span>Total Amount: {totalAmount}</span>
    <span>price: {utils.formatEther(price)} ETH</span>
    <span>tokenId: {tokenId}</span>
    <div>listed by user: <a href={`/users/${seller}`}>{truncateAddress(seller)}</a></div>

    {#if availableAmount?.isZero() && listed}
      <span>SOLD OUT</span>
    {/if}

  </div>

  {#if listed}

  <div class="flex">
    <div class="mr-1">
      <Button on:click={() => dialogVisible = true} text="Buy" disabled={!$signer || !availableAmount || availableAmount?.isZero()} />
    </div>
    

    {#if $signerAddress == seller}
      <Button on:click={() => _cancelListing()} text="Cancel Listing" />
    {/if}
  </div>

  {/if}

</div>

<!-- modal -->
<Dialog
  visible={dialogVisible} 
  on:close={() => dialogVisible = false} 
  headerText={`Buy ${ipfsMetadata.name} @ ${utils.formatEther(price)}`}
>
    <!-- Modal body -->
    <div class="p-6 space-y-6">
      <div class="mb-6">
        <div class="flex justify-between">
          <label for={`${listingAddress}-amountToBuy`} class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"># to buy</label>
        </div>
        <input type="number" value={amountToBuy} on:input={setAmountToBuy} id={`${listingAddress}-amountToBuy`} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
      </div>

      <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
        lorem ipsum about listing MIDI NFT
      </p>

      <div class="font-xl text-white">
        <span>Total:</span>
        <span>{amountToBuy ? utils.formatEther(price.mul(amountToBuy)) : '0'} ETH</span>
      </div>

    </div>

    <!-- Modal footer -->
    <div class="flex items-center p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600">
      <Button on:click={(_) => purchase()} text="Buy MIDI" loading={purchaseProcessing} disabled={purchaseProcessing} />
    </div>
</Dialog>